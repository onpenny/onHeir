import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// PUT - 更新捐贈
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

    // 驗證捐贈是否屬於當前用戶
    const existingDonation = await prisma.donation.findUnique({
      where: { id: params.id },
    });

    if (!existingDonation || existingDonation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "無權限操作此捐贈" },
        { status: 403 }
      );
    }

    const donation = await prisma.donation.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(donation);
  } catch (error) {
    console.error("更新捐贈錯誤:", error);
    return NextResponse.json(
      { error: "更新捐贈失敗" },
      { status: 500 }
    );
  }
}

// DELETE - 刪除捐贈
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

    // 驗證捐贈是否屬於當前用戶
    const existingDonation = await prisma.donation.findUnique({
      where: { id: params.id },
    });

    if (!existingDonation || existingDonation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "無權限操作此捐贈" },
        { status: 403 }
      );
    }

    await prisma.donation.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "捐贈已刪除" });
  } catch (error) {
    console.error("刪除捐贈錯誤:", error);
    return NextResponse.json(
      { error: "刪除捐贈失敗" },
      { status: 500 }
    );
  }
}
