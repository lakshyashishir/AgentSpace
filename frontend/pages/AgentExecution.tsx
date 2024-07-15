import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAgent, executeAgent } from "@/services/api";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Agent } from "@/types/agent";

function AgentExecution() {
  const { agentId } = useParams<{ agentId: string }>();
  const { toast } = useToast();
  const [input, setInput] = useState("");

    console.log("id",agentId);

  const { data: agent, isLoading: agentLoading } = useQuery<Agent>({
    queryKey: ["agent", agentId],
    queryFn: () => getAgent(agentId!),
  });

  const executeMutation = useMutation({
    mutationFn: (input: string) => executeAgent(agentId!, input),
    onSuccess: (data) => {
      toast({
        title: "Agent Executed",
        description: `Result: ${data.result}`,
      });
    },
    onError: () => {
      toast({
        title: "Execution Failed",
        description: "There was an error executing the agent.",
        variant: "destructive",
      });
    },
  });

  if (agentLoading) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
        </div>
      </>
    );
  }

  if (!agent) {
    return (
      <>
        <Header />
        <div className="text-center mt-8">
          <p>Agent not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{agent.name}</h1>
        <p className="mb-4">{agent.description}</p>
        <div className="flex gap-4 mb-8">
          <Input
            placeholder="Enter input for agent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={() => executeMutation.mutate(input)}
            // disabled={executeMutation.isLoading}
          >
            {executeMutation.isLoading ? "Executing..." : "Execute"}
          </Button>
        </div>
        {executeMutation.isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        )}
        {executeMutation.isSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="font-bold">Result:</p>
            <p>{executeMutation.data.result}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default AgentExecution;