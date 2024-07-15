export interface Agent {
    id: string;
    name: string;
    description: string;
    type: 'langchain' | 'crewAI';
    icon: string;
  }