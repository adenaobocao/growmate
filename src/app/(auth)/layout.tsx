import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -left-[8vw] -top-[8vw] w-[55vw] h-[55vw] rounded-full blur-[90px] opacity-[0.12] bg-grow-primary/25" />
        <div className="absolute -right-[8vw] -bottom-[8vw] w-[55vw] h-[55vw] rounded-full blur-[90px] opacity-[0.12] bg-grow-secondary/15" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 shadow-lg shadow-grow-primary/20">
            <Image src="/bud.png" alt="GrowMate" width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <h1 className="font-display text-2xl font-black text-grow-primary lowercase tracking-tight">
            growmate
          </h1>
          <p className="text-[10px] text-grow-muted font-bold tracking-widest uppercase mt-1">
            assistente de cultivo ia
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
