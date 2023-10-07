import z from "zod";
import { createCommand } from "../command";

export const ashmedaiCmd = createCommand(
  {
    name: "ash",
    description: "clears all sus imagery from your screen",
  },
  async (inter) => {
    if (!inter.channel) return;
    const result = await inter.channel.messages
      .fetch({ limit: 100 })
      .then((messages) => {
        let safeMessages = 0;
        let removedMessages = 0;

        for (const mes of messages) {
          const m = mes[1];
          if (
            m.content.includes("cdn.waifu.im") ||
            m.embeds.some((e) => e.image?.url?.includes("cdn.waifu.im"))
          ) {
            m.delete();
            removedMessages++;
          } else {
            safeMessages++;
          }
          if (safeMessages > 15) break;
        }

        if (removedMessages > 0) {
          inter.reply("Cleared " + removedMessages + " messages");
        } else {
          inter.reply("Found nothing sus");
        }
      });
  }
);
