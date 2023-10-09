import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { z, ZodSchema, ZodType } from "zod";

type SlashOptionsOnlyCommand = Omit<
  SlashCommandBuilder,
  "addSubcommand" | "addSubcommandGroup"
>;

type Options = {
  description: string;
  type: ZodType;
};

export type OptionsList = Record<string, Options>;

export type Command<T> = OptionCommand<T> | CommandGroup;

export type AllCommands<T> = OptionCommand<T> | CommandGroup | SubCommand<T>;

export type OptionCommand<T> = {
  handle: (
    interaction: ChatInputCommandInteraction & {
      input: T;
    }
  ) => Promise<void> | void;
  command: SlashOptionsOnlyCommand;
  schema: ZodSchema;
  name: string;
  type: "option";
};

export type CommandGroup = {
  name: string;
  type: "group";
  command: SlashCommandSubcommandsOnlyBuilder;
  subcommands: SubCommand<any>[];
};

export type SubCommand<T> = Omit<OptionCommand<T>, "command" | "type"> & {
  subcommand: SlashCommandSubcommandBuilder;
  type: "subcommand";
};

export type FlattenType<T> = T extends Record<string, Options>
  ? {
      [K in keyof T]: T[K]["type"] extends z.Schema<infer U> ? U : never;
    }
  : undefined;

export type OptionCommandConfig<T extends OptionsList | undefined> = {
  options?: T;
  name: string;
  description: string;
  inDMS?: boolean;
  type?: "option";
};

export type CommandGroupConfig = {
  subcommands: SubCommand<any>[];
  name: string;
  description: string;
  inDMS?: boolean;
  type?: "group";
};
