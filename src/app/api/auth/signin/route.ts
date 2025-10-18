import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import tokenVerify from "@/utils/token";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    // --- Validation ---
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // --- Check user existence ---
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // --- Verify password ---
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // --- Generate token ---
    const token = tokenVerify(user._id.toString());

    // --- Remove password from response ---
    const { password: _, ...userWithoutPassword } = user.toObject();

    // --- Send response with cookie ---
    const response = NextResponse.json({
      status: 200,
      message: "Login successful",
      data: userWithoutPassword,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { status: 500, message: "Something went wrong", error},
      { status: 500 }
    );
  }
}
