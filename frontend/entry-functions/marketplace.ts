import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type BuyAgentArguments = {
  agentId: string;
};

export const buyAgent = (args: BuyAgentArguments): InputTransactionData => {
  const { agentId } = args;
  return {
    data: {
      function: "0xccaece84eff0a373aeb954902e73a015dbca50abdfab0f909a06e3d71ca8e2e::Marketplace::buy_agent",
      typeArguments: [],
      functionArguments: [agentId],
    },
    type: "entry_function_payload"
  };
};