import { createElement } from 'react'
import { Mail, Landmark, FileText, Users, Shield, type LucideIcon, type LucideProps } from 'lucide-react'

const iconos: Record<string, LucideIcon> = {
  mail: Mail, landmark: Landmark, 'file-text': FileText, users: Users, shield: Shield,
}

export function Icono({ nombre, ...props }: { nombre: string } & LucideProps) {
  return createElement(iconos[nombre] ?? FileText, props)
}