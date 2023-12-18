import { Client, Events, GatewayIntentBits } from "discord.js";
require("dotenv/config"); // Load environment variables
import handleMessage from "./handleMessage";
import { startServer } from "./fastify";
import { handleCommand } from "./command/handler";
import { bundle } from "@remotion/bundler";
console.log(process.env.TOKEN);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, (message) => {
  handleMessage(message);
});

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.isChatInputCommand()) {
    handleCommand(interaction);
  }
});

const token = process.env.REAL_TOKEN;

if (!token) {
  console.error("No token provided!");
  process.exit(1);
}

client.login(token);

// Start the remotion bundler

startServer();

export { client };
