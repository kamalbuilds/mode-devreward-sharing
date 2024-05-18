export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Devfrens on Mode",
  description:
    "Our DApp empowers you to store your SFS NFTs and fractionalize them into tokens. These tokens can then be distributed among your team members, enabling each individual to claim their corresponding share of the NFT's revenue.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Deposit NFT",
      href: "/depositnft",
    },
    {
      title: "Fractionalize NFT",
      href: "/fractionalizenft",
    },
    {
      title: "Distribute",
      href: "/share",
    },
    {
      title: "Withdraw NFT",
      href: "/withdrawnft",
    },
    {
      title: "Claim Rewards",
      href: "/claimrewards",
    },
  ],
  links: {
    twitter: "https://twitter.com/0xkamal7",
    github: "https://github.com/kamalbuilds/mode-devreward-sharing",
  },
}
