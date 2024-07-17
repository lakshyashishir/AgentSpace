import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { convertAmountFromHumanReadableToOnChain } from "@/utils/helpers";

export type BuyAgcnArguments = {
  aptAmount: number;
};

export const buyAgcn = (args: BuyAgcnArguments): InputTransactionData => {
  const { aptAmount } = args;
  return {
    data: {
      function: "0xccaece84eff0a373aeb954902e73a015dbca50abdfab0f909a06e3d71ca8e2e::AgentCoin::buy_agcn",
      typeArguments: [],
      functionArguments: [convertAmountFromHumanReadableToOnChain(aptAmount, 6)],
    },
    type: "entry_function_payload"
  };
};