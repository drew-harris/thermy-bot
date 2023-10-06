import z from "zod";
import { createCommand } from "../command";

export const testCommand = createCommand(
  {
    name: "test",
    description: "simple test command",
    options: {
      name: {
        name: "name",
        description: "A test description",
        type: z.string(),
      },
    },
  },
  (inter) => {
    console.log("input: ", inter.input);
    inter.reply(`Hello ${inter.input.name}!`);
  }
);
