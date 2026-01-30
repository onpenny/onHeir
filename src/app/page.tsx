import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              OnHeritage
            </h1>
            <div className="space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                登入
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                註冊
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            全生命週期的遺產管理平台
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            保護您的資產，傳承您的遺產。讓您的遺願得到尊重，
            您的親屬得到保障。
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              免費開始使用
            </Link>
            <Link
              href="#features"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              了解更多
            </Link>
          </div>
        </div>

        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🏠</div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">族譜管理</h2>
            <p className="text-gray-600 leading-relaxed">
              可視化族譜搭建，支援血緣、收養、婚姻等多元關係
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💰</div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">資產管理</h2>
            <p className="text-gray-600 leading-relaxed">
              全品類資產錄入，支援銀行、保險、虛擬資產等
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📜</div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">遺囑管理</h2>
            <p className="text-gray-600 leading-relaxed">
              合規模板，可視化分配規則，區塊鏈存證
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔔</div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">繼承通知</h2>
            <p className="text-gray-600 leading-relaxed">
              自動觸發機制，及時通知繼承人
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">❤️</div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">捐贈管理</h2>
            <p className="text-gray-600 leading-relaxed">
              財產、文物捐贈意願登記與執行追蹤
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">隱私安全</h2>
            <p className="text-gray-600 leading-relaxed">
              端到端加密，多重身份驗證，安全可靠
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="mb-2">
            &copy; 2026 OnHeritage. 保留所有權利。
          </p>
          <p className="text-sm text-gray-500">
            保護您的遺產，傳承您的愛
          </p>
        </div>
      </footer>
    </main>
  );
}
