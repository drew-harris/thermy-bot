import { SlashCommandBuilder } from "discord.js";
import {
  FlattenType,
  InnerHandle,
  OptionCommand,
  OptionCommandConfig,
  OptionsList,
} from ".";
import {
  buildCommand,
  buildModalExecute,
  buildOptionExecute,
  buildSchema,
} from "./buildCommand";

/**
 * Creates a command that accepts options
 */
export const createCommand = <O extends OptionsList | undefined>(
  config: OptionCommandConfig<O>,
  handler: InnerHandle<FlattenType<O>>
): OptionCommand<FlattenType<O>> => {
  let command = new SlashCommandBuilder()
    .setDescription(config.description)
    .setName(config.name)
    .setDMPermission(config.inDMS);
  if (!config.modal) {
    command = buildCommand(command, config.options);
  }
  let schema = buildSchema(config.options);

  // Build the executor
  let fullExecute: ReturnType<typeof buildOptionExecute>;
  if (!config.modal || !config.options) {
    fullExecute = buildOptionExecute(handler, schema);
  } else {
    fullExecute = buildModalExecute(config.options, handler, schema);
  }

  return {
    handle: fullExecute,
    schema,
    command: command,
    name: config.name,
    type: "option",
    modal: config.modal || false,
  };
};
