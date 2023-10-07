import { commandsList } from "./list";
import "dotenv/config"; // Load environment variables

(async () => {
  const allCommands = commandsList.map((c) => c.command.toJSON());
  console.log("ALL COMMANDS: ", allCommands);

  const rest = await import("@discordjs/rest");
  const { Routes } = await import("discord-api-types/v9");

  if (!process.env.TOKEN) {
    console.error("No token provided!");
    process.exit(1);
  }

  if (!process.env.CLIENT_ID) {
    console.error("No client ID provided!");
    process.exit(1);
  }

  console.log("CLIENT ID: ", process.env.CLIENT_ID);

  const restClient = new rest.REST({ version: "9" }).setToken(
    process.env.TOKEN
  );

  try {
    console.log("Started refreshing application (/) commands.");

    await restClient.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: allCommands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
