const crypto = require("crypto");
const { VERIFICATION_TOKEN_TTL_HOURS } = require("./auth.constants");

function hashVerificationToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function generateVerificationToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashVerificationToken(rawToken);
  const expiresAt = new Date(
    Date.now() + VERIFICATION_TOKEN_TTL_HOURS * 60 * 60 * 1000
  );

  return {
    rawToken,
    tokenHash,
    expiresAt,
  };
}

module.exports = {
  generateVerificationToken,
  hashVerificationToken,
};
