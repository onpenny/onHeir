"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Heart } from "lucide-react";
import DonationForm from "@/components/ui/donation-form";

export default function DonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDonations = async () => {
    try {
      const response = await fetch("/api/donations");
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error("載入捐贈失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除此捐贈意願嗎？")) {
      return;
    }

    try {
      const response = await fetch(`/api/donations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadDonations();
      }
    } catch (error) {
      console.error("刪除捐贈失敗:", error);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            已批准
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
            待處理
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
              <a href="/wills" className="text-gray-700 hover:text-blue-600">
                遺囑
              </a>
              <a href="/donations" className="text-blue-600 font-medium">
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
              捐贈管理
            </h1>
            <p className="text-gray-600">
              管理您的捐贈意願和計劃
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus size={20} />
            <span>添加捐贈</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">載入中...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              尚未添加捐贈意願
            </h3>
            <p className="text-gray-600 mb-6">
              記錄您的捐贈意願，傳遞愛心
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              添加捐贈
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg text-red-600">
                      <Heart size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getDonationTypeName(donation.type)}
                      </h3>
                      <div className="mt-1">
                        {getStatusBadge(donation.status)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(donation.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {donation.amount && (
                  <div className="mb-3">
                    <p className="text-2xl font-bold text-gray-900">
                      HK${donation.amount.toLocaleString()}
                    </p>
                  </div>
                )}

                {donation.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {donation.description}
                  </p>
                )}

                <div className="border-t border-gray-200 pt-3 space-y-1 text-sm">
                  {donation.organization && (
                    <p className="text-gray-600">
                      <span className="font-medium">機構：</span>
                      {donation.organization}
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-medium">創建於：</span>
                    {new Date(donation.createdAt).toLocaleDateString("zh-TW")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <DonationForm
            onSuccess={() => {
              setShowForm(false);
              loadDonations();
            }}
            onClose={() => setShowForm(false)}
          />
        )}
      </main>
    </div>
  );
}
