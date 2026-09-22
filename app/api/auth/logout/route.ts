import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("authjs.session-token");
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("admin_logged_in");

  return NextResponse.json({ success: true });
}
