import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// PUT - 更新資產
export async function PUT(
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

    // 驗證資產是否屬於當前用戶
    const existingAsset = await prisma.asset.findUnique({
      where: { id: params.id },
    });

    if (!existingAsset || existingAsset.userId !== session.user.id) {
      return NextResponse.json(
        { error: "無權限操作此資產" },
        { status: 403 }
      );
    }

    const asset = await prisma.asset.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error("更新資產錯誤:", error);
    return NextResponse.json(
      { error: "更新資產失敗" },
      { status: 500 }
    );
  }
}

// DELETE - 刪除資產
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

    // 驗證資產是否屬於當前用戶
    const existingAsset = await prisma.asset.findUnique({
      where: { id: params.id },
    });

    if (!existingAsset || existingAsset.userId !== session.user.id) {
      return NextResponse.json(
        { error: "無權限操作此資產" },
        { status: 403 }
      );
    }

    await prisma.asset.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "資產已刪除" });
  } catch (error) {
    console.error("刪除資產錯誤:", error);
    return NextResponse.json(
      { error: "刪除資產失敗" },
      { status: 500 }
    );
  }
}
