require("dotenv").config();
const fs = require("node:fs");
const yaml = require("js-yaml");
const cli = require("@aptos-labs/ts-sdk/dist/common/cli/index.js");

const config = yaml.load(fs.readFileSync("./.aptos/config.yaml", "utf8"));
const accountAddress = config["profiles"][`${process.env.PROJECT_NAME}-${process.env.VITE_APP_NETWORK}`]["account"];

async function publish() {
  if (!process.env.VITE_COLLECTION_CREATOR_ADDRESS) {
    throw new Error("VITE_COLLECTION_CREATOR_ADDRESS variable is not set, make sure you set it on the .env file");
  }

  const move = new cli.Move();

  move
    .createObjectAndPublishPackage({
      packageDirectoryPath: "move",
      addressName: "AgentSpace",
      namedAddresses: {
        AgentSpace: "0ccaece84eff0a373aeb954902e73a015dbca50abdfab0f909a06e3d71ca8e2e",
      },
      profile: `${process.env.PROJECT_NAME}-${process.env.VITE_APP_NETWORK}`,
    })
    .then((objectAddress) => {
      const filePath = ".env";
      let envContent = "";

      // Check .env file exists and read it
      if (fs.existsSync(filePath)) {
        envContent = fs.readFileSync(filePath, "utf8");
      }

      // Regular expression to match the VITE_MODULE_ADDRESS variable
      const regex = /^VITE_MODULE_ADDRESS=.*$/m;
      const newEntry = `VITE_MODULE_ADDRESS=${objectAddress}`;

      // Check if VITE_MODULE_ADDRESS is already defined
      if (envContent.match(regex)) {
        // If the variable exists, replace it with the new value
        envContent = envContent.replace(regex, newEntry);
      } else {
        // If the variable does not exist, append it
        envContent += `\n${newEntry}`;
      }

      // Write the updated content back to the .env file
      fs.writeFileSync(filePath, envContent, "utf8");
    })
    .catch((error) => {
      console.error("Error publishing package:", error);
      if (error.message.includes("Simulation failed")) {
        console.error("Simulation error details:", error.message);
      }
    });
}
publish();
