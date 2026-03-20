import { Construction } from "lucide-react"

export default function MaintenancePage() {
    return (
        <>
        <main className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="w-full max-w-sm px-6">
        <div className="border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
              <Construction/>
            </div>
          </div>

          <h1 className="text-xl font-semibold text-center mb-2">
            Maintenance
          </h1>

          <p className="text-sm text-gray-500 text-center">
            Kami sedang melakukan pembaruan sistem.
            Silakan kembali dalam beberapa saat.
          </p>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          © ParkingLogic {new Date().getFullYear()}
        </p>
      </div>
    </main>
        </>
    )
}