require("dotenv").config();
const fs = require("node:fs");
const yaml = require("js-yaml");
const cli = require("@aptos-labs/ts-sdk/dist/common/cli/index.js");
const { Agent } = require("node:http");

const config = yaml.load(fs.readFileSync("./.aptos/config.yaml", "utf8"));
const accountAddress =
  config["profiles"][`${process.env.PROJECT_NAME}-${process.env.VITE_APP_NETWORK}`]["account"];

async function compile() {
  if (!process.env.VITE_COLLECTION_CREATOR_ADDRESS) {
    throw new Error(
      "VITE_COLLECTION_CREATOR_ADDRESS variable is not set, make sure you set it on the .env file"
    );
  }

  const move = new cli.Move();

  await move.compile({
    packageDirectoryPath: "move",
    flags: ["--dev"],
    namedAddresses: {
      AgentSpace: "0x0ccaece84eff0a373aeb954902e73a015dbca50abdfab0f909a06e3d71ca8e2e",
    },
  });
}
compile();
