import z from "zod";
import { createCommand } from "../command";

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
