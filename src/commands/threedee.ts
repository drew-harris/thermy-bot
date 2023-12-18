import z from "zod";
import { createCommand } from "../command/createCommand";
import { exec } from "child_process";

export const threedee = createCommand(
  {
    name: "threedee",
    description: "Renders video really cool",
    options: {
      imageurl: {
        description: "Url of the image to render",
        type: z.string().min(5),
      },
    },
  },
  async (inter) => {
    inter.deferReply();

    // Open a shell to render with remotion
    const child = exec(
      ` npx remotion render src/remotion/index.ts MyComp out.mp4 --gl angle --props='${JSON.stringify(
        {
          imageUrl: inter.input.imageurl,
        }
      )}'`
    );

    // Log the output of the shell
    child?.stdout?.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    // Wait for the shell to finish
    child?.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      inter.editReply("Done rendering!");

      // Send the video file
      inter.channel?.send({
        files: [
          {
            attachment: "out.mp4",
            name: "out.mp4",
          },
        ],
      });
    });
  }
);
