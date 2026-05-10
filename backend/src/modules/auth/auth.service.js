const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");
const { generateVerificationToken, hashVerificationToken } = require("./auth.utils");

async function signupUser({ email, password }) {
  const [existingUsers] = await db.execute(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (existingUsers.length > 0) {
    return {
      error: "An account with this email already exists.",
      statusCode: 409,
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { rawToken, tokenHash, expiresAt } = generateVerificationToken();

  const [result] = await db.execute(
    `
      INSERT INTO users (
        email,
        password_hash,
        is_email_verified,
        email_verification_token_hash,
        email_verification_expires_at
      )
      VALUES (?, ?, 0, ?, ?)
    `,
    [email, passwordHash, tokenHash, expiresAt]
  );

  return {
    data: {
      id: result.insertId,
      email,
      isEmailVerified: false,
      verificationToken: process.env.NODE_ENV === "production" ? undefined : rawToken,
      verificationExpiresAt: expiresAt,
    },
  };
}

async function verifyEmailToken(rawToken) {
  const tokenHash = hashVerificationToken(rawToken);

  const [users] = await db.execute(
    `
      SELECT id, email_verification_expires_at
      FROM users
      WHERE email_verification_token_hash = ?
      LIMIT 1
    `,
    [tokenHash]
  );

  if (users.length === 0) {
    return {
      error: "Invalid verification token.",
      statusCode: 404,
    };
  }

  const user = users[0];

  if (
    !user.email_verification_expires_at ||
    new Date(user.email_verification_expires_at).getTime() < Date.now()
  ) {
    return {
      error: "Verification token has expired.",
      statusCode: 400,
    };
  }

  await db.execute(
    `
      UPDATE users
      SET
        is_email_verified = 1,
        email_verification_token_hash = NULL,
        email_verification_expires_at = NULL
      WHERE id = ?
    `,
    [user.id]
  );

  return {
    data: {
      message: "Email verified successfully.",
    },
  };
}

async function loginUser({ email, password }) {
  const [users] = await db.execute(
    `
      SELECT id, email, password_hash, is_email_verified
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [email]
  );

  if (users.length === 0) {
    return {
      error: "Invalid email or password.",
      statusCode: 400,
    };
  }

  const user = users[0];
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return {
      error: "Invalid email or password.",
      statusCode: 400,
    };
  }

  if (user.is_email_verified !== 1) {
    return {
      error: "Email is not verified yet.",
      statusCode: 400,
    };
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET || "dev_jwt_secret_change_me",
    { expiresIn: "1h" }
  );

  return {
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        isEmailVerified: true,
      },
    },
  };
}

module.exports = {
  signupUser,
  verifyEmailToken,
  loginUser,
};
