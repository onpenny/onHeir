import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("開始資料庫遷移...")

  // 檢查是否已有資料
  const userCount = await prisma.user.count()
  if (userCount === 0) {
    console.log("創建測試用戶...")

    // 創建測試用戶
    const testUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "$2a$10$abcdefghijklmnopqrstuv", // bcrypt hash of "password"
        name: "測試用戶",
      },
    })

    console.log("創建測試用戶:", testUser.email)

    // 創建測試家族
    const testFamily = await prisma.family.create({
      data: {
        name: "陳氏家族",
        description: "測試家族",
        createdBy: testUser.id,
      },
    })

    console.log("創建測試家族:", testFamily.name)

    // 添加家族成員
    await prisma.familyMember.create({
      data: {
        userId: testUser.id,
        familyId: testFamily.id,
        relationship: "創建者",
        priority: 0,
      },
    })

    console.log("添加家族成員")

    // 創建測試資產
    const testAssets = await Promise.all([
      prisma.asset.create({
        data: {
          userId: testUser.id,
          type: "bank",
          name: "中國銀行儲蓄賬戶",
          description: "主要儲蓄賬戶",
          value: 100000,
          currency: "HKD",
          location: "香港",
          provider: "中國銀行",
          isPublic: true,
        },
      }),
      prisma.asset.create({
        data: {
          userId: testUser.id,
          type: "real_estate",
          name: "香港公寓",
          description: "位於港島的公寓",
          value: 5000000,
          currency: "HKD",
          location: "香港",
          isPublic: true,
        },
      }),
    ])

    console.log("創建測試資產:", testAssets.length, "個")

    // 創建測試遺囑
    const testWill = await prisma.will.create({
      data: {
        userId: testUser.id,
        title: "我的遺囑",
        content: "我將我的資產平均分配給我的繼承人。",
        status: "draft",
      },
    })

    console.log("創建測試遺囑:", testWill.title)
  } else {
    console.log(`資料庫已有 ${userCount} 個用戶，跳過種子資料`)
  }

  console.log("資料庫遷移完成！")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
