import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// PUT - 更新遺囑
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

    // 驗證遺囑是否屬於當前用戶
    const existingWill = await prisma.will.findUnique({
      where: { id: params.id },
    });

    if (!existingWill || existingWill.userId !== session.user.id) {
      return NextResponse.json(
        { error: "無權限操作此遺囑" },
        { status: 403 }
      );
    }

    const will = await prisma.will.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(will);
  } catch (error) {
    console.error("更新遺囑錯誤:", error);
    return NextResponse.json(
      { error: "更新遺囑失敗" },
      { status: 500 }
    );
  }
}

// DELETE - 刪除遺囑
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

    // 驗證遺囑是否屬於當前用戶
    const existingWill = await prisma.will.findUnique({
      where: { id: params.id },
    });

    if (!existingWill || existingWill.userId !== session.user.id) {
      return NextResponse.json(
        { error: "無權限操作此遺囑" },
        { status: 403 }
      );
    }

    await prisma.will.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "遺囑已刪除" });
  } catch (error) {
    console.error("刪除遺囑錯誤:", error);
    return NextResponse.json(
      { error: "刪除遺囑失敗" },
      { status: 500 }
    );
  }
}
