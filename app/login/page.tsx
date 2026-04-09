import Navbar from "@/components/navbar"
import LoginForm from "@/components/login-form"

export default async function LoginPage(
    props: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }
) {
    const searchParams = await props.searchParams
    const error = searchParams?.error === 'true'
    const message = typeof searchParams?.message === 'string' ? searchParams.message : undefined

    return (
        <main className="min-h-screen bg-black overflow-hidden relative font-sans text-white">
            <div className="fixed inset-0 pointer-events-none">
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

            <div className="relative z-10">
                <Navbar />

                <div className="flex min-h-[calc(100vh-80px)] mt-20 items-center justify-center p-4">
                    <div className="w-full max-w-md space-y-6 bg-white/5 p-8 rounded-2xl backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(170,255,0,0.1)] relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#AAFF00]/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#AAFF00]/10 rounded-full blur-3xl -z-10" />

                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold mb-2">Portal Hackathon</h2>
                            <p className="text-gray-400 text-sm">Organiza tu equipo y participa.</p>
                        </div>

                        <LoginForm error={error} message={message} />

                    </div>
                </div>
            </div>
        </main>
    )
}
