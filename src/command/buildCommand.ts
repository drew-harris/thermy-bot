import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  RestOrArray,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import z, { ZodError, ZodSchema } from "zod";
import {
  CommandGroup,
  FlattenType,
  InnerHandle,
  OptionCommand,
  OptionsList,
  SubCommand,
} from ".";

export function buildSchema<T>(options?: OptionsList) {
  if (!options) return z.any();
  let schema = z.object(
    Object.fromEntries(
      Object.entries(options).map(([key, value]) => [key, value.type])
    )
  ) as unknown as ZodSchema<FlattenType<T>>;
  return schema;
}

export function buildCommand<
  T extends SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandBuilder
>(baseCommand: T, options?: OptionsList) {
  if (!options) {
    return baseCommand;
  }
  for (const [key, value] of Object.entries(options)) {
    const isRequired = !value.type.isOptional();
    const type =
      value.type instanceof z.ZodOptional
        ? value.type._def.innerType
        : value.type;
    if (type instanceof z.ZodString) {
      baseCommand.addStringOption((o) => {
        o = o
          .setName(key)
          .setDescription(value.description)
          .setRequired(isRequired);
        // Add minlength
        type._def.checks.forEach((c) => {
          if (c.kind === "min") {
            if (c.value != 1) {
              o = o.setMinLength(c.value);
            } else {
              o = o.setRequired(isRequired);
            }
          } else if (c.kind === "max") {
            o = o.setMaxLength(c.value);
          }
        });

        return o;
      });
    } else if (type instanceof z.ZodNumber) {
      baseCommand.addNumberOption((o) => {
        o = o
          .setName(key)
          .setDescription(value.description)
          .setRequired(isRequired);
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
      baseCommand.addStringOption((o) => {
        o = o
          .setName(key)
          .setDescription(value.description)
          .setRequired(isRequired);
        o = o.addChoices(
          ...type._def.values.map((v: string) => {
            return { name: v, value: v };
          })
        );
        return o;
      });
    } else if (type instanceof z.ZodBoolean) {
      baseCommand.addBooleanOption((o) => {
        o = o
          .setName(key)
          .setDescription(value.description)
          .setRequired(isRequired);
        return o;
      });
    } else {
      throw new Error("You used a zod type that hasn't been created yet");
    }
  }
  return baseCommand;
}

export function buildOptionExecute<O extends OptionsList | undefined>(
  handler: InnerHandle<FlattenType<O>>,
  schema: ZodSchema
): OptionCommand<FlattenType<O>>["handle"] {
  const execute = async (interaction: ChatInputCommandInteraction) => {
    const data = interaction.options.data.reduce((acc, cur) => {
      acc[cur.name] = cur.value;
      return acc;
    }, {} as any);

    const parseResult = schema.safeParse(data);

    if (!parseResult.success) {
      if (parseResult.error instanceof ZodError) {
        interaction.reply(
          `For Field: ${parseResult.error.issues[0].path[0]}, ${parseResult.error.issues[0].message}`
        );
      }
      return;
    }
    let fullInteraction = Object.assign(interaction, {
      input: parseResult.data,
    });

    // Run the command
    await handler(fullInteraction);
  };

  return execute;
}

export function buildModalExecute<O extends OptionsList | undefined>(
  options: O,
  handler: InnerHandle<FlattenType<O>>,
  schema: ZodSchema
): OptionCommand<FlattenType<O>>["handle"] {
  const execute = async (interaction: ChatInputCommandInteraction) => {
    const randomId = Math.floor(Math.random() * 1000000000);

    let baseModal = new ModalBuilder()
      .setCustomId(randomId.toString())
      .setTitle("TEst");
    baseModal = buildModalResponse(baseModal, options);

    interaction.showModal(baseModal);
    interaction
      .awaitModalSubmit({
        time: 60000,
        filter: (i) => i.customId === randomId.toString(),
      })
      .then(async (newInteraction) => {
        console.log("Got interaction");

        const data = newInteraction.fields.fields.reduce((acc, cur) => {
          acc[cur.customId] = cur.value;
          return acc;
        }, {} as any);

        const parseResult = schema.safeParse(data);

        if (!parseResult.success) {
          if (parseResult.error instanceof ZodError) {
            interaction.reply(
              `For Field: ${parseResult.error.issues[0].path[0]}, ${parseResult.error.issues[0].message}`
            );
          }
          return;
        }

        console.log("DATA", data);

        let fullInteraction = Object.assign(newInteraction, {
          input: parseResult.data,
        });

        try {
          await handler(fullInteraction as any);
        } catch (error) {
          console.error("COULDN'T SEND REPSONSE", error);
        }
      });
  };

  return execute;
}

export function buildModalResponse<O extends OptionsList | undefined>(
  baseBuilder: ModalBuilder,
  options: O
): ModalBuilder {
  if (!options) {
    return baseBuilder;
  }
  const components: RestOrArray<ActionRowBuilder<TextInputBuilder>> = [];
  for (const [key, value] of Object.entries(options)) {
    const type =
      value.type instanceof z.ZodOptional
        ? value.type._def.innerType
        : value.type;
    if (type instanceof z.ZodString) {
      const input = new TextInputBuilder()
        .setLabel(key.toUpperCase())
        .setPlaceholder(value.description)
        .setRequired(!value.type.isOptional())
        .setCustomId(key)
        .setStyle(TextInputStyle.Short);
      const actionRow = new ActionRowBuilder().addComponents(input);
      components.push(actionRow as any);
    } else if (type instanceof z.ZodNumber) {
      throw new Error("You used a zod type that hasn't been created yet");
    } else if (type instanceof z.ZodEnum) {
      throw new Error("You used a zod type that hasn't been created yet");
    } else if (type instanceof z.ZodBoolean) {
      throw new Error("You used a zod type that hasn't been created yet");
    } else {
      throw new Error("You used a zod type that hasn't been created yet");
    }
  }

  baseBuilder = baseBuilder.addComponents(...components);

  return baseBuilder;
}

export function buildSubcommandExecute<O>(
  name: string,
  handler: InnerHandle<FlattenType<O>>,
  schema: ZodSchema
): SubCommand<FlattenType<O>>["handle"] {
  return async (interaction) => {
    const data = interaction.options.data
      .find((d) => d.name === name)
      ?.options?.reduce((acc, cur) => {
        acc[cur.name] = cur.value;
        return acc;
      }, {} as any);

    const parseResult = schema.safeParse(data);

    if (!parseResult.success) {
      if (parseResult.error instanceof ZodError) {
        console.error(parseResult.error);
        interaction.reply(
          `For Field: ${parseResult.error.issues[0].path[0]}, ${parseResult.error.issues[0].message}`
        );
      }
      return;
    }

    let fullInteraction = Object.assign(interaction, {
      input: parseResult.data,
    });

    // Run the command
    await handler(fullInteraction);
  };
}

export function buildCommandGroupExecute(
  subCommands: SubCommand<any>[]
): CommandGroup["handle"] {
  return async (interaction) => {
    let subCommandName: string;
    try {
      subCommandName = interaction.options.getSubcommand();
    } catch (err) {
      console.error("COULD NOT GET SUB COMMAND - DREW", err);
      subCommandName = "none";
    }

    const subCommand = subCommands.find((sub) => sub.name === subCommandName);

    if (!subCommand) {
      interaction.reply("Subcommand not found");
      return;
    }

    await subCommand.handle(interaction);
  };
}
