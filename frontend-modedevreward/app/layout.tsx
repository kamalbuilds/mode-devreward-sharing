"use client";
import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ModeTestnet } from "@thirdweb-dev/chains";


interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const id = process.env.NEXT_PUBLIC_APP_CLID || "";


  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
           <ThirdwebProvider
            activeChain={ModeTestnet}
            clientId= {process.env.NEXT_PUBLIC_APP_CLID}
          >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
          </ThirdwebProvider>
        </body>
      </html>
    </>
  )
}
