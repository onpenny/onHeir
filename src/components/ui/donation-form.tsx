"use client";

import { useState } from "react";
import { X, Heart } from "lucide-react";

interface DonationFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function DonationForm({ onSuccess, onClose }: DonationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    type: "property",
    amount: "",
    description: "",
    organization: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: formData.amount ? parseFloat(formData.amount) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "創建捐贈失敗");
      }

      onSuccess?.();
      setFormData({
        type: "property",
        amount: "",
        description: "",
        organization: "",
      });
    } catch (error: any) {
      setError(error.message || "創建捐贈失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const getDonationTypeName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      property: "財產捐贈",
      artifact: "文物捐贈",
      body: "遺體捐贈",
      organ: "器官捐贈",
    };
    return typeMap[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Heart className="w-6 h-6 mr-2 text-red-500" />
            添加捐贈意願
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
              捐贈類型 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="property">財產捐贈</option>
              <option value="artifact">文物捐贈</option>
              <option value="body">遺體捐贈</option>
              <option value="organ">器官捐贈</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              捐贈金額
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
            <p className="text-sm text-gray-500 mt-1">
              僅適用於財產捐贈，其他類型留空即可
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="關於此捐贈的詳細描述..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              接收機構
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) =>
                setFormData({ ...formData, organization: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如：紅十字會、醫院等"
            />
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
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "保存中..." : "保存捐贈意願"}
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
