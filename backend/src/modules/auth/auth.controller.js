const { signupUser, verifyEmailToken, loginUser } = require("./auth.service");
const {
  validateSignupInput,
  validateVerifyEmailInput,
  validateLoginInput,
} = require("./auth.validation");

async function signup(req, res) {
  try {
    const validation = validateSignupInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const result = await signupUser(validation.data);

    if (result.error) {
      return res.status(result.statusCode || 400).json({ message: result.error });
    }

    return res.status(201).json({
      message:
        "Signup successful. Please verify your email before logging in.",
      user: {
        id: result.data.id,
        email: result.data.email,
        isEmailVerified: result.data.isEmailVerified,
      },
      devVerification: result.data.verificationToken
        ? {
            token: result.data.verificationToken,
            expiresAt: result.data.verificationExpiresAt,
          }
        : undefined,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function verifyEmail(req, res) {
  try {
    const validation = validateVerifyEmailInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const result = await verifyEmailToken(validation.data.token);

    if (result.error) {
      return res.status(result.statusCode || 400).json({ message: result.error });
    }

    return res.status(200).json({
      message: result.data.message,
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function login(req, res) {
  try {
    const validation = validateLoginInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const result = await loginUser(validation.data);

    if (result.error) {
      return res.status(result.statusCode || 400).json({ message: result.error });
    }

    return res.status(200).json({
      message: "Login successful.",
      token: result.data.token,
      user: result.data.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

function me(req, res) {
  return res.status(200).json({
    user: {
      id: req.user.sub,
      email: req.user.email,
    },
  });
}

module.exports = {
  signup,
  verifyEmail,
  login,
  me,
};
