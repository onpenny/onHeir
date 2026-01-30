export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">OnHeritage</h1>
        <p className="text-lg text-gray-600 mb-8">
          全生命週期的遺產管理和安排平台
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">🏠 族譜管理</h2>
            <p className="text-gray-600">
              可視化族譜搭建，支援血緣、收養、婚姻等多元關係
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">💰 資產管理</h2>
            <p className="text-gray-600">
              全品類資產錄入，支援銀行、保險、虛擬資產等
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">📜 遺囑管理</h2>
            <p className="text-gray-600">
              合規模板，可視化分配規則，區塊鏈存證
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">🔔 繼承通知</h2>
            <p className="text-gray-600">
              自動觸發機制，及時通知繼承人
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">❤️ 捐贈管理</h2>
            <p className="text-gray-600">
              財產、文物捐贈意願登記與執行追蹤
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">🔒 隱私安全</h2>
            <p className="text-gray-600">
              端到端加密，多重身份驗證，安全可靠
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
