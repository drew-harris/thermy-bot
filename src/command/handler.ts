import { ChatInputCommandInteraction } from "discord.js";
import { commandsList } from "./list";

export const handleCommand = async (
  interaction: ChatInputCommandInteraction
) => {
  console.log(interaction.commandName);
  let matchingCommand = commandsList.find(
    (c) => c.name === interaction.commandName
  );
  if (!matchingCommand) {
    interaction.reply("Command not found");
    return;
  }

  // Check the schema
  // console.log("DATA: ",  [ { name: 'name', type: 3, value: 'drew' } ]

  const data = interaction.options.data.reduce((acc, cur) => {
    acc[cur.name] = cur.value;
    return acc;
  }, {} as any);

  const input = matchingCommand.schema.parse(data);

  let fullInteraction = Object.assign(interaction, { input });

  // Run the command
  try {
    await matchingCommand.handle(fullInteraction);
  } catch (error) {
    console.error(error);
    interaction.reply("There was an error while executing this command!");
  }
};
