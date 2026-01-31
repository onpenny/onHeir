import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: "已登出" },
      { status: 200 }
    );

    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("next-auth.csrf-token");

    return response;
  } catch (error) {
    console.error("登出錯誤:", error);
    return NextResponse.json(
      { error: "登出失敗" },
      { status: 500 }
    );
  }
}
