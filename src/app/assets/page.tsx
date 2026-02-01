"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Bank, Shield, Home, TrendingUp, Coins, PieChart } from "lucide-react";
import AssetForm from "@/components/ui/asset-form";
import AllocationForm from "@/components/ui/allocation-form";
import EditAssetForm from "@/components/ui/edit-asset-form";

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAllocationForm, setShowAllocationForm] = useState<any>(null);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAssets = async () => {
    try {
      const response = await fetch("/api/assets");
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error("載入資產失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <Bank className="w-5 h-5" />;
      case "insurance":
        return <Shield className="w-5 h-5" />;
      case "real_estate":
        return <Home className="w-5 h-5" />;
      case "stock":
      case "fund":
        return <TrendingUp className="w-5 h-5" />;
      case "crypto":
        return <Coins className="w-5 h-5" />;
      default:
        return <Coins className="w-5 h-5" />;
    }
  };

  const getAssetTypeName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      bank: "銀行賬戶",
      insurance: "保險",
      stock: "證券/股票",
      fund: "基金",
      real_estate: "不動產",
      crypto: "虛擬貨幣",
      collection: "收藏品",
      ip: "知識產權",
      other: "其他",
    };
    return typeMap[type] || type;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除此資產嗎？")) {
      return;
    }

    try {
      const response = await fetch(`/api/assets/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadAssets();
      }
    } catch (error) {
      console.error("刪除資產失敗:", error);
    }
  };

  const handleEdit = (asset: any) => {
    setEditingAsset(asset);
    setShowEditForm(true);
  };

  const totalValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);

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
              <a href="/assets" className="text-blue-600 font-medium">
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
              資產管理
            </h1>
            <p className="text-gray-600">
              管理您的所有資產
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>添加資產</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">資產總數</p>
            <p className="text-3xl font-bold text-gray-900">
              {assets.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">總價值</p>
            <p className="text-3xl font-bold text-gray-900">
              HK${totalValue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">公開資產</p>
            <p className="text-3xl font-bold text-gray-900">
              {assets.filter((a) => a.isPublic).length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">載入中...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              尚未添加資產
            </h3>
            <p className="text-gray-600 mb-6">
              添加您的第一個資產，開始記錄財富
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              添加資產
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {getAssetIcon(asset.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {asset.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getAssetTypeName(asset.type)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(asset)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {asset.value && (
                  <div className="mb-3">
                    <p className="text-2xl font-bold text-gray-900">
                      {asset.currency}${asset.value.toLocaleString()}
                    </p>
                  </div>
                )}

                {asset.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {asset.description}
                  </p>
                )}

                <div className="border-t border-gray-200 pt-3 space-y-1 text-sm">
                  {asset.location && (
                    <p className="text-gray-600">
                      <span className="font-medium">位置：</span>
                      {asset.location}
                    </p>
                  )}
                  {asset.provider && (
                    <p className="text-gray-600">
                      <span className="font-medium">機構：</span>
                      {asset.provider}
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-medium">公開：</span>
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                        asset.isPublic
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {asset.isPublic ? "是" : "否"}
                    </span>
                  </p>
                </div>

                {/* 分配規則按鈕 */}
                <button
                  onClick={() => setShowAllocationForm(asset)}
                  className="w-full mt-4 flex items-center justify-center space-x-2 bg-purple-50 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <PieChart size={18} />
                  <span>管理分配規則</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <AssetForm
          onSuccess={() => {
            setShowForm(false);
            loadAssets();
          }}
          onClose={() => setShowForm(false)}
        />
      )}

      {showAllocationForm && (
        <AllocationForm
          assetId={showAllocationForm.id}
          assetName={showAllocationForm.name}
          onSuccess={() => {
            setShowAllocationForm(null);
            loadAssets();
          }}
          onClose={() => setShowAllocationForm(null)}
        />
      )}

      {showEditForm && editingAsset && (
        <EditAssetForm
          assetId={editingAsset.id}
          onSuccess={() => {
            setShowEditForm(false);
            setEditingAsset(null);
            loadAssets();
          }}
          onClose={() => {
            setShowEditForm(false);
            setEditingAsset(null);
          }}
        />
      )}
    </div>
  );
}
