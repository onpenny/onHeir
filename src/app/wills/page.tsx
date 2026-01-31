"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import WillForm from "@/components/ui/will-form";

export default function WillsPage() {
  const [wills, setWills] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWill, setEditingWill] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWills = async () => {
    try {
      const response = await fetch("/api/wills");
      const data = await response.json();
      setWills(data);
    } catch (error) {
      console.error("載入遺囑失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWills();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除此遺囑嗎？此操作無法恢復。")) {
      return;
    }

    try {
      const response = await fetch(`/api/wills/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadWills();
      }
    } catch (error) {
      console.error("刪除遺囑失敗:", error);
    }
  };

  const handleEdit = (will: any) => {
    setEditingWill(will);
    setShowForm(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            生效中
          </span>
        );
      case "executed":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            已執行
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            草稿
          </span>
        );
    }
  };

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
            <div className="flex items-center">
              <a href="/auth/signout" className="text-gray-700 hover:text-red-600">
                登出
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              遺囑管理
            </h1>
            <p className="text-gray-600">
              管理您的遺囑和資產分配計劃
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>創建遺囑</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">載入中...</p>
          </div>
        ) : wills.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">📜</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              尚未創建遺囑
            </h3>
            <p className="text-gray-600 mb-6">
              創建您的第一個遺囑，開始規劃資產分配
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              創建遺囑
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wills.map((will) => (
              <div
                key={will.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {will.title}
                      </h3>
                      <div className="mt-1">
                        {getStatusBadge(will.status)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(will)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(will.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-4 min-h-[80px]">
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

        {showForm && (
          <WillForm
            initialData={editingWill}
            onSuccess={() => {
              setShowForm(false);
              setEditingWill(null);
              loadWills();
            }}
            onClose={() => {
              setShowForm(false);
              setEditingWill(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
