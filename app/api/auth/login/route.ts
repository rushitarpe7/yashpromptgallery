import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Set admin session cookie
    const cookieStore = await cookies();
    cookieStore.set("authjs.session-token", admin._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    cookieStore.set("admin_logged_in", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: admin._id.toString(),
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error during login" },
      { status: 500 }
    );
  }
}
