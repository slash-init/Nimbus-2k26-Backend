import jwt from "jsonwebtoken";

/**
 * Middleware to authenticate requests using a Bearer JWT token.
 * Attaches the decoded payload (userId) to req.user on success.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorised, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId: "..." }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorised, token is invalid or expired" });
  }
};

export default protect;
