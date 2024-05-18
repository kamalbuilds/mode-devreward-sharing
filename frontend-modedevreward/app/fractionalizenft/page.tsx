"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { prepareContractCall, resolveMethod } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { contract } from "@/config/contract";

const formSchema = z.object({
  nftId: z.string().min(1, "NFT ID is required"),
  royaltyPercentage: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Royalty percentage is required").max(100, "Royalty percentage must be between 0 and 100")
  ),
  supply: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Supply is required")
  ),
  tokenName: z.string().min(1, "Token name is required"),
  tokenTicker: z.string().min(1, "Token ticker is required")
});

export default function CreateFraction() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nftId: "",
      royaltyPercentage: 0,
      supply: 0,
      tokenName: "",
      tokenTicker: ""
    }
  });

  const { mutate: sendTransaction, isError , isSuccess , isPending} = useSendTransaction();

  const handleSubmit = async (values: {
    nftId: string;
    royaltyPercentage: number;
    supply: number;
    tokenName: string;
    tokenTicker: string;
  }) => {

    const updatedsupply = values.supply * 10**18;

    const transaction = await prepareContractCall({
      contract,
      method: resolveMethod("createFraction"),
      params: [
        values.nftId,
        values.royaltyPercentage,
        updatedsupply,
        values.tokenName,
        values.tokenTicker
      ]
    });

    await sendTransaction(transaction);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-md w-full flex flex-col gap-4">
        <h2>Step2: Fractionalise your SNFT</h2>
          <FormField
            control={form.control}
            name="nftId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NFT ID</FormLabel>
                <FormControl>
                  <Input placeholder="NFT ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="royaltyPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Royalty Percentage</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Royalty Percentage" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supply"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supply</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Supply" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tokenName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Name</FormLabel>
                <FormControl>
                  <Input placeholder="Token Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tokenTicker"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Ticker</FormLabel>
                <FormControl>
                  <Input placeholder="Token Ticker" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Processing..." : "Submit"}
          </Button>
          {isSuccess && <p className="text-green-500">SNFT Fractionionalised sucessfully. ⚡</p>}
          {isError && <p className="text-red-500">Transaction failed. Please try again.</p>}
        </form>
      </Form>
    </div>
  );
}
