import type React from "react"
import { ThemeProvider } from "next-themes"
import "../globals.css"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen w-full bg-background text-foreground">{children}</div>
    </ThemeProvider>
  )
}
