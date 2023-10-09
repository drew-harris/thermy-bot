import { ChatInputCommandInteraction } from "discord.js";
import { commandsList } from "./list";
import { ZodError } from "zod";

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
  } else if (matchingCommand.type === "group") {
    try {
      let subCommandName: string;
      try {
        subCommandName = interaction.options.getSubcommand();
      } catch (err) {
        console.error("COULD NOT GET SUB COMMAND - DREW", err);
        subCommandName = "none";
      }

      const subCommand = matchingCommand.subcommands.find(
        (sub) => sub.name === subCommandName
      );

      if (!subCommand) {
        interaction.reply("Subcommand not found");
        return;
      }

      const data = interaction.options.data
        .find((d) => d.name === subCommandName)
        ?.options?.reduce((acc, cur) => {
          acc[cur.name] = cur.value;
          return acc;
        }, {} as any);

      const parseResult = subCommand.schema.safeParse(data);

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
      await subCommand.handle(fullInteraction);
    } catch (error) {
      console.error(error);
      interaction.reply("There was an error while executing this command!");
    }
  }
};
