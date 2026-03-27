import crypto from "crypto";
import bcrypt from "bcrypt";
import sql from "../../config/db.js";

/**
 * Generates a secure random reset token, stores its hash and expiry in the DB,
 * and returns the plain token to be delivered to the user (via email etc.).
 */
const createPasswordResetToken = async (userId) => {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await sql`
    UPDATE users
    SET reset_token = ${tokenHash},
        reset_token_expires = ${expiresAt}
    WHERE user_id = ${userId}
  `;

  return token; // Return plain token (to send via email/SMS)
};

/**
 * Finds a user whose reset token matches and has not expired.
 */
const findUserByResetToken = async (token) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const result = await sql`
    SELECT *
    FROM users
    WHERE reset_token = ${tokenHash}
      AND reset_token_expires > NOW()
  `;
  return result[0];
};

/**
 * Sets a new hashed password and clears the reset token fields.
 */
const resetUserPassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await sql`
    UPDATE users
    SET password = ${hashedPassword},
        reset_token = NULL,
        reset_token_expires = NULL
    WHERE user_id = ${userId}
  `;
};

export { createPasswordResetToken, findUserByResetToken, resetUserPassword };
