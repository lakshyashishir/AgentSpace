import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAgents, executeAgent } from "@/services/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";

interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
}

function AgentCard({ agent, onExecute }: { agent: Agent; onExecute: (input: string) => void }) {
  const [input, setInput] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{agent.name}</CardTitle>
        <CardDescription>{agent.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{agent.description}</p>
        <Input
          className="mt-2"
          placeholder="Enter input for agent"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={() => onExecute(input)}>Execute Agent</Button>
      </CardFooter>
    </Card>
  );
}

function Agents() {
  const { toast } = useToast();

  const {
    data: agents,
    isLoading,
    error,
  } = useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: getAgents,
  });

  const handleExecuteAgent = async (agentId: string, input: string) => {
    try {
      const result = await executeAgent(agentId, input);
      toast({
        title: "Agent Executed",
        description: `Result: ${result.data}`,
      });
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "There was an error executing the agent.",
        variant: "destructive",
      });
    }
  };

  if (isLoading)
    return (
      <>
        <Header />
        <div className="space-x-6 space-y-6 px-6 py-4 md:px-12 md:py-8 max-w-screen-xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">Agents</h1>
            <div className="flex flex-col flex-1 items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-16 w-16 mt-12 border-t-2 border-b-2 border-black"></div>
            </div>
          </div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="space-x-6 space-y-6 px-6 py-4 md:px-12 md:py-8 max-w-screen-xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center">
              <p>Error loading agents</p>
            </div>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Header />
      <div className="space-x-6 space-y-6 px-6 py-4 md:px-12 md:py-8 max-w-screen-xl mx-auto">
        {/* <h1 className="text-3xl font-bold">AI Agents</h1> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents?.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onExecute={(input) => handleExecuteAgent(agent.id, input)} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Agents;
