import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - 獲取家族的所有成員
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const members = await prisma.familyMember.findMany({
      where: {
        familyId: params.id,
      },
      include: {
        user: true,
      },
      orderBy: {
        priority: "asc",
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("獲取家族成員錯誤:", error);
    return NextResponse.json(
      { error: "獲取家族成員失敗" },
      { status: 500 }
    );
  }
}

// POST - 添加家族成員
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId, relationship, priority } = body;

    if (!userId || !relationship) {
      return NextResponse.json(
        { error: "請填寫用戶 ID 和關係" },
        { status: 400 }
      );
    }

    // 檢查用戶是否存在
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "用戶不存在" },
        { status: 404 }
      );
    }

    const member = await prisma.familyMember.create({
      data: {
        familyId: params.id,
        userId,
        relationship,
        priority: priority || 0,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("添加家族成員錯誤:", error);
    return NextResponse.json(
      { error: "添加家族成員失敗" },
      { status: 500 }
    );
  }
}
