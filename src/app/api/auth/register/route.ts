import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "請輸入電子郵件和密碼" },
        { status: 400 }
      );
    }

    // 檢查用戶是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "此電子郵件已被使用" },
        { status: 400 }
      );
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 創建用戶
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "註冊成功", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("註冊錯誤:", error);
    return NextResponse.json(
      { error: "註冊失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
