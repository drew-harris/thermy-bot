import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import {
  CommandGroup,
  CommandGroupConfig,
  FlattenType,
  InnerHandle,
  OptionCommandConfig,
  OptionsList,
  SubCommand,
} from ".";
import {
  buildCommand,
  buildCommandGroupExecute,
  buildModalExecute,
  buildOptionExecute,
  buildSchema,
  buildSubcommandExecute,
} from "./buildCommand";

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

  const handle = buildCommandGroupExecute(config.subcommands);

  return {
    handle: handle,
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
  handler: InnerHandle<FlattenType<O>>,
): SubCommand<FlattenType<O>> => {
  let command = new SlashCommandSubcommandBuilder().setDescription(
    config.description,
  )
    .setName(config.name);
  let schema = buildSchema(config.options);
  if (!config.modal) {
    command = buildCommand(command, config.options);
  }
  if (config.modal) {
  }
  let fullExecute: ReturnType<typeof buildOptionExecute>;
  if (!config.modal || !config.options) {
    fullExecute = buildOptionExecute(handler, schema);
  } else {
    fullExecute = buildModalExecute(config.options, handler, schema);
  }
  return {
    handle: fullExecute,
    modal: config.modal && !!config.options || false,
    schema,
    subcommand: command,
    name: config.name,
    type: "subcommand",
    // subCommands: config.subCommands,
  } satisfies SubCommand<FlattenType<O>>;
};
