const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

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

  const [result] = await db.execute(
    `
      INSERT INTO users (
        email,
        password_hash
      )
      VALUES (?, ?)
    `,
    [email, passwordHash]
  );

  return {
    data: {
      id: result.insertId,
      email
    },
  };
}

async function loginUser({ email, password }) {
  const [users] = await db.execute(
    `
      SELECT id, email, password_hash
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
        email: user.email
      },
    },
  };
}

module.exports = {
  signupUser,
  loginUser,
};