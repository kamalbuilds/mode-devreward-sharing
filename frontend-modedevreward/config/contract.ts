import { defineChain, getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";

const id = process.env.NEXT_PUBLIC_APP_CLID || "";
export const client = createThirdwebClient({ 
    clientId: id
  });

export const contract = getContract({ 
    client, 
    chain: defineChain(919), 
    address: "0x32c0079794fd5a58AA25a90959bD3FCBd0bB5606"
  });

