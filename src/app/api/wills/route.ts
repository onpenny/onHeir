import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - 獲取用戶的所有遺囑
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const wills = await prisma.will.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(wills);
  } catch (error) {
    console.error("獲取遺囑錯誤:", error);
    return NextResponse.json(
      { error: "獲取遺囑失敗" },
      { status: 500 }
    );
  }
}

// POST - 創建新遺囑
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "請填寫遺囑標題和內容" },
        { status: 400 }
      );
    }

    const will = await prisma.will.create({
      data: {
        userId: session.user.id,
        title,
        content,
        status: status || "draft",
      },
    });

    return NextResponse.json(will, { status: 201 });
  } catch (error) {
    console.error("創建遺囑錯誤:", error);
    return NextResponse.json(
      { error: "創建遺囑失敗" },
      { status: 500 }
    );
  }
}
