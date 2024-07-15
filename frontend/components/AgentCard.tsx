import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Agent } from '@/types/agent';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="relative">
      <Badge className="absolute top-2 right-2" variant={agent.type === 'langchain' ? 'default' : 'secondary'}>
        {agent.type}
      </Badge>
      <CardHeader>
        <CardTitle className="flex items-center">
          <img src={agent.icon || 'aptos.png'} alt={agent.name} className="w-6 h-6 mr-2" />
          {agent.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{agent.description}</p>
      </CardContent>
      <CardFooter>
        <Link to={`/agent/${agent.id}`}>
          <Button>Use Agent</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}