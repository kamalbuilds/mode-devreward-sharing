"use client";

import * as z from "zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { defineChain, getContract, prepareContractCall, resolveMethod } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { client, contract } from "@/config/contract";


const formSchema = z.object({
  fractionContract: z.string().min(1, "Fraction contract address is required"),
  recipients: z.array(z.string().min(1, "Recipient is required")),
  percentages: z.array(z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Percentage is required").max(100, "Percentage must be between 0 and 100")
  ))
}).refine((data) => {
  const totalPercentage = data.percentages.reduce((acc, val) => acc + val, 0);
  return totalPercentage === 100;
}, {
  message: "Total percentage must equal 100",
  path: ["percentages"]
});

export default function DistributeFraction() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fractionContract: "",
      recipients: [""],
      percentages: [0]
    }
  });

  const { fields: recipientFields, append: appendRecipient, remove: removeRecipient } = useFieldArray({
    control: form.control,
    // @ts-ignore
    name: "recipients"
  });

  const { fields: percentageFields, append: appendPercentage, remove: removePercentage } = useFieldArray({
    control: form.control,
    // @ts-ignore
    name: "percentages"
  });

  const { mutate: sendTransaction, isPending, isError } = useSendTransaction();

  const handleSubmit = async (values: { fractionContract: string; recipients: string[]; percentages: number[] }) => {

    // const erc20contract = getContract({ 
    //     client, 
    //     chain: defineChain(919), 
    //     address: values.fractionContract
    //   });

    //   console.log(erc20contract,"erc20")

    //   const approvetransaction = await prepareContractCall({ 
    //     erc20contract, 
    //     method: resolveMethod("approve"), 
    //     params: ["0xb785ea16111F69A874bb688C692c194CF993001F", 10**18] 
    //   });

    //   const { transactionHash : txn } = await sendTransaction(approvetransaction);
    //   console.log(txn);


    console.log(values.recipients);
    console.log(values.percentages);

    const transaction = await prepareContractCall({
      contract,
      method: resolveMethod("distributeFractions"),
      params: [values.fractionContract, values.recipients, values.percentages]
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
          {recipientFields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-center">
              <FormField
                control={form.control}
                name={`recipients.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Recipient ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" onClick={() => removeRecipient(index)}>-</Button>
            </div>
          ))}
          <Button type="button" onClick={() => appendRecipient("")}>Add Recipient</Button>
          
          {percentageFields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-center">
              <FormField
                control={form.control}
                name={`percentages.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentage {index + 1}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={`Percentage ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" onClick={() => removePercentage(index)}>-</Button>
            </div>
          ))}
          <Button type="button" onClick={() => appendPercentage(0)}>Add Percentage</Button>
          
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Processing..." : "Submit"}
          </Button>
          
          {isError && <p className="text-red-500">Transaction failed. Please try again.</p>}
        </form>
      </Form>
    </div>
  );
}
