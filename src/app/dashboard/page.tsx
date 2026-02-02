"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { TrendingUp, Users, FileText, Bell, DollarSign, Activity, Settings, LogOut } from "lucide-react";
import NotificationPanel from "@/components/ui/notification-panel";
import CreateNotificationForm from "@/components/ui/create-notification-form";

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalValue: 0,
    families: 0,
    wills: 0,
    donations: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const [assetsRes, familiesRes, willsRes, donationsRes, notificationsRes] =
        await Promise.all([
          fetch("/api/assets"),
          fetch("/api/families"),
          fetch("/api/wills"),
          fetch("/api/donations"),
          fetch("/api/notifications"),
        ]);

      const assets = await assetsRes.json();
      const families = await familiesRes.json();
      const wills = await willsRes.json();
      const donations = await donationsRes.json();
      const notifications = await notificationsRes.json();

      const totalValue = assets.reduce((sum: number, asset: any) => sum + (asset.value || 0), 0);

      setStats({
        totalAssets: assets.length,
        totalValue,
        families: families.length,
        wills: wills.length,
        donations: donations.length,
        notifications: notifications.filter((n: any) => !n.isRead).length,
      });
    } catch (error) {
      console.error("載入統計失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const quickActions = [
    {
      icon: <Users size={20} className="text-blue-600" />,
      label: "創建家族",
      href: "/family",
      color: "blue",
    },
    {
      icon: <DollarSign size={20} className="text-green-600" />,
      label: "添加資產",
      href: "/assets",
      color: "green",
    },
    {
      icon: <FileText size={20} className="text-purple-600" />,
      label: "創建遺囑",
      href: "/wills",
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900 flex items-center">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm mr-2">
                  OH
                </span>
                OnHeritage
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                儀表板
              </Link>
              <Link href="/family" className="text-gray-700 hover:text-blue-600 transition-colors">
                族谱
              </Link>
              <Link href="/assets" className="text-gray-700 hover:text-blue-600 transition-colors">
                資產
              </Link>
              <Link href="/wills" className="text-gray-700 hover:text-blue-600 transition-colors">
                遺囑
              </Link>
              <Link href="/donations" className="text-gray-700 hover:text-blue-600 transition-colors">
                捐贈
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationPanel />
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-red-600 transition-colors flex items-center space-x-1"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">登出</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 欢迎區域 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            歡迎回來，{session?.user?.name || "用戶"}！
          </h2>
          <p className="text-gray-600">
            管理您的遺產和資產
          </p>
        </div>

        {/* 統計卡片 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">總資產</h3>
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <DollarSign size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalAssets}
              </p>
              <p className="text-sm text-gray-600 mt-1">個資產</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">總價值</h3>
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <TrendingUp size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                HK${stats.totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">累計價值</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">家族</h3>
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <Users size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.families}
              </p>
              <p className="text-sm text-gray-600 mt-1">個家族</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">遺囑</h3>
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <FileText size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.wills}
              </p>
              <p className="text-sm text-gray-600 mt-1">個遺囑</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">捐贈</h3>
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                  <Bell size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.donations}
              </p>
              <p className="text-sm text-gray-600 mt-1">項捐贈</p>
            </div>
          </div>
        )}

        {/* 快速開始 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快速開始</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`p-4 rounded-lg border-2 hover:border-blue-500 hover:bg-${action.color}-50 transition-all group`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`p-3 bg-${action.color}-100 rounded-full group-hover:bg-${action.color}-200 transition-colors`}>
                    {action.icon}
                  </div>
                  <span className="font-medium text-gray-900">
                    {action.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 最近活動 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              最近活動
            </h3>
            <Link
              href="/notifications"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              查看全部通知 &rarr;
            </Link>
          </div>
          <div className="p-6">
            {stats.notifications > 0 ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        新通知提醒
                      </p>
                      <p className="text-xs text-gray-600">
                        {i === 1 ? "您有一條新資產分配規則" : "遺囑草稿已保存"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">
                  暫無最近活動
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                &copy; 2026 OnHeritage. 保留所有權利。
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/settings" className="text-sm text-gray-600 hover:text-blue-600">
                <Settings className="w-4 h-4 inline mr-1" />
                設置
              </Link>
              <Link href="/help" className="text-sm text-gray-600 hover:text-blue-600">
                幫助
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
