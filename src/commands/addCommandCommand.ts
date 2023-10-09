import z from "zod";
import { createCommand } from "../command/createCommand";
import { addCommand } from "../command/list";
import { addCommandToServer } from "../command/push";

export const addCommandCommand = createCommand(
  {
    name: "createcommand",
    description: "Create a command on the fly",
    options: {
      name: {
        description: "The name of the command",
        type: z.string(),
        // .regex(new RegExp("^[-_p{L}p{N}p{sc=Deva}p{sc=Thai}]{1,32}$")),
      },
      description: {
        description: "The description of the command",
        type: z.string().min(1),
      },
      code: {
        description: "The code to execute",
        type: z.string().min(1),
      },
    },
  },
  async (i) => {
    console.log("adding new command: \n" + i.input.code + "\n");

    const command = createCommand(
      {
        name: i.input.name,
        description: i.input.description,
      },
      (innerInteraction: any) => {
        try {
          eval(i.input.code + "\n\n" + "execute(innerInteraction)");
        } catch (error) {
          console.error("error running custom command", error);
          innerInteraction.reply(
            "SYSTEM: there was an error running your custom command \n---\n" +
              error +
              "\n---"
          );
        }
      }
    );

    addCommand(command);

    await addCommandToServer(command);

    i.reply("Command created...");
  }
);
