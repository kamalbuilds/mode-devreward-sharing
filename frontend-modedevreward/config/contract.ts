import { defineChain, getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";

const id = process.env.NEXT_PUBLIC_APP_CLID || "";
export const client = createThirdwebClient({ 
    clientId: id
  });

export const contract = getContract({ 
    client, 
    chain: defineChain(919), 
    address: "0xE5445585E1fCC019FF72c7E7f6A7588489a8aB49"
  });

