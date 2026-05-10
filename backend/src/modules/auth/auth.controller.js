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
      emailDelivered: result.data.emailDelivered === true,
      devVerification: result.data.verificationToken
        ? {
            token: result.data.verificationToken,
            expiresAt: result.data.verificationExpiresAt,
            link: result.data.verificationLink,
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

function renderVerifyEmailPage({ statusCode, title, heading, message }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f3f4f6; margin: 0;
           min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: #ffffff; padding: 32px 36px; border-radius: 10px;
            box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08); max-width: 460px; width: 90%; }
    h1 { color: ${statusCode < 400 ? "#15803d" : "#b91c1c"}; margin-top: 0; font-size: 22px; }
    p { color: #1f2937; line-height: 1.5; }
    a { color: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${heading}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}

async function verifyEmailFromLink(req, res) {
  try {
    const validation = validateVerifyEmailInput({ token: req.query.token });

    if (validation.error) {
      return res
        .status(400)
        .type("html")
        .send(
          renderVerifyEmailPage({
            statusCode: 400,
            title: "Verification failed",
            heading: "Verification failed",
            message: validation.error,
          })
        );
    }

    const result = await verifyEmailToken(validation.data.token);

    if (result.error) {
      const statusCode = result.statusCode || 400;
      return res
        .status(statusCode)
        .type("html")
        .send(
          renderVerifyEmailPage({
            statusCode,
            title: "Verification failed",
            heading: "Verification failed",
            message: result.error,
          })
        );
    }

    return res
      .status(200)
      .type("html")
      .send(
        renderVerifyEmailPage({
          statusCode: 200,
          title: "Email verified",
          heading: "Email verified!",
          message:
            "Your CSUB email has been verified. You can now close this tab and log in to RunnerQuest.",
        })
      );
  } catch (error) {
    console.error("Verify email (link) error:", error);
    return res
      .status(500)
      .type("html")
      .send(
        renderVerifyEmailPage({
          statusCode: 500,
          title: "Verification failed",
          heading: "Something went wrong",
          message: "Please try clicking the link again in a few seconds.",
        })
      );
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
  verifyEmailFromLink,
  login,
  me,
};
