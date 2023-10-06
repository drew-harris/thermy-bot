import {
  CommandInteraction,
  SlashCommandBuilder,
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

type OptionsList = Record<string, Options>;

type Command<T extends ZodType | undefined> = {
  handle: (
    interaction: CommandInteraction & {
      input: T extends ZodType ? z.infer<T> : undefined;
    },
  ) => void;
  command:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashOptionsOnlyCommand;

  schema: T;
};

export const createCommand = <T extends ZodType | undefined>(
  handler: Command<T>["handle"],
  schema: T,
  options: Record<string, Options>,
) => {
  const b = new SlashCommandBuilder();

  return {
    handle: handler,
    command: new SlashCommandBuilder(),
    schema,
  } satisfies Command<T>;
};

createCommand(
  (interaction) => {
    switch (interaction.input.platform) {
      case "ps4":
        console.log(interaction.input.platform);
        return;
      case "pc":
        console.log(interaction.input.platform);
    }
  },
  z.object({
    name: z.string().min(5),
    desc: z.string().nonempty(),

    platform: z.enum(["ps4", "pc"]),
  }),
  {
    name: {
      description: "your name",
      type: z.string(),
    },
  },
);

type FlattenType<T> = T extends Record<string, Options> ? {
    [K in keyof T]: T[K]["type"] extends z.Schema<infer U> ? U : never;
  }
  : T;

const input: OptionsList = {
  name: {
    description: "your name",
    type: z.string(),
  },
  age: {
    description: "your age",
    type: z.number(),
  },
};

type FlattenedInput = FlattenType<typeof input>;
