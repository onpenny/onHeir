"use client";

import { useState, useEffect } from "react";
import { UserPlus, Search } from "lucide-react";

interface AddMemberFormProps {
  familyId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function AddMemberForm({ familyId, onSuccess, onClose }: AddMemberFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    relationship: "spouse",
    priority: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 首先創建用戶
      if (!formData.email) {
        throw new Error("請輸入電子郵件");
      }

      // 創建用戶（如果不存在）
      const userResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: "defaultPassword123", // 實際應該讓用戶設置密碼
          name: formData.name,
        }),
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(userData.error || "創建用戶失敗");
      }

      // 添加成員到家族
      const memberResponse = await fetch(`/api/families/${familyId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.id || formData.email, // 如果用戶已存在，嘗試用 email
          relationship: formData.relationship,
          priority: formData.priority,
        }),
      });

      const memberData = await memberResponse.json();

      if (!memberResponse.ok) {
        throw new Error(memberData.error || "添加成員失敗");
      }

      onSuccess?.();
      setFormData({
        name: "",
        email: "",
        relationship: "spouse",
        priority: 0,
      });
    } catch (error: any) {
      setError(error.message || "添加成員失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const relationshipOptions = [
    { value: "spouse", label: "配偶" },
    { value: "parent", label: "父母" },
    { value: "child", label: "子女" },
    { value: "sibling", label: "兄弟姐妹" },
    { value: "grandparent", label: "祖父母" },
    { value: "grandchild", label: "孫子女" },
    { value: "other", label: "其他" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <UserPlus className="w-6 h-6 mr-2 text-blue-600" />
            添加家族成員
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              姓名（可選）
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="成員的姓名"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              電子郵件 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
            />
            <p className="text-sm text-gray-500 mt-1">
              如果用戶不存在，將自動創建賬戶
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              關係 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.relationship}
              onChange={(e) =>
                setFormData({ ...formData, relationship: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {relationshipOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              繼承優先級
            </label>
            <input
              type="number"
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: parseInt(e.target.value) || 0,
                })
              }
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
            <p className="text-sm text-gray-500 mt-1">
              數值越小，優先級越高（0 為最高）
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
              {loading ? "添加中..." : "添加成員"}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                取消
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
