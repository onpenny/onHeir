"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Users, UserPlus, Edit, Search } from "lucide-react";
import FamilyForm from "@/components/ui/family-form";
import AddMemberForm from "@/components/ui/add-member-form";

export default function FamilyPage() {
  const [families, setFamilies] = useState<any[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<any | null>(null);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingFamily, setEditingFamily] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadFamilies = async () => {
    try {
      const response = await fetch("/api/families");
      const data = await response.json();
      setFamilies(data);
      if (data.length > 0 && !selectedFamily) {
        setSelectedFamily(data[0]);
      }
    } catch (error) {
      console.error("载入家族失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilies();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除此家族吗？此操作无法恢复。")) {
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
      console.error("删除家族失败:", error);
    }
  };

  const handleEdit = (family: any) => {
    setEditingFamily(family);
    setShowFamilyForm(true);
  };

  const getRelationshipName = (relationship: string) => {
    const map: { [key: string]: string } = {
      spouse: "配偶",
      parent: "父母",
      child: "子女",
      sibling: "兄弟姐妹",
      grandparent: "祖父母",
      grandchild: "孙子女",
      other: "其他",
      creator: "创建者",
    };
    return map[relationship] || relationship;
  };

  const filteredMembers = selectedFamily?.members?.filter((member: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      member.user?.name?.toLowerCase().includes(query) ||
      member.user?.email?.toLowerCase().includes(query) ||
      getRelationshipName(member.relationship).toLowerCase().includes(query)
    );
  }) || [];

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
                仪表板
              </a>
              <a href="/family" className="text-blue-600 font-medium">
                族谱
              </a>
              <a href="/assets" className="text-gray-700 hover:text-blue-600">
                资产
              </a>
              <a href="/wills" className="text-gray-700 hover:text-blue-600">
                遗嘱
              </a>
              <a href="/donations" className="text-gray-700 hover:text-blue-600">
                捐赠
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
              管理您的家族成员和关系
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索成员..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button
              onClick={() => setShowFamilyForm(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>创建家族</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">载入中...</p>
          </div>
        ) : families.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              尚未创建家族
            </h3>
            <p className="text-gray-600 mb-6">
              创建您的第一个家族，开始记录家族成员
            </p>
            <button
              onClick={() => setShowFamilyForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              创建家族
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：家族列表 */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                家族列表
              </h2>
              <div className="space-y-3">
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
                          handleEdit(family);
                        }}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {family.description || "无描述"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {family.members?.length || 0} 位成员
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧：选中家族的详情 */}
            {selectedFamily && (
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedFamily.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {selectedFamily.description || "无描述"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingFamily(selectedFamily);
                          setShowFamilyForm(true);
                        }}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(selectedFamily.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* 成员列表 */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Users size={20} className="mr-2" />
                        家族成员 ({filteredMembers.length})
                      </h3>
                      <button
                        onClick={() => setShowAddMemberForm(true)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <UserPlus size={16} />
                        <span>添加成员</span>
                      </button>
                    </div>

                    {filteredMembers.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-4xl mb-4">👤</div>
                        <p className="text-gray-600">
                          {searchQuery ? "未找到匹配的成员" : "尚未添加成员"}
                        </p>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="mt-4 text-blue-600 hover:text-blue-700"
                          >
                            清除搜索
                          </button>
                        )}
                        {!searchQuery && (
                          <button
                            onClick={() => setShowAddMemberForm(true)}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            添加第一位成员
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredMembers
                          .sort((a: any, b: any) => a.priority - b.priority)
                          .map((member: any) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                  {member.user.name?.[0] || member.user.email[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {member.user.name || member.user.email}
                                  </p>
                                  <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-600">
                                      {getRelationshipName(member.relationship)}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                      优先级 {member.priority}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {/* TODO: 编辑成员功能 */}}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => {/* TODO: 删除成员功能 */}}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 家族表单 */}
        {showFamilyForm && (
          <FamilyForm
            initialData={editingFamily}
            onSuccess={() => {
              setShowFamilyForm(false);
              setEditingFamily(null);
              loadFamilies();
            }}
            onClose={() => {
              setShowFamilyForm(false);
              setEditingFamily(null);
            }}
          />
        )}

        {/* 添加成员表单 */}
        {showAddMemberForm && selectedFamily && (
          <AddMemberForm
            familyId={selectedFamily.id}
            onSuccess={() => {
              setShowAddMemberForm(false);
              loadFamilies();
            }}
            onClose={() => setShowAddMemberForm(false)}
          />
        )}
      </main>
    </div>
  );
}
