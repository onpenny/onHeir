import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function AssetsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const assets = await prisma.asset.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const totalValue = assets.reduce(
    (sum, asset) => sum + (asset.value || 0),
    0
  );

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
              <a href="/assets" className="text-blue-600 font-medium">
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
            資產管理
          </h1>
          <p className="text-gray-600">
            管理您的所有資產
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            資產總覽
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">資產總數</p>
              <p className="text-2xl font-bold text-gray-900">
                {assets.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">總價值</p>
              <p className="text-2xl font-bold text-gray-900">
                HK${totalValue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">公開資產</p>
              <p className="text-2xl font-bold text-gray-900">
                {assets.filter((a) => a.isPublic).length}
              </p>
            </div>
          </div>
        </div>

        {assets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              尚未添加資產
            </h3>
            <p className="text-gray-600 mb-6">
              添加您的第一個資產，開始記錄財富
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              添加資產
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    資產名稱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    類型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    價值
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    位置
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    公開
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {asset.name}
                      </div>
                      {asset.description && (
                        <div className="text-sm text-gray-500">
                          {asset.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {asset.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        HK${asset.value?.toLocaleString() || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {asset.location || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          asset.isPublic
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {asset.isPublic ? "是" : "否"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
