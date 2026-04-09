import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
    return (
        <main className="min-h-screen bg-black overflow-hidden relative font-sans text-white">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(170, 255, 0, 0.08) 1px, transparent 1px),
              linear-gradient(45deg, rgba(170, 255, 0, 0.02) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(170, 255, 0, 0.02) 25%, transparent 25%)
            `,
                        backgroundSize: '50px 50px, 100px 100px, 100px 100px',
                        backgroundPosition: '0 0, 0 0, 10px 10px',
                        opacity: 1,
                    }}
                />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-4">
                <Spinner className="size-12 text-[#AAFF00]" />
                <p className="text-gray-400 text-lg">Cargando perfil...</p>
            </div>
        </main>
    )
}
