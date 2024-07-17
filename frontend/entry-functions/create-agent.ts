import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type CreateAgentArguments = {
  id: string;
  name: string;
  description: string;
  agentType: string;
  price: number;
  executionCost: number;
};

export const initializeAgentRegistry = (): InputTransactionData => {
  return {
    data: {
      function: "0xccaece84eff0a373aeb954902e73a015dbca50abdfab0f909a06e3d71ca8e2e::AgentRegistry::initialize",
      typeArguments: [],
      functionArguments: [],
    },
    type: "entry_function_payload"
  };
};

export const isAgentRegistryInitialized = (address: string): InputTransactionData => {
  return {
    data: {
      function: "0xccaece84eff0a373aeb954902e73a015dbca50abdfab0f909a06e3d71ca8e2e::AgentRegistry::is_initialized",
      typeArguments: [],
      functionArguments: [address],
    },
    type: "view"
  };
};

export const createAgent = (args: CreateAgentArguments): InputTransactionData => {
  const { id, name, description, agentType, price, executionCost } = args;
  return {
    data: {
      function: "0xccaece84eff0a373aeb954902e73a015dbca50abdfab0f909a06e3d71ca8e2e::AgentRegistry::create_agent",
      typeArguments: [],
      functionArguments: [
        id,
        name,
        description,
        agentType,
        price.toString(),
        executionCost.toString()
      ],
    },
    type: "entry_function_payload"
  };
};