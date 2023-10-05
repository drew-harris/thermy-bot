import { EmbedBuilder } from "discord.js";

export function artwork(url: string) {
  const image = url;
  const rarityCheck = image.substring(image.length - 6, image.length - 4);
  const rarityNum = parseInt(rarityCheck);
  let rarity;
  if (rarityNum < 35) {
    rarity = 1;
  } else if (rarityNum < 70) {
    rarity = 2;
  } else if (rarityNum < 87) {
    rarity = 3;
  } else if (rarityNum < 96) {
    rarity = 4;
  } else {
    rarity = 5;
  }
  let starList = ":star:";
  for (let i = 1; i < rarity; ++i) {
    starList += ":star:";
  }

  let color;
  if (rarity === 1) {
    color = 0xffffff;
  } else if (rarity === 2) {
    color = 0x20f123;
  } else if (rarity === 3) {
    color = 0x1c55ec;
  } else if (rarity === 4) {
    color = 0x811bee;
  } else if (rarity === 5) {
    color = 0xece91c;
  } else {
    color = 0x000000;
  }
  const embed = new EmbedBuilder()
    .setColor(color)
    .setImage(image)
    .setDescription(`Rarity: ${starList}`);

  /*const rsp = await interaction.editReply({
            embeds: [embed]
        });*/
  return embed;
}
