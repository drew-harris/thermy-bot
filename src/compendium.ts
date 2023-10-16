//conpendium of strings for artwork
const compendium = ["https://cdn.waifu.im/7274.jpg"];
const rare_compendium = ["https://cdn.waifu.im/7498.jpg"];

export function getArtwork(rarity: number) {
  if (rarity == 5) {
    return rare_compendium[Math.floor(Math.random() * rare_compendium.length)];
  } else {
    return compendium[Math.floor(Math.random() * compendium.length)];
  }
}
