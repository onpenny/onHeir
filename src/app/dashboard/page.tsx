"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { TrendingUp, Users, FileText, Bell, DollarSign } from "lucide-react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalValue: 0,
    families: 0,
    wills: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [assetsRes, familiesRes, willsRes] = await Promise.all([
        fetch("/api/assets"),
        fetch("/api/families"),
        fetch("/api/wills"),
      ]);

      const assets = await assetsRes.json();
      const families = await familiesRes.json();
      const wills = await willsRes.json();

      const totalValue = assets.reduce(
        (sum: number, asset: any) => sum + (asset.value || 0),
        0
      );

      setStats({
        totalAssets: assets.length,
        totalValue,
        families: families.length,
        wills: wills.length,
        notifications: 0,
      });
    } catch (error) {
      console.error("載入統計失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                OnHeritage
              </Link>
              <Link href="/dashboard" className="text-blue-600 font-medium">
                儀表板
              </Link>
              <Link href="/family" className="text-gray-700 hover:text-blue-600">
                族譜
              </Link>
              <Link href="/assets" className="text-gray-700 hover:text-blue-600">
                資產
              </Link>
              <Link href="/wills" className="text-gray-700 hover:text-blue-600">
                遺囑
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden sm:inline">
                {session?.user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            歡迎回來，{session?.user?.name || "用戶"}
          </h2>
          <p className="text-gray-600">
            管理您的遺產和資產
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">載入中...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">總資產</h3>
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <DollarSign size={24} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  HK${stats.totalValue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {stats.totalAssets} 個資產
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">家族成員</h3>
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <Users size={24} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.families}
                </p>
                <p className="text-sm text-gray-600 mt-2">個家族</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">遺囑</h3>
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <FileText size={24} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.wills}
                </p>
                <p className="text-sm text-gray-600 mt-2">個遺囑</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">通知</h3>
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Bell size={24} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.notifications}
                </p>
                <p className="text-sm text-gray-600 mt-2">暫無通知</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                快速開始
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/family"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-3 group-hover:bg-blue-200 transition-colors">
                      <Users size={20} />
                    </div>
                    <h4 className="font-semibold text-gray-900">創建族譜</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    添加家族成員和關係
                  </p>
                </Link>

                <Link
                  href="/assets"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600 mr-3 group-hover:bg-green-200 transition-colors">
                      <DollarSign size={20} />
                    </div>
                    <h4 className="font-semibold text-gray-900">添加資產</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    記錄您的資產和投資
                  </p>
                </Link>

                <Link
                  href="/wills"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mr-3 group-hover:bg-purple-200 transition-colors">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-semibold text-gray-900">創建遺囑</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    規劃您的資產分配
                  </p>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
