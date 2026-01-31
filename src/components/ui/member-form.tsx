"use client";

import { useState } from "react";
import { X, UserPlus } from "lucide-react";

interface MemberFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  familyId: string;
}

export default function MemberForm({ onSuccess, onClose, familyId }: MemberFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    relationship: "spouse",
    priority: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/families/${familyId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "添加成員失敗");
      }

      onSuccess?.();
      setFormData({
        userId: "",
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
              <X size={24} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用戶 Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.userId}
              onChange={(e) =>
                setFormData({ ...formData, userId: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
            />
            <p className="text-sm text-gray-500 mt-1">
              請輸入要添加的用戶 Email
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
