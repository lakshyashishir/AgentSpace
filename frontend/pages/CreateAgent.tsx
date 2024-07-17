import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import { createAgent, initializeAgentRegistry, isAgentRegistryInitialized } from "@/entry-functions/create-agent";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const predefinedAgents = [
  {
    id: "4d39358c-4812-43c0-94f0-51551564ae0e",
    name: "Sentiment Analyzer",
    description: "Analyze the sentiment of given text, determining if it's positive, negative, or neutral using LangChain.",
    agentType: "langchain",
    price: 150000000,
    executionCost: 10000000,
  },
  {
    id: "af13bc2d-8aa1-4cd3-822d-b683968206d5",
    name: "Article Summarizer",
    description: "This agent uses LangChain to summarize articles into concise, easy-to-read summaries.",
    agentType: "langchain",
    price: 100000000,
    executionCost: 10000000,
  },
  {
    id: "ccfa4119-0766-4879-a34b-685c59622ec5",
    name: "YouTube to Blog Converter",
    description: "Convert YouTube video content into well-structured blog posts using LangChain.",
    agentType: "crew",
    price: 250000000,
    executionCost: 20000000,
  },
  {
    id: "f66de9bd-751c-4e6a-b7c9-635f7c76c610",
    name: "Twitter Thread Generator",
    description: "Generate engaging Twitter threads on various topics using LangChain.",
    agentType: "crew",
    price: 200000000,
    executionCost: 15000000,
  },
];

export default function CreateAgentPage() {
const { signAndSubmitTransaction, account } = useWallet();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [agentData, setAgentData] = useState({
    id: "",
    name: "",
    description: "",
    agentType: "",
    price: 0,
    executionCost: 0,
  });

  useEffect(() => {
    const checkInitialization = async () => {
      if (account?.address) {
        try {
          const response = await aptosClient().view({
            function: "0xccaece84eff0a373aeb954902e73a015dbca50abdfab0f909a06e3d71ca8e2e::AgentRegistry::is_initialized",
            type_arguments: [],
            arguments: [account.address]
          });
          setIsInitialized(response[0]);
        } catch (error) {
          console.error("Error checking initialization:", error);
          setIsInitialized(false);
        }
      }
    };

    checkInitialization();
  }, [account]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAgentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setAgentData(predefinedAgents.find(agent => agent.id === value) || {
      id: "",
      name: "",
      description: "",
      agentType: "",
      price: 0,
      executionCost: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isInitialized) {
        // Initialize the AgentRegistry if not initialized
        const initPayload = initializeAgentRegistry();
        await signAndSubmitTransaction(initPayload);
        console.log("AgentRegistry initialized successfully");
        setIsInitialized(true);
      }

      // Now create the agent
      const createPayload = createAgent(agentData);
      console.log("Create Agent Payload:", createPayload);

      const response = await signAndSubmitTransaction(createPayload);

      const committedTransactionResponse = await aptosClient().waitForTransaction({
        transactionHash: response.hash,
      });

      if (committedTransactionResponse.success) {
        toast({ title: "Agent created successfully" });
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error creating agent:", error);
      toast({
        title: "Failed to create agent",
        description: error.message || "An error occurred while creating the agent",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New Agent</CardTitle>
            <CardDescription>Fill in the details to create a new agent</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="predefined">Predefined Agents</Label>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger id="predefined">
                      <SelectValue placeholder="Select a predefined agent" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {predefinedAgents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="id">Agent ID</Label>
                  <Input id="id" name="id" value={agentData.id} onChange={handleInputChange} required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={agentData.name} onChange={handleInputChange} required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" value={agentData.description} onChange={handleInputChange} required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="agentType">Agent Type</Label>
                  <Input id="agentType" name="agentType" value={agentData.agentType} onChange={handleInputChange} required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="price">Price</Label>
                  <Input type="number" id="price" name="price" value={agentData.price} onChange={handleInputChange} required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="executionCost">Execution Cost</Label>
                  <Input type="number" id="executionCost" name="executionCost" value={agentData.executionCost} onChange={handleInputChange} required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" onClick={handleSubmit}>Create Agent</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}