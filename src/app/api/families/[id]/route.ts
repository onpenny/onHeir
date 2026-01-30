import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// PUT - 更新家族
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

    // 驗證家族是否由當前用戶創建
    const existingFamily = await prisma.family.findUnique({
      where: { id: params.id },
    });

    if (!existingFamily || existingFamily.createdBy !== session.user.id) {
      return NextResponse.json(
        { error: "無權限操作此家族" },
        { status: 403 }
      );
    }

    const family = await prisma.family.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(family);
  } catch (error) {
    console.error("更新家族錯誤:", error);
    return NextResponse.json(
      { error: "更新家族失敗" },
      { status: 500 }
    );
  }
}

// DELETE - 刪除家族
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

    // 驗證家族是否由當前用戶創建
    const existingFamily = await prisma.family.findUnique({
      where: { id: params.id },
    });

    if (!existingFamily || existingFamily.createdBy !== session.user.id) {
      return NextResponse.json(
        { error: "無權限操作此家族" },
        { status: 403 }
      );
    }

    await prisma.family.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "家族已刪除" });
  } catch (error) {
    console.error("刪除家族錯誤:", error);
    return NextResponse.json(
      { error: "刪除家族失敗" },
      { status: 500 }
    );
  }
}
