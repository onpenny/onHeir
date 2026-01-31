import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - 獲取用戶的所有捐贈
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const donations = await prisma.donation.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(donations);
  } catch (error) {
    console.error("獲取捐贈錯誤:", error);
    return NextResponse.json(
      { error: "獲取捐贈失敗" },
      { status: 500 }
    );
  }
}

// POST - 創建新捐贈
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
    const { type, amount, description, organization } = body;

    if (!type) {
      return NextResponse.json(
        { error: "請選擇捐贈類型" },
        { status: 400 }
      );
    }

    const donation = await prisma.donation.create({
      data: {
        userId: session.user.id,
        type,
        amount: amount || null,
        description,
        organization,
        status: "pending",
      },
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error("創建捐贈錯誤:", error);
    return NextResponse.json(
      { error: "創建捐贈失敗" },
      { status: 500 }
    );
  }
}
