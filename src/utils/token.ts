import jwt from "jsonwebtoken";

const tokenVerify = (id: string): string => {
  if (!process.env.NEXT_PUBLIC_SECRET_KEY) throw new Error("SECRET_KEY is not defined");
  const token = jwt.sign(
    { userId: id },
    process.env.NEXT_PUBLIC_SECRET_KEY,
    { expiresIn: "1h" }
  );

  return token;
};

export default tokenVerify;
