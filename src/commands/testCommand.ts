import z from "zod";
import { createCommandGroup, createSubCommand } from "../command/commandGroup";
import { createCommand } from "../command/createCommand";

export const testCommand = createCommand(
  {
    name: "test",
    description: "simple test command",
    options: {
      name: {
        description: "A test description",
        type: z.string().min(5),
      },
      platform: {
        description: "Your game platform",
        type: z.enum(["ps4", "pc"]),
      },
    },
  },
  (inter) => {
    console.log("input: ", inter.input);
    inter.reply(
      `Hello ${inter.input.name}! your platform: ${inter.input.platform}`
    );
  }
);

export const testGroup = createCommandGroup({
  name: "testgroup",
  description: "testgroup of commands",
  subcommands: [
    createSubCommand(
      {
        name: "hello",
        description: "says hello",
      },
      (int) => {
        int.reply("yo whats up");
      }
    ),
    createSubCommand(
      {
        name: "goodbye",
        description: "says goodbye",
        options: {
          name: {
            type: z.string(),
            description: "Your name",
          },
        },
      },
      (int) => {
        int.reply(`goodbye ${int.input.name}`);
      }
    ),
  ],
});
