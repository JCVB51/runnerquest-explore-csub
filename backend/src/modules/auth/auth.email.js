const nodemailer = require("nodemailer");
const { VERIFICATION_TOKEN_TTL_HOURS } = require("./auth.constants");

let cachedTransporter;
let cachedTransporterKey = "";

function buildTransporterKey() {
  return [
    process.env.SMTP_HOST || "",
    process.env.SMTP_PORT || "",
    process.env.SMTP_SECURE || "",
    process.env.SMTP_USER || "",
    process.env.SMTP_PASSWORD || "",
  ].join("|");
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) {
    cachedTransporter = undefined;
    cachedTransporterKey = "";
    return null;
  }

  const key = buildTransporterKey();
  if (cachedTransporter && cachedTransporterKey === key) {
    return cachedTransporter;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    process.env.SMTP_SECURE === "true" || port === 465;

  const auth = process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || "",
      }
    : undefined;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth,
  });
  cachedTransporterKey = key;

  return cachedTransporter;
}

function stripTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function buildVerificationLink(token) {
  const encodedToken = encodeURIComponent(token);
  const frontendUrl = stripTrailingSlash(process.env.FRONTEND_URL);

  if (frontendUrl) {
    return `${frontendUrl}/verify-email?token=${encodedToken}`;
  }

  const apiBase =
    stripTrailingSlash(process.env.API_BASE_URL) ||
    `http://localhost:${process.env.PORT || 3001}`;

  return `${apiBase}/api/auth/verify-email?token=${encodedToken}`;
}

function buildEmailContent(link) {
  const ttl = VERIFICATION_TOKEN_TTL_HOURS;

  const text = [
    "Welcome to RunnerQuest: Explore CSUB!",
    "",
    "Please verify your CSUB email by opening the link below:",
    link,
    "",
    `This link will expire in ${ttl} hours.`,
    "",
    "If you did not sign up, you can safely ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
      <h2 style="color:#0f172a;">Welcome to RunnerQuest: Explore CSUB!</h2>
      <p>Please verify your CSUB email to finish creating your account.</p>
      <p style="margin: 24px 0;">
        <a href="${link}"
           style="background:#1d4ed8;color:#ffffff;text-decoration:none;
                  padding:10px 18px;border-radius:6px;display:inline-block;">
          Verify my email
        </a>
      </p>
      <p>If the button does not work, paste this link in your browser:</p>
      <p><a href="${link}">${link}</a></p>
      <p style="color:#6b7280;font-size:12px;">
        This link will expire in ${ttl} hours. If you did not sign up,
        you can safely ignore this email.
      </p>
    </div>
  `;

  return { text, html };
}

async function sendVerificationEmail({ to, token }) {
  const link = buildVerificationLink(token);
  const transporter = getTransporter();

  if (!transporter) {
    // Dev fallback: SMTP isn't configured. Don't fail signup.
    // Log the link prominently so devs can copy it from terminal.
    console.warn(
      `[auth.email] SMTP not configured. Verification link for ${to}:\n  ${link}`
    );
    return { delivered: false, link, reason: "smtp_not_configured" };
  }

  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    "RunnerQuest <no-reply@csub.local>";

  const { text, html } = buildEmailContent(link);

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: "Verify your RunnerQuest account",
      text,
      html,
    });

    return {
      delivered: true,
      link,
      messageId: info && info.messageId,
    };
  } catch (error) {
    console.error(
      `[auth.email] Failed to send verification email to ${to}:`,
      error && error.message ? error.message : error
    );
    return {
      delivered: false,
      link,
      reason: "send_failed",
      error: error && error.message ? error.message : String(error),
    };
  }
}

module.exports = {
  buildVerificationLink,
  sendVerificationEmail,
};
