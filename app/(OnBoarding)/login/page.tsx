import LoginPage from "@/app/(OnBoarding)/login/components/LoginForm";
import Image from "next/image";

export default function Page() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 min-h-screen">
      {/* Left Side (Hidden on mobile, 2/5 width on desktop) */}
      <div className="hidden lg:block lg:col-span-2 bg-slate-900 border-r border-slate-800 relative overflow-hidden">
        {/* Decorative elements for the dark side */}
        <div className="absolute inset-0 bg-linear-to-br from-[#505168] to-[#505168] opacity-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-2xl shadow-2xl flex items-center justify-center mb-8">
                <Image src="/parkinglogic_logo_new.png" alt="Logo" width={100} height={100} />
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Parking<span className="text-[#EAEFD3] font-medium">Logic</span></h1>
            <p className="text-slate-400 text-lg max-w-sm">Parking Management System.</p>
        </div>
      </div>

      {/* Right Side (Full width on mobile, 3/5 width on desktop) */}
      <div className="col-span-1 lg:col-span-3 bg-zinc-950 flex flex-col justify-center">
        <LoginPage />
      </div>
    </div>
  );
}