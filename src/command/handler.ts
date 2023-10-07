import { ChatInputCommandInteraction } from "discord.js";
import { commandsList } from "./list";
import { ZodError } from "zod";

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

  if (matchingCommand.type === "option") {
    const data = interaction.options.data.reduce((acc, cur) => {
      acc[cur.name] = cur.value;
      return acc;
    }, {} as any);

    const parseResult = matchingCommand.schema.safeParse(data);

    if (!parseResult.success) {
      if (parseResult.error instanceof ZodError) {
        interaction.reply(
          `For Field: ${parseResult.error.issues[0].path[0]}, ${parseResult.error.issues[0].message}`
        );
      }
      return;
    }
    let fullInteraction = Object.assign(interaction, {
      input: parseResult.data,
    });

    // Run the command
    try {
      // TODO: Fix constituent type error
      await matchingCommand.handle(fullInteraction as any);
    } catch (error) {
      console.error(error);
      interaction.reply("There was an error while executing this command!");
    }
  }
};
