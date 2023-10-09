import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  TextInputBuilder,
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

type ModalOptions = Options & {
  purple: boolean;
};

export type OptionsList = Record<string, Options>;
export type ModalOptionsList = Record<string, ModalOptions>;

export type Command<T> = OptionCommand<T> | CommandGroup;

export type AllCommands<T> = OptionCommand<T> | CommandGroup | SubCommand<T>;

export type OptionCommand<T> = {
  handle: CommandInteractionHandler;
  command: SlashOptionsOnlyCommand;
  schema: ZodSchema;
  name: string;
  type: "option";
  modal: boolean;
};

export type InnerHandle<T> = (
  interaction: ChatInputCommandInteraction & {
    input: T;
  }
) => Promise<void> | void;

export type CommandInteractionHandler = (
  interaction: ChatInputCommandInteraction
) => Promise<void> | void;

export type CommandGroup = {
  handle: CommandInteractionHandler;
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
  modal?: boolean;
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
