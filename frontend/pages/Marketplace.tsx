import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getMarketplaceItems } from "@/services/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import { buyAgent } from "@/entry-functions/marketplace";

interface MarketplaceItem {
  id: string;
  name: string;
  item_type: 'langchain' | 'crewAI';
  description: string;
  price: number;
  config: any;
  seller_id: string;
  status: string;
}

export default function Marketplace() {
  const { toast } = useToast();
  const { signAndSubmitTransaction } = useWallet();

  const { data: items, isLoading: isItemsLoading } = useQuery<MarketplaceItem[]>({
    queryKey: ["marketplaceItems"],
    queryFn: getMarketplaceItems,
  });

  const handlePurchase = async (itemId: string) => {
    try {
      const payload = buyAgent({ agentId: itemId });
      const response = await signAndSubmitTransaction(payload);
      const committedTransactionResponse = await aptosClient().waitForTransaction({
        transactionHash: response.hash,
      });

      if (committedTransactionResponse.success) {
        toast({ title: "Agent purchased successfully" });
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error purchasing agent:", error);
      toast({ 
        title: "Failed to purchase agent", 
        description: error.message || "An error occurred while purchasing the agent",
        variant: "destructive" 
      });
    }
  };

  if (isItemsLoading) return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
        </div>
      </div>
    </>
  )

  return (
    <>
     <Header />
     <div className="container mx-auto px-4 py-8">
        {/* <h1 className="text-3xl font-bold mb-6">Agent Marketplace</h1> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items?.map((item) => (
            <Card key={item.id} className="relative">
              <Badge className="absolute top-2 right-2" variant={item.item_type === 'langchain' ? 'default' : 'secondary'}>
                {item.item_type}
              </Badge>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <p className="mb-4">{item.description}</p>
                <p className="font-semibold">Configuration:</p>
                <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-x-auto">
                  {JSON.stringify(item.config, null, 2)}
                </pre> */}
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="font-bold">Price: {item.price} AgentToken</span>
                <Button onClick={() => handlePurchase(item.id)}>Purchase</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}