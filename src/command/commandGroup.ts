import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import {
  CommandGroup,
  CommandGroupConfig,
  FlattenType,
  OptionCommand,
  OptionCommandConfig,
  OptionsList,
  SubCommand,
} from ".";
import { buildCommand, buildSchema } from "./buildCommand";
import z from "zod";

/**
 * Creates a command that accepts options
 */

export const createCommandGroup = (
  config: CommandGroupConfig,
): CommandGroup => {
  let groupCommand = new SlashCommandBuilder()
    .setName(config.name)
    .setDescription(config.description);

  config.subcommands.forEach((c) => {
    groupCommand.addSubcommand(c.subcommand);
  });

  return {
    subcommands: config.subcommands,
    command: groupCommand,
    type: "group",
    name: config.name,
  };
};

export const createSubCommand = <
  O extends OptionsList | undefined,
>(
  config: Omit<OptionCommandConfig<O>, "inDMS" | "type">,
  handler: OptionCommand<FlattenType<O>>["handle"],
): SubCommand<FlattenType<O>> => {
  if (config.options) {
    let command = new SlashCommandSubcommandBuilder().setDescription(
      config.description,
    )
      .setName(config.name);
    command = buildCommand(command, config.options);
    let schema = buildSchema(config.options);
    return {
      handle: handler as OptionCommand<FlattenType<O>>["handle"],
      schema,
      subcommand: command,
      name: config.name,
      type: "subcommand",
      // subCommands: config.subCommands,
    } satisfies SubCommand<FlattenType<O>>;
  } else {
    let command = new SlashCommandSubcommandBuilder().setDescription(
      config.description,
    )
      .setName(config.name);
    return {
      name: config.name,
      type: "subcommand",
      schema: z.any(),
      handle: handler as OptionCommand<FlattenType<O>>["handle"],
      subcommand: command,
    };
  }
};
