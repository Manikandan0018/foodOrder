import jwt from 'jsonwebtoken';

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

 res.cookie("jwt", token, {
  maxAge: 15*24*60*60*1000, // 15 days in ms
  httpOnly: true,
  sameSite: "lax", // allow sending on localhost
  secure: process.env.NODE_ENV === "production", // only true in prod
});

};

export default generateToken;
