import { Mail, Landmark, FileText, Users, Shield, type LucideIcon } from 'lucide-react'

const iconos: Record<string, LucideIcon> = {
  mail: Mail, landmark: Landmark, 'file-text': FileText, users: Users, shield: Shield,
}

export const iconoDe = (nombre: string): LucideIcon => iconos[nombre] ?? FileText