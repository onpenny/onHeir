import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// DELETE - 刪除資產分配規則
export async function DELETE(
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

    // 獲取分配規則
    const allocation = await prisma.assetAllocation.findUnique({
      where: { id: params.id },
    });

    if (!allocation) {
      return NextResponse.json(
        { error: "分配規則不存在" },
        { status: 404 }
      );
    }

    // 驗證資產是否屬於當前用戶
    const asset = await prisma.asset.findUnique({
      where: { id: allocation.assetId },
    });

    if (!asset || asset.userId !== session.user.id) {
      return NextResponse.json(
        { error: "無權限操作此分配規則" },
        { status: 403 }
      );
    }

    await prisma.assetAllocation.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "分配規則已刪除" });
  } catch (error) {
    console.error("刪除資產分配錯誤:", error);
    return NextResponse.json(
      { error: "刪除資產分配失敗" },
      { status: 500 }
    );
  }
}
