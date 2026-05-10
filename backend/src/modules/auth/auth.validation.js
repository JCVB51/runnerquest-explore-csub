const {
  ALLOWED_EMAIL_DOMAIN,
  MIN_PASSWORD_LENGTH,
} = require("./auth.constants");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidCsubEmail(email) {
  if (!email.includes("@")) {
    return false;
  }

  return email.endsWith(ALLOWED_EMAIL_DOMAIN);
}

function validateSignupInput(payload) {
  const normalizedEmail = normalizeEmail(payload.email);
  const password = String(payload.password || "");

  if (!normalizedEmail) {
    return { error: "Email is required." };
  }

  if (!isValidCsubEmail(normalizedEmail)) {
    return { error: "Only @csub.edu email addresses are allowed." };
  }

  if (!password) {
    return { error: "Password is required." };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }

  return {
    data: {
      email: normalizedEmail,
      password,
    },
  };
}

function validateVerifyEmailInput(payload) {
  const token = String(payload.token || "").trim();

  if (!token) {
    return { error: "Verification token is required." };
  }

  return {
    data: {
      token,
    },
  };
}

function validateLoginInput(payload) {
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");

  if (!email) {
    return { error: "Email is required." };
  }

  if (!password) {
    return { error: "Password is required." };
  }

  return {
    data: {
      email,
      password,
    },
  };
}

module.exports = {
  validateSignupInput,
  validateVerifyEmailInput,
  validateLoginInput,
};
