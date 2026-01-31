import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - 獲取資產的分配規則
export async function GET(
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

    const allocations = await prisma.assetAllocation.findMany({
      where: {
        assetId: params.id,
      },
    });

    return NextResponse.json(allocations);
  } catch (error) {
    console.error("獲取資產分配錯誤:", error);
    return NextResponse.json(
      { error: "獲取資產分配失敗" },
      { status: 500 }
    );
  }
}

// POST - 創建資產分配規則
export async function POST(
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
    const { familyId, memberId, percentage } = body;

    if (!percentage || percentage <= 0 || percentage > 100) {
      return NextResponse.json(
        { error: "分配百分比必須在 0-100 之間" },
        { status: 400 }
      );
    }

    // 驗證資產是否屬於當前用戶
    const asset = await prisma.asset.findUnique({
      where: { id: params.id },
    });

    if (!asset || asset.userId !== session.user.id) {
      return NextResponse.json(
        { error: "無權限操作此資產" },
        { status: 403 }
      );
    }

    // 檢查分配總數是否超過 100%
    const existingAllocations = await prisma.assetAllocation.findMany({
      where: { assetId: params.id },
    });

    const totalPercentage = existingAllocations.reduce(
      (sum, alloc) => sum + alloc.percentage,
      0
    );

    if (totalPercentage + percentage > 100) {
      return NextResponse.json(
        { error: `分配總數不能超過 100%，當前已分配 ${totalPercentage}%` },
        { status: 400 }
      );
    }

    const allocation = await prisma.assetAllocation.create({
      data: {
        assetId: params.id,
        familyId,
        memberId,
        percentage,
      },
    });

    return NextResponse.json(allocation, { status: 201 });
  } catch (error) {
    console.error("創建資產分配錯誤:", error);
    return NextResponse.json(
      { error: "創建資產分配失敗" },
      { status: 500 }
    );
  }
}
