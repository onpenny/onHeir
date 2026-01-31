"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Trash2, Edit2, User } from "lucide-react";

interface AllocationFormProps {
  assetId: string;
  assetName: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function AllocationForm({
  assetId,
  assetName,
  onSuccess,
  onClose,
}: AllocationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allocations, setAllocations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    familyId: "",
    memberId: "",
    percentage: "",
  });

  const loadAllocations = async () => {
    try {
      const response = await fetch(`/api/assets/${assetId}/allocations`);
      const data = await response.json();
      setAllocations(data);
    } catch (error) {
      console.error("載入分配規則失敗:", error);
    }
  };

  useEffect(() => {
    loadAllocations();
  }, [assetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/assets/${assetId}/allocations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          percentage: parseFloat(formData.percentage),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "創建分配規則失敗");
      }

      onSuccess?.();
      loadAllocations();
      setFormData({ familyId: "", memberId: "", percentage: "" });
    } catch (error: any) {
      setError(error.message || "創建分配規則失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除此分配規則嗎？")) {
      return;
    }

    try {
      const response = await fetch(`/api/allocations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadAllocations();
      }
    } catch (error) {
      console.error("刪除分配規則失敗:", error);
    }
  };

  const totalPercentage = allocations.reduce((sum, a) => sum + a.percentage, 0);
  const remainingPercentage = 100 - totalPercentage;

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              資產分配規則
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {assetName}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit2 size={24} />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* 分配統計 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                分配總覽
              </h3>
              {allocations.length === 0 ? (
                <p className="text-sm text-gray-600">尚未設置分配規則</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={allocations.map((a, index) => ({
                        ...a,
                        name: a.member?.user?.name || a.family?.name || "未知",
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {allocations.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">已分配</span>
                  <span className="font-semibold text-gray-900">
                    {totalPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${totalPercentage}%` }}
                  />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">可分配</span>
                  <span className="font-semibold text-gray-900">
                    {remainingPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${remainingPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 分配列表 */}
          {allocations.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                分配列表
              </h3>
              <div className="space-y-2">
                {allocations.map((allocation) => (
                  <div
                    key={allocation.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {allocation.member?.user?.name ||
                           allocation.family?.name ||
                           "未知"}
                        </p>
                        <p className="text-xs text-gray-600">
                          優先級 {allocation.member?.priority || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">
                        {allocation.percentage}%
                      </span>
                      <button
                        onClick={() => handleDelete(allocation.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 添加分配規則表單 */}
          {remainingPercentage > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                添加分配規則
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分配對象
                  </label>
                  <select
                    value={formData.memberId || formData.familyId}
                    onChange={(e) =>
                      setFormData({ ...formData, memberId: e.target.value, familyId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選擇成員或家族</option>
                    <option value="member-1">成員 1</option>
                    <option value="member-2">成員 2</option>
                    <option value="family-1">家族 1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分配比例 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max={remainingPercentage}
                    value={formData.percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, percentage: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`最大可分配 ${remainingPercentage}%`}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    可分配餘額：{remainingPercentage}%
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "添加中..." : "添加規則"}
                  </button>
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                      關閉
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {remainingPercentage <= 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ 此資產已 100% 分配，無法添加新的分配規則。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
