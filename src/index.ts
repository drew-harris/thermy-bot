import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config"; // Load environment variables
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
  if (message.author.id === client.user?.id) return; // Prevent infinite loops

  if (message.content === "test1123") {
    message.reply("tost1123");
  }
});

const token = process.env.TOKEN;

if (!token) {
  console.error("No token provided!");
  process.exit(1);
}

client.login(token);
