import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                OnHeritage
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {session.user?.email}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            歡迎回來，{session.user?.name || "用戶"}
          </h2>
          <p className="text-gray-600 mt-2">
            管理您的遺產和資產
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">總資產</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">HK$0</p>
            <p className="text-sm text-gray-600 mt-2">尚未添加資產</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">家族成員</h3>
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600 mt-2">尚未添加成員</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">遺囑</h3>
              <span className="text-2xl">📜</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600 mt-2">尚未創建遺囑</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">通知</h3>
              <span className="text-2xl">🔔</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600 mt-2">暫無通知</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            快速開始
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/family"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🏠</span>
                <h4 className="font-semibold text-gray-900">創建族譜</h4>
              </div>
              <p className="text-sm text-gray-600">
                添加家族成員和關係
              </p>
            </a>

            <a
              href="/assets"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">💎</span>
                <h4 className="font-semibold text-gray-900">添加資產</h4>
              </div>
              <p className="text-sm text-gray-600">
                記錄您的資產和投資
              </p>
            </a>

            <a
              href="/wills"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">📝</span>
                <h4 className="font-semibold text-gray-900">創建遺囑</h4>
              </div>
              <p className="text-sm text-gray-600">
                規劃您的資產分配
              </p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
