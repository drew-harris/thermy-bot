import { ChatInputCommandInteraction, Message } from "discord.js";

export const ashDelete = async (
  interaction: ChatInputCommandInteraction | Message,
  max: number = 15
) => {
  if (!interaction.channel) return;
  const result = await interaction.channel.messages
    .fetch({ limit: 100 })
    .then((messages) => {
      let safeMessages = 0;
      let removedMessages = 0;

      for (const mes of messages) {
        const m = mes[1];
        console.log(m.content);
        if (
          m.content.includes("cdn.waifu.im") ||
          m.embeds.some((e) => e.image?.url?.includes("cdn.waifu.im"))
        ) {
          m.delete();
          removedMessages++;
        } else {
          safeMessages++;
        }
        if (safeMessages > max + 1) break;
      }

      if (removedMessages > 0) {
        interaction.reply(
          "Cleared " +
            removedMessages +
            (removedMessages == 1 ? " message" : " messages")
        );
      } else {
        interaction.reply("Found nothing sus");
      }
    });
};
