import { defineChain, getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";

const id = process.env.NEXT_PUBLIC_APP_CLID || "";
export const client = createThirdwebClient({ 
    clientId: id
  });

export const contract = getContract({ 
    client, 
    chain: defineChain(919), 
    address: "0xb785ea16111F69A874bb688C692c194CF993001F"
  });