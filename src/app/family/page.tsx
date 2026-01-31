"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import FamilyForm from "@/components/ui/family-form";

export default function FamilyPage() {
  const [families, setFamilies] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadFamilies = async () => {
    try {
      const response = await fetch("/api/families");
      const data = await response.json();
      setFamilies(data);
    } catch (error) {
      console.error("載入家族失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilies();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除此家族嗎？此操作無法恢復。")) {
      return;
    }

    try {
      const response = await fetch(`/api/families/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadFamilies();
      }
    } catch (error) {
      console.error("刪除家族失敗:", error);
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
              家族管理
            </h1>
            <p className="text-gray-600">
              管理您的家族成員和關係
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>創建家族</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">載入中...</p>
          </div>
        ) : families.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              尚未創建家族
            </h3>
            <p className="text-gray-600 mb-6">
              創建您的第一個家族，開始記錄家族成員
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              創建家族
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {families.map((family) => (
              <div
                key={family.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {family.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {family.members?.length || 0} 位成員
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(family.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {family.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {family.description}
                  </p>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => {/* TODO: 打开家族详情 */}}
                    className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    管理成員 &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <FamilyForm
            onSuccess={() => {
              setShowForm(false);
              loadFamilies();
            }}
            onClose={() => setShowForm(false)}
          />
        )}
      </main>
    </div>
  );
}
