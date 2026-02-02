import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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
    const { triggerType, data } = body;

    // 創建通知
    let title = "";
    let message = "";
    let type = "system";

    switch (triggerType) {
      case "will_created":
        title = "新遺囑已創建";
        message = "您的遺囑草稿已保存。";
        type = "will";
        break;

      case "will_activated":
        title = "遺囑已生效";
        message = "您的遺囑已經生效。";
        type = "will";
        break;

      case "asset_created":
        title = "新資產已添加";
        message = `您添加了一個新資產：${data?.name || "未知"}`;
        type = "asset";
        break;

      case "asset_allocation_changed":
        title = "資產分配已更新";
        message = "您的資產分配規則已更新。";
        type = "asset";
        break;

      case "family_member_added":
        title = "新成員已添加";
        message = `新成員 ${data?.memberName || ""} 已加入您的家族。`;
        type = "family";
        break;

      case "donation_created":
        title = "新捐贈意願已記錄";
        message = `您的${data?.type || "捐贈"}意願已成功記錄。`;
        type = "donation";
        break;

      default:
        return NextResponse.json(
          { error: "無效的觸發器類型" },
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

    // 發送實時通知（如果用戶在線）
    // 這裡可以集成 WebSocket 或 SSE
    // 目前簡化為創建通知記錄

    return NextResponse.json({
      notification,
      message: "通知已創建",
    }, { status: 201 });
  } catch (error) {
    console.error("觸發通知錯誤:", error);
    return NextResponse.json(
      { error: "觸發通知失敗" },
      { status: 500 }
    );
  }
}
