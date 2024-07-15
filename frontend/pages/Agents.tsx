import { useQuery } from "@tanstack/react-query";
import { getAgents } from "@/services/api";
import { AgentCard } from "@/components/AgentCard";
import { Header } from "@/components/Header";
import { Agent } from "@/types/agent";

function Agents() {
  const {
    data: agents,
    isLoading,
    error,
  } = useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: getAgents,
  });

  if (isLoading)
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="text-center mt-8">
          <p>Error loading agents</p>
        </div>
      </>
    );

  return (
    <>
      <Header />
      <div className="container mx-auto px-8 py-8">
        {/* <h1 className="text-3xl font-bold mb-6">AI Agents</h1> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents?.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Agents;