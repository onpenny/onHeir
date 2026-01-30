import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function FamilyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const families = await prisma.family.findMany({
    include: {
      members: {
        include: {
          user: true,
        },
      },
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
              <a href="/family" className="text-blue-600 font-medium">
                族譜
              </a>
              <a href="/assets" className="text-gray-700 hover:text-blue-600">
                資產
              </a>
              <a href="/wills" className="text-gray-700 hover:text-blue-600">
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
            家族管理
          </h1>
          <p className="text-gray-600">
            管理您的家族成員和關係
          </p>
        </div>

        {families.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              尚未創建家族
            </h3>
            <p className="text-gray-600 mb-6">
              創建您的第一個家族，開始記錄家族成員
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              創建家族
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {families.map((family) => (
              <div
                key={family.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {family.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {family.description || "無描述"}
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">
                    成員數量：{family.members.length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
