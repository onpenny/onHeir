"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Users, UserPlus } from "lucide-react";
import FamilyForm from "@/components/ui/family-form";
import MemberForm from "@/components/ui/member-form";

export default function FamilyPage() {
  const [families, setFamilies] = useState<any[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<any | null>(null);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadFamilies = async () => {
    try {
      const response = await fetch("/api/families");
      const data = await response.json();
      setFamilies(data);
      if (data.length > 0 && !selectedFamily) {
        setSelectedFamily(data[0]);
      }
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
        if (selectedFamily?.id === id) {
          setSelectedFamily(null);
        }
      }
    } catch (error) {
      console.error("刪除家族失敗:", error);
    }
  };

  const getRelationshipName = (relationship: string) => {
    const map: { [key: string]: string } = {
      spouse: "配偶",
      parent: "父母",
      child: "子女",
      sibling: "兄弟姐妹",
      grandparent: "祖父母",
      grandchild: "孫子女",
      other: "其他",
      creator: "創建者",
    };
    return map[relationship] || relationship;
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
              <a href="/donations" className="text-gray-700 hover:text-blue-600">
                捐贈
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
            onClick={() => setShowFamilyForm(true)}
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
              onClick={() => setShowFamilyForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              創建家族
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                家族列表
              </h2>
              {families.map((family) => (
                <div
                  key={family.id}
                  onClick={() => setSelectedFamily(family)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedFamily?.id === family.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {family.name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(family.id);
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {family.description || "無描述"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {family.members?.length || 0} 位成員
                  </p>
                </div>
              ))}
            </div>

            {selectedFamily && (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedFamily.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {selectedFamily.description || "無描述"}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowMemberForm(true)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <UserPlus size={18} />
                      <span>添加成員</span>
                    </button>
                  </div>

                  <div className="p-6">
                    {selectedFamily.members && selectedFamily.members.length > 0 ? (
                      <div className="space-y-3">
                        {selectedFamily.members
                          .sort((a: any, b: any) => a.priority - b.priority)
                          .map((member: any) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                  {member.user.name?.[0] || member.user.email[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {member.user.name || member.user.email}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {getRelationshipName(member.relationship)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  優先級 {member.priority}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-4xl mb-4">👤</div>
                        <p className="text-gray-600">
                          尚未添加成員
                        </p>
                        <button
                          onClick={() => setShowMemberForm(true)}
                          className="mt-4 text-blue-600 hover:text-blue-700"
                        >
                          添加第一位成員 &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {showFamilyForm && (
          <FamilyForm
            onSuccess={() => {
              setShowFamilyForm(false);
              loadFamilies();
            }}
            onClose={() => setShowFamilyForm(false)}
          />
        )}

        {showMemberForm && selectedFamily && (
          <MemberForm
            familyId={selectedFamily.id}
            onSuccess={() => {
              setShowMemberForm(false);
              loadFamilies();
            }}
            onClose={() => setShowMemberForm(false)}
          />
        )}
      </main>
    </div>
  );
}
