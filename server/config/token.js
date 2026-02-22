import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(
    { id: userId },           // payload
    process.env.JWT_SECRET,   // secret key
    { expiresIn: "10d" }      // options
  );

  return token;
};

export default generateToken;