import z from "zod";
import { ashDelete } from "../utils/ashmedai";
import { createCommand } from "../command/createCommand";

export const ashmedaiCmd = createCommand(
  {
    name: "ash",
    description: "clears all sus imagery from your screen",
    options: {
      max: {
        description: "number of safe messages to display",
        type: z.number().min(1).max(30).optional(),
      },
    },
  },
  async (inter) => {
    ashDelete(inter, inter.input.max);
  }
);
