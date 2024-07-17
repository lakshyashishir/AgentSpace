import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { aptosClient } from "@/utils/aptosClient";
import { buyAgcn } from "@/entry-functions/agent-coin";

export default function BuyAGCN() {
  const { user, isAuthenticated, balance } = useAuth();
  const { signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();
  const [aptAmount, setAptAmount] = useState("");
  const [agcnAmount, setAgcnAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (balance) {
      const aptBalance = parseInt(balance) / 100000000;
      setAptAmount(aptBalance.toString());
      setAgcnAmount((aptBalance * 100).toFixed(2));
    }
  }, [balance]);

  const handleAptChange = (e) => {
    const apt = parseFloat(e.target.value);
    setAptAmount(e.target.value);
    setAgcnAmount(isNaN(apt) ? "" : (apt * 100).toFixed(2));
  };

  const handleBuyAGCN = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Not authenticated",
        description: "Please connect your wallet to buy AGCN",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = buyAgcn({ aptAmount: parseFloat(aptAmount) });

      console.log('Transaction payload:', payload);

      const response = await signAndSubmitTransaction(payload);

      const committedTransactionResponse = await aptosClient().waitForTransaction({
        transactionHash: response.hash,
      });

      if (committedTransactionResponse.success) {
        toast({
          title: "Purchase Successful",
          description: `You have successfully bought ${agcnAmount} AGCN!`,
        });
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error buying AGCN:", error);
      console.log("Error details:", JSON.stringify(error, null, 2));
      toast({
        title: "Purchase Failed",
        description: error.message || "An error occurred while buying AGCN",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Buy AGCN Coins</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What is AGCN?</CardTitle>
            <CardDescription>The native token of AgentSpace</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              AGCN (AgentCoin) is the utility token powering the AgentSpace platform. It's designed to facilitate
              transactions, reward users, and govern the ecosystem.
            </p>
            <Alert>
              <AlertTitle>Key Features</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside">
                  <li>1 APT = 100 AGCN</li>
                  <li>Used for paying AI agent fees</li>
                  <li>Stake to earn platform rewards</li>
                  <li>Participate in governance decisions</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buy AGCN</CardTitle>
            <CardDescription>Exchange your APT for AGCN</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Input
                type="number"
                placeholder="APT Amount"
                value={aptAmount}
                onChange={handleAptChange}
                disabled={!isAuthenticated}
              />
              <span className="text-2xl">=</span>
              <Input type="number" placeholder="AGCN Amount" value={agcnAmount} readOnly />
            </div>
            {isAuthenticated && (
              <p className="text-sm text-gray-500">Available balance: {parseFloat(balance) / 100000000} APT</p>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleBuyAGCN} disabled={!isAuthenticated || isLoading}>
              {isLoading ? "Processing..." : "Buy AGCN"}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>AGCN is built on the Aptos blockchain using the Move language.</p>
            <p>Contract address: 0xccaece84eff0a373aeb954902e73a015dbca50abdfab0f909a06e3d71ca8e2e::AgentCoin</p>
          </div>
        </div>
      </div>
    </>
  );
}
