import { Activity } from "lucide-react";

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left pane: Branding / Illustration (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 border-r border-slate-800 flex-col justify-center items-center relative overflow-hidden">
        {/* Abstract background blobs for premium fintech feel */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-slate-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 p-12 text-center max-w-xl">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20">
              <Activity className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            AI-Driven Financial Intelligence
          </h1>
          <p className="text-lg text-slate-400">
            Secure, reliable, and instantaneous scoring metrics tailored for modern SMEs and investors.
          </p>
        </div>
      </div>

      {/* Right pane: Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-8 sm:p-12 md:p-24">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
