import { ChatInputCommandInteraction } from "discord.js";
import { commandsList } from "./list";

export const handleCommand = async (
  interaction: ChatInputCommandInteraction
) => {
  console.log(interaction.commandName);
  let matchingCommand = commandsList.find((c) => {
    if (c.name === interaction.commandName) return true;
    return false;
  });
  if (!matchingCommand) {
    interaction.reply("Command not found oh no");
    return;
  }

  try {
    await matchingCommand.handle(interaction);
  } catch (error) {
    console.error(error);
    interaction.reply("There was an error while executing this command!");
  }
};
