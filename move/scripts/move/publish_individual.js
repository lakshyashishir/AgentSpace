require("dotenv").config();
const fs = require("node:fs");
const yaml = require("js-yaml");
const cli = require("@aptos-labs/ts-sdk/dist/common/cli/index.js");

const config = yaml.load(fs.readFileSync("../../.aptos/config.yaml", "utf8"));
const accountAddress = config["profiles"][`${process.env.PROJECT_NAME}-${process.env.VITE_APP_NETWORK}`]["account"];

async function publishModule(moduleName) {
  console.log(`Starting publication process for ${moduleName}...`);
  
  if (!process.env.VITE_COLLECTION_CREATOR_ADDRESS) {
    console.error("VITE_COLLECTION_CREATOR_ADDRESS variable is not set in .env file");
    return;
  }
  
  const move = new cli.Move();
  
  try {
    console.log(`Attempting to publish ${moduleName}...`);
    const result = await move.publish({
      packageDirectoryPath: `../../move/${moduleName}`,
      namedAddresses: {
        AgentSpace: process.env.VITE_COLLECTION_CREATOR_ADDRESS,
      },
      profile: `${process.env.PROJECT_NAME}-${process.env.VITE_APP_NETWORK}`,
    });
    
    console.log(`Successfully published ${moduleName}:`, result);
  } catch (error) {
    console.error(`Error publishing ${moduleName}:`, error);
    console.error("Error details:", error.message);
    if (error.stack) {
      console.error("Error stack:", error.stack);
    }
  }
}

async function publishAllModules() {
  console.log("Starting publication of all modules...");
  const modules = ['AgentCoin', 'AgentRegistry', 'ExecutionManager', 'Marketplace'];
  
  for (const module of modules) {
    console.log(`\n--- Publishing ${module} ---`);
    await publishModule(module);
  }
  console.log("\nFinished attempting to publish all modules.");
}

publishAllModules().catch(error => {
  console.error("An unexpected error occurred:", error);
});

console.log("Script execution started. Please wait for the publishing process to complete...");