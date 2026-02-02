import { prisma } from "@/lib/prisma";

export async function createNotification(
  userId: string,
  type: "system" | "asset" | "family" | "will" | "donation",
  title: string,
  message: string
) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        isRead: false,
      },
    });

    // 這裏可以集成實時通知（WebSocket、SSE、推送通知）
    // 目前只創建數據庫記錄
    console.log(`通知已創建：[${type}] ${title}`);
  } catch (error) {
    console.error("創建通知失敗:", error);
    throw error;
  }
}

export async function triggerAssetNotification(
  userId: string,
  action: "created" | "updated" | "deleted" | "allocation_changed",
  assetName: string
) {
  let title = "";
  let message = "";

  switch (action) {
    case "created":
      title = "新資產已添加";
      message = `您添加了新資產：${assetName}`;
      break;
    case "updated":
      title = "資產已更新";
      message = `您的資產「${assetName}」已更新`;
      break;
    case "deleted":
      title = "資產已刪除";
      message = `您的資產「${assetName}」已刪除`;
      break;
    case "allocation_changed":
      title = "資產分配已更新";
      message = `您的資產「${assetName}」的分配規則已更新`;
      break;
  }

  await createNotification(userId, "asset", title, message);
}

export async function triggerFamilyNotification(
  userId: string,
  action: "created" | "updated" | "deleted" | "member_added",
  familyName: string,
  memberName?: string
) {
  let title = "";
  let message = "";

  switch (action) {
    case "created":
      title = "新家族已創建";
      message = `您創建了新家族：${familyName}`;
      break;
    case "updated":
      title = "家族信息已更新";
      message = `您的家族「${familyName}」信息已更新`;
      break;
    case "deleted":
      title = "家族已刪除";
      message = `您的家族「${familyName}」已刪除`;
      break;
    case "member_added":
      title = "新成員已添加";
      message = `新成員「${memberName}」已加入您的家族「${familyName}」`;
      break;
  }

  await createNotification(userId, "family", title, message);
}

export async function triggerWillNotification(
  userId: string,
  action: "created" | "updated" | "deleted" | "activated",
  willTitle: string
) {
  let title = "";
  let message = "";

  switch (action) {
    case "created":
      title = "新遺囑已創建";
      message = `您創建了新遺囑：${willTitle}`;
      break;
    case "updated":
      title = "遺囑已更新";
      message = `您的遺囑「${willTitle}」已更新`;
      break;
    case "deleted":
      title = "遺囑已刪除";
      message = `您的遺囑「${willTitle}」已刪除`;
      break;
    case "activated":
      title = "遺囑已生效";
      message = `您的遺囑「${willTitle}」已經生效`;
      break;
  }

  await createNotification(userId, "will", title, message);
}

export async function triggerDonationNotification(
  userId: string,
  action: "created" | "updated" | "deleted",
  donationType: string,
  amount?: number
) {
  let title = "";
  let message = "";

  switch (action) {
    case "created":
      title = "新捐贈意願已記錄";
      message = `您記錄了新的${donationType}意願${amount ? `，金額：HK${amount}` : ""}`;
      break;
    case "updated":
      title = "捐贈意願已更新";
      message = `您的${donationType}意願已更新`;
      break;
    case "deleted":
      title = "捐贈意願已刪除";
      message = `您的${donationType}意願已刪除`;
      break;
  }

  await createNotification(userId, "donation", title, message);
}
