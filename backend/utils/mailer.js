const nodemailer = require("nodemailer");

let transporterPromise = null;

async function getTransporter() {
  // If user configured SMTP in env, use that
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
}

async function sendOtpEmail({ to, otp }) {
  if (!transporterPromise) transporterPromise = getTransporter();
  const transporter = await transporterPromise;

  const from = process.env.MAIL_FROM;

  const info = await transporter.sendMail({
    from,
    to,
    subject: "Your E-Voting Password Reset OTP",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5">
        <h2>Password Reset OTP</h2>
        <p>Your OTP is:</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${otp}</div>
        <p style="margin-top: 12px;">This OTP expires in <b>5 minutes</b>.</p>
      </div>
    `,
  });

  // Ethereal preview URL for testing (shows email in browser)
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log("📩 OTP Email Preview:", previewUrl);
  }

  return { previewUrl };
}

async function sendVoteConfirmationEmail({
  to,
  voterName,
  candidateName,
  partyName,
}) {
  if (!transporterPromise) transporterPromise = getTransporter();
  const transporter = await transporterPromise;

  const from =
    process.env.MAIL_FROM || "E-Voting System <no-reply@evoting.local>";

  const subject = "Vote Confirmation — E-Voting System";

  const text = `Hello ${voterName || "Voter"},
Thank you for using E-Voting System.
Your vote has been successfully recorded.

Voted Candidate: ${candidateName}
Party: ${partyName}

This is an automated confirmation email.`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin: 0 0 10px;">✅ Vote Confirmed</h2>
      <p style="margin: 0 0 12px;">
        Hello <b>${voterName || "Voter"}</b>,
      </p>
      <p style="margin: 0 0 12px;">
        Thanks for choosing <b>E-Voting System</b> as your trusted digital election platform.
        Your vote has been <b>successfully recorded</b>.
      </p>

      <div style="padding: 12px 14px; border: 1px solid #dbeafe; background: #eff6ff; border-radius: 10px;">
        <p style="margin: 0;"><b>Voted Candidate:</b> ${candidateName}</p>
        <p style="margin: 6px 0 0;"><b>Party:</b> ${partyName}</p>
      </div>

      <p style="margin: 14px 0 0; font-size: 12px; color: #64748b;">
        This is an automated email for confirmation purposes.
      </p>
    </div>
  `;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  // For Ethereal testing only (if you're using it somewhere)
  const previewUrl = nodemailer.getTestMessageUrl?.(info);
  if (previewUrl) console.log("📩 Vote Email Preview:", previewUrl);

  return { ok: true };
}

module.exports = { sendOtpEmail, sendVoteConfirmationEmail };
