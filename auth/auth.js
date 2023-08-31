import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ message: "auth token is required" });
  jwt.verify(token, "secretkey", (err, user) => {
    if (err) {
      console.log(err, "err");
      return res.sendStatus(403).json({ message: "yes there is an error" });
    }
    req.user = user;
    next();
  });
};
