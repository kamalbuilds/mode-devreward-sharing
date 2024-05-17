"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { prepareContractCall, resolveMethod } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { contract} from "@/config/contract";

const formSchema = z.object({
  fractionContract: z.string().min(1, "Fraction contract address is required")
});

export default function WithdrawNFT() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { fractionContract: "" }
  });

  const { mutate: sendTransaction, isPending, isError } = useSendTransaction();

  const handleSubmit = async (values: { fractionContract: string }) => {
    const transaction = await prepareContractCall({
      contract,
      method: resolveMethod("withdrawNftWithSupply"),
      params: [values.fractionContract]
    });
    await sendTransaction(transaction);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-md w-full flex flex-col gap-4">
          <FormField
            control={form.control}
            name="fractionContract"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fraction Contract Address</FormLabel>
                <FormControl>
                  <Input placeholder="Fraction Contract Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Processing..." : "Submit"}
          </Button>
          {isError && <p className="text-red-500">Transaction failed. Please try again.</p>}
        </form>
      </Form>
    </div>
  );
}
