import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - 獲取用戶的通知
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // 只返回最近50條
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("獲取通知錯誤:", error);
    return NextResponse.json(
      { error: "獲取通知失敗" },
      { status: 500 }
    );
  }
}

// POST - 創建通知
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
    const { type, title, message } = body;

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: "請填寫通知類型、標題和消息" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        userId: session.user.id,
        type,
        title,
        message,
        isRead: false,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("創建通知錯誤:", error);
    return NextResponse.json(
      { error: "創建通知失敗" },
      { status: 500 }
    );
  }
}

// PUT - 標記通知為已讀
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { notificationIds } = body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: "無效的請求" },
        { status: 400 }
      );
    }

    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
        userId: session.user.id,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ message: "通知已標記為已讀" });
  } catch (error) {
    console.error("標記通知錯誤:", error);
    return NextResponse.json(
      { error: "標記通知失敗" },
      { status: 500 }
    );
  }
}
