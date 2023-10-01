import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config"; // Load environment variables
import handleMessage from "./handleMessage";
import { startServer } from "./fastify";
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

const token = process.env.TOKEN;

if (!token) {
  console.error("No token provided!");
  process.exit(1);
}

client.login(token);
startServer();

export { client };
