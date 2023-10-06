import { CommandInteraction, SlashCommandBuilder } from "discord.js";
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
    interaction: CommandInteraction & {
      input: T;
    },
  ) => void;
  command: SlashOptionsOnlyCommand;
  schema: ZodSchema;
};

type FlattenType<T> = T extends Record<string, Options> ? {
    [K in keyof T]: T[K]["type"] extends z.Schema<infer U> ? U : never;
  }
  : T;

export const createCommand = <T extends OptionsList, F extends FlattenType<T>>(
  handler: Command<FlattenType<T>>["handle"],
  options: T,
) => {
  const b = new SlashCommandBuilder();

  // Create zod schema
  for (const [key, value] of Object.entries(options)) {
    // If it is a string
    if (value.type instanceof z.ZodString || value.type instanceof z.ZodEnum) {
      b.addStringOption((o) => {
        o.setName(value.name || key).setDescription(value.description);
        if (value.type.isOptional()) {
          o.setRequired(false);
        }
        return o;
      });
    }
  }

  const schema = z.object(
    Object.fromEntries(
      Object.entries(options).map(([key, value]) => [
        key,
        value.type,
      ]),
    ),
  ) as unknown as ZodSchema<FlattenType<T>>;

  return {
    handle: handler,
    schema,
    command: b,
  } satisfies Command<F>;
};

export const statsCmd = createCommand(
  (interaction) => {
    console.log(interaction.input.platform);
  },
  // Input goes here
  {
    platform: {
      description: "the platform for the account",
      type: z.enum(["psn", "pc"]).optional(),
    },
  },
);
