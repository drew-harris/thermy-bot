import { SlashCommandBuilder } from "discord.js";
import { z } from "zod";
import { buildCommand, buildSchema } from "./buildCommand";
import {
  FlattenType,
  OptionCommand,
  OptionCommandConfig,
  OptionsList,
} from ".";

/**
 * Creates a command that accepts options
 */

export const createCommand = <
  O extends OptionsList | undefined,
>(
  config: OptionCommandConfig<O>,
  handler: OptionCommand<FlattenType<O>>["handle"],
): OptionCommand<FlattenType<O>> => {
  if (config.options) {
    let command = new SlashCommandBuilder().setDescription(config.description)
      .setName(config.name).setDMPermission(config.inDMS);
    command = buildCommand(command, config.options);
    let schema = buildSchema(config.options);
    return {
      handle: handler as OptionCommand<FlattenType<O>>["handle"],
      schema,
      command: command,
      name: config.name,
      type: "option",
    } satisfies OptionCommand<FlattenType<O>>;
  } else {
    let command = new SlashCommandBuilder().setDescription(config.description)
      .setName(config.name).setDMPermission(config.inDMS);
    return {
      name: config.name,
      type: "option",
      schema: z.any(),
      handle: handler as OptionCommand<FlattenType<O>>["handle"],
      command: command,
    };
  }
};
