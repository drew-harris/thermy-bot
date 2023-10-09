import {
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { FlattenType, OptionsList } from ".";
import z, { ZodSchema } from "zod";

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
>(baseCommand: T, options: OptionsList) {
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
