import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import LazyYoutube from "@/components/Lazyyoutube"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Welcome to the Devfrens on Mode 🚀 <br className="hidden sm:inline" />
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
         This dapp is built on Mode for fractionalised reward sharing from the SFS NFT and is 
         designed to transform how you manage your Sequencer Fee Sharing (SFS) NFTs, allowing you to store, 
         fractionalize, and distribute ownership among your teammates seamlessly.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/demo"
          // target="_blank"
          // rel="noreferrer"
          className={buttonVariants()}
        >
          Demo
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </Link>
      </div>
      <div>
        {/* <LazyYoutube videoId={""} /> */}
      </div>
    </section>
  )
}
