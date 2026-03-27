import sql from "../../config/db.js";

const createUser = async (name, email, password) => {
  const result = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${password})
    RETURNING id, name, email
  `;
  return result[0];
};

const findUserByEmail = async (email) => {
  const result = await sql`
    SELECT id, name, email, password
    FROM users
    WHERE email = ${email}
  `;
  return result[0]; // undefined if not found
};



const createGoogleUser = async (name, email, googleId) => {
  const res = await sql`
    INSERT INTO users (name, email, google_id)
    VALUES (${name}, ${email}, ${googleId})
    RETURNING *
  `;
  return res[0];
};




const findUserByGoogleId = async (googleId) => {
  const result = await sql`
    SELECT *
    FROM users
    WHERE google_id = ${googleId}
  `;
  return result[0];
};

const findUserById = async (userId) => {
  const result = await sql`
    SELECT user_id, full_name AS name, email, virtual_balance, created_at
    FROM users
    WHERE user_id = ${userId}
  `;
  return result[0];
};

const updateUser = async (userId, { name }) => {
  const result = await sql`
    UPDATE users
    SET full_name = ${name}
    WHERE user_id = ${userId}
    RETURNING user_id, full_name AS name, email, virtual_balance
  `;
  return result[0];
};

const updateUserBalance = async (userId, money) => {
  const result = await sql`
    UPDATE users
    SET virtual_balance = ${money}
    WHERE user_id = ${userId}
    RETURNING user_id, full_name AS name, email, virtual_balance
  `;
  return result[0];
};

export{
  createUser,
  findUserByEmail,
  createGoogleUser,
  findUserByGoogleId,
  findUserById,
  updateUser,
  updateUserBalance
};