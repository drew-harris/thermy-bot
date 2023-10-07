import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { z, ZodSchema, ZodType } from "zod";

type SlashOptionsOnlyCommand = Omit<
  SlashCommandBuilder,
  "addSubcommand" | "addSubcommandGroup"
>;

type Options = {
  description: string;
  type: ZodType;
};

type OptionsList = Record<string, Options>;

export type Command<T> = OptionCommand<T>;

type OptionCommand<T> = {
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

type CommandConfig<T extends OptionsList | undefined> = {
  options?: T;
  name: string;
  description: string;
  inDMS?: boolean;
};

export const createCommand = <
  T extends OptionsList | undefined,
>(
  config: CommandConfig<T>,
  handler: OptionCommand<FlattenType<T>>["handle"],
) => {
  let command = new SlashCommandBuilder().setDescription(config.description)
    .setName(config.name).setDMPermission(config.inDMS);

  if (config.options) {
    for (const [key, value] of Object.entries(config.options)) {
      const optional = value.type.isOptional();
      const type = value.type instanceof z.ZodOptional
        ? value.type._def.innerType
        : value.type;
      if (
        type instanceof z.ZodString
      ) {
        command.addStringOption((o) => {
          o = o.setName(key).setDescription(value.description)
            .setRequired(!type.isOptional());
          // Add minlength
          type._def.checks.forEach((c) => {
            if (c.kind === "min") {
              if (c.value != 1) {
                o = o.setMinLength(c.value);
              } else {
                o = o.setRequired(true);
              }
            } else if (c.kind === "max") {
              o = o.setMaxLength(c.value);
            }
          });

          return o;
        });
      } else if (type instanceof z.ZodNumber) {
        command.addNumberOption((o) => {
          o = o.setName(key).setDescription(value.description)
            .setRequired(!type.isOptional());
          type._def.checks.forEach((c) => {
            if (c.kind === "min") {
              o = o.setMinValue(c.value);
            } else if (c.kind === "max") {
              o = o.setMaxValue(c.value);
            }
          });
          return o;
        });
      } else if (type instanceof z.ZodEnum) {
        command.addStringOption((o) => {
          o = o.setName(key).setDescription(value.description)
            .setRequired(!type.isOptional());
          o = o.addChoices(
            ...type._def.values.map((v: string) => {
              return { name: v, value: v };
            }),
          );
          return o;
        });
      } else if (type instanceof z.ZodBoolean) {
        command.addBooleanOption((o) => {
          o = o.setName(key).setDescription(value.description)
            .setRequired(!type.isOptional());
          return o;
        });
      } else {
        throw new Error("You used a zod type that hasn't been created yet");
      }
    }
  }
  // } else if (config.subCommands) {
  //   for (const subCommand of config.subCommands) {
  //     command.addSubcommand(
  //       subCommand.command as unknown as SlashCommandSubcommandBuilder,
  //     );
  //   }
  // }

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
    // subCommands: config.subCommands,
  } satisfies OptionCommand<FlattenType<T>>;
};
