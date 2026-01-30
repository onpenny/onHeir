import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - 獲取用戶的所有家族
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const families = await prisma.family.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(families);
  } catch (error) {
    console.error("獲取家族錯誤:", error);
    return NextResponse.json(
      { error: "獲取家族失敗" },
      { status: 500 }
    );
  }
}

// POST - 創建新家族
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
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "請填寫家族名稱" },
        { status: 400 }
      );
    }

    const family = await prisma.family.create({
      data: {
        name,
        description,
        createdBy: session.user.id,
      },
    });

    // 將創建者添加為家族成員
    await prisma.familyMember.create({
      data: {
        userId: session.user.id,
        familyId: family.id,
        relationship: "創建者",
        priority: 0,
      },
    });

    return NextResponse.json(family, { status: 201 });
  } catch (error) {
    console.error("創建家族錯誤:", error);
    return NextResponse.json(
      { error: "創建家族失敗" },
      { status: 500 }
    );
  }
}
