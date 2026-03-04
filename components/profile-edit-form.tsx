'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Edit2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { saveProfile } from "@/app/onboarding/actions" // Reuse the server action

export default function EditProfileForm({ profile }: { profile: any }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        // We reuse the saveProfile action which handles upsert/update
        await saveProfile(formData)

        setOpen(false)
        setLoading(false)
        router.refresh()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-white/20 text-gray-300 hover:text-white bg-transparent">
                    <Edit2 className="w-4 h-4 mr-2" /> Editar Perfil
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-black/95 border-[#AAFF00]/20 text-white backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl text-[#AAFF00]">Editar Perfil</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-gray-300">Nombre Completo <span className="text-[#AAFF00]">*</span></Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            required
                            defaultValue={profile?.full_name}
                            className="bg-white/5 border-white/10 text-white focus-visible:ring-[#AAFF00]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio" className="text-gray-300">Bio / Habilidades</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            defaultValue={profile?.bio}
                            className="bg-white/5 border-white/10 text-white focus-visible:ring-[#AAFF00] min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="linkedin_url" className="text-gray-300">LinkedIn URL</Label>
                            <Input
                                id="linkedin_url"
                                name="linkedin_url"
                                type="url"
                                defaultValue={profile?.linkedin_url}
                                className="bg-white/5 border-white/10 text-white focus-visible:ring-[#AAFF00]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="github_url" className="text-gray-300">GitHub URL</Label>
                            <Input
                                id="github_url"
                                name="github_url"
                                type="url"
                                defaultValue={profile?.github_url}
                                className="bg-white/5 border-white/10 text-white focus-visible:ring-[#AAFF00]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="needs_credits"
                            name="needs_credits"
                            defaultChecked={profile?.needs_credits}
                            className="border-white/20 data-[state=checked]:bg-[#AAFF00] data-[state=checked]:text-black"
                        />
                        <Label htmlFor="needs_credits" className="text-gray-300 font-normal cursor-pointer">
                            Necesito créditos universitarios ECTS por participar en el hackathon
                        </Label>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-bold h-12"
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
