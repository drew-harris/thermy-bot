import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { z, ZodSchema, ZodType } from "zod";

type SlashOptionsOnlyCommand = Omit<
  SlashCommandBuilder,
  "addSubcommand" | "addSubcommandGroup"
>;

type Options = {
  name?: string;
  description: string;
  type: ZodType;
};

type OptionsList = Record<string, Options>;

type Command<T> = {
  handle: (
    interaction: ChatInputCommandInteraction & {
      input: T;
    },
  ) => Promise<void> | void;
  command: SlashOptionsOnlyCommand;
  schema: ZodSchema;
  name: string;
};

type FlattenType<T> = T extends Record<string, Options> ? {
    [K in keyof T]: T[K]["type"] extends z.Schema<infer U> ? U : never;
  }
  : undefined;

type CommandConfig<T extends OptionsList> = {
  options?: T;
  name: string;
  description: string;
};

export const createCommand = <T extends OptionsList, F extends FlattenType<T>>(
  config: CommandConfig<T>,
  handler: Command<FlattenType<T>>["handle"],
) => {
  const command = new SlashCommandBuilder().setDescription(config.description)
    .setName(config.name);

  if (config.options) {
    for (const [key, value] of Object.entries(config.options)) {
      // If it is a string
      if (
        value.type instanceof z.ZodString || value.type instanceof z.ZodEnum
      ) {
        console.log("Adding string option");
        command.addStringOption((o) => {
          console.log(`adding string option: ${value.name} key:${key}`);
          o = o.setName(value.name || key);
          o = o.setDescription(value.description);
          if (value.type.isOptional()) {
            o = o.setRequired(false);
          }
          return o;
        });
      }
    }
  }

  // Create the schema
  let schema;
  if (config.options) {
    schema = z.object(
      Object.fromEntries(
        Object.entries(config.options).map(([key, value]) => [
          key,
          value.type,
        ]),
      ),
    ) as unknown as ZodSchema<FlattenType<T>>;
  } else {
    schema = z.any();
  }

  return {
    handle: handler,
    schema,
    command: command,
    name: config.name,
  } satisfies Command<F>;
};
