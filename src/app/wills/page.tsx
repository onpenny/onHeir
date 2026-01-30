import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function WillsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const wills = await prisma.will.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <a href="/dashboard" className="text-xl font-bold text-gray-900">
                OnHeritage
              </a>
              <a href="/dashboard" className="text-gray-700 hover:text-blue-600">
                儀表板
              </a>
              <a href="/family" className="text-gray-700 hover:text-blue-600">
                族譜
              </a>
              <a href="/assets" className="text-gray-700 hover:text-blue-600">
                資產
              </a>
              <a href="/wills" className="text-blue-600 font-medium">
                遺囑
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{session.user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            遺囑管理
          </h1>
          <p className="text-gray-600">
            管理您的遺囑和資產分配計劃
          </p>
        </div>

        {wills.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">📜</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              尚未創建遺囑
            </h3>
            <p className="text-gray-600 mb-6">
              創建您的第一個遺囑，開始規劃資產分配
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              創建遺囑
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wills.map((will) => (
              <div
                key={will.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {will.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      will.status === "active"
                        ? "bg-green-100 text-green-800"
                        : will.status === "executed"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {will.status === "active"
                      ? "生效中"
                      : will.status === "executed"
                      ? "已執行"
                      : "草稿"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {will.content}
                </p>
                <div className="border-t border-gray-200 pt-4 text-sm text-gray-500">
                  <p>
                    創建於：{new Date(will.createdAt).toLocaleDateString("zh-TW")}
                  </p>
                  {will.updatedAt !== will.createdAt && (
                    <p>
                      更新於：{new Date(will.updatedAt).toLocaleDateString("zh-TW")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
