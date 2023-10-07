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
  F extends FlattenType<T>,
>(
  config: CommandConfig<T>,
  handler: OptionCommand<FlattenType<T>>["handle"],
) => {
  let command = new SlashCommandBuilder().setDescription(config.description)
    .setName(config.name).setDMPermission(config.inDMS);

  if (config.options) {
    for (const [key, value] of Object.entries(config.options)) {
      const type = value.type;
      if (
        type instanceof z.ZodString
      ) {
        console.log("Adding string option");
        command.addStringOption((o) => {
          console.log(`adding string option: ${value.name} key:${key}`);
          o = o.setName(value.name || key).setDescription(value.description)
            .setRequired(!type.isOptional());
          // Add minlength
          type._def.checks.forEach((c) => {
            console.log("kind: ", c.kind);
            if (c.kind === "min") {
              console.log("adding min length", c.value);
              if (c.value != 1) {
                o = o.setMinLength(c.value);
              } else {
                o = o.setRequired(true);
              }
            }
          });

          return o;
        });
      } else if (type instanceof z.ZodNumber) {
        console.log("Adding number option");
        command.addNumberOption((o) => {
          console.log(`adding string option: ${value.name} key:${key}`);
          o = o.setName(value.name || key).setDescription(value.description)
            .setRequired(!type.isOptional());
          return o;
        });
      } else if (type instanceof z.ZodEnum) {
        command.addStringOption((o) => {
          console.log(`adding string option: ${value.name} key:${key}`);
          o = o.setName(value.name || key).setDescription(value.description)
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
          console.log(`adding string option: ${value.name} key:${key}`);
          o = o.setName(value.name || key).setDescription(value.description)
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
  } satisfies OptionCommand<F>;
};
