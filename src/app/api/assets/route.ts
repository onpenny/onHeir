import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - 獲取用戶的所有資產
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const assets = await prisma.asset.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("獲取資產錯誤:", error);
    return NextResponse.json(
      { error: "獲取資產失敗" },
      { status: 500 }
    );
  }
}

// POST - 創建新資產
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
    const {
      type,
      name,
      description,
      value,
      currency,
      location,
      provider,
      accountNum,
      isPublic,
    } = body;

    if (!type || !name) {
      return NextResponse.json(
        { error: "請填寫資產類型和名稱" },
        { status: 400 }
      );
    }

    const asset = await prisma.asset.create({
      data: {
        userId: session.user.id,
        type,
        name,
        description,
        value: value || null,
        currency: currency || "CNY",
        location,
        provider,
        accountNum,
        isPublic: isPublic || false,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("創建資產錯誤:", error);
    return NextResponse.json(
      { error: "創建資產失敗" },
      { status: 500 }
    );
  }
}
