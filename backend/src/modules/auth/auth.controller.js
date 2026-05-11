const { signupUser, loginUser } = require("./auth.service");
const {
  validateSignupInput,
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
      message: "Signup successful.",
      user: {
        id: result.data.id,
        email: result.data.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
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
  login,
  me,
};