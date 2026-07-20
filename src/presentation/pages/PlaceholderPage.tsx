// src/presentation/pages/PlaceholderPage.tsx
import { PackageOpen } from 'lucide-react'

interface Props {
  title: string
}

export default function PlaceholderPage({ title }: Props) {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-muted p-6">
        <PackageOpen className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground max-w-[500px]">
          Este módulo está en construcción. Pronto podrás gestionar esta sección del sistema.
        </p>
      </div>
    </div>
  )
}
