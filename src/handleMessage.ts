import { Message } from "discord.js";
import { getRandomInt } from "./utils";
import { client } from ".";
import { respond } from "./ai";

export default async function handleMessage(message: Message<boolean>) {
  if (message.author.id === client.user?.id) return; // Prevent infinite loops

  if (message.content === "test1123") {
    message.reply("tost1123");
  }

  // Thermy ai
  if (
    message.content.startsWith("Thermy,") ||
    message.content.startsWith("thermy,") ||
    message.content.startsWith("hey thermy") ||
    message.content.startsWith("hey Thermy")
  ) {
    const prompt = message.content;
    const response = await respond(prompt);
    message.reply(response);
  }

  if (
    message.content === "!help" ||
    message.content ===
      "https://cdn.discordapp.com/attachments/1144492655020097627/1144683976502558750/lvMMdcpe.gif" ||
    getRandomInt(1000) == 0
  ) {
    message.reply(
      "The Thermal DMR is a semi automatic, fast-firing rifle that shoots quick-moving projectiles. It has a large magazine and can deal quick successive damage over range. It features a low-power scope with toggleable thermal vision. Stats: The Thermal DMR uses Medium Ammo and has a headshot multiplier of 1.65x. The Thermal DMR is a Fast Moving Projectile weapon, with a scope. There is no falloff damage on the DMR's projectiles. The Thermal DMR cannot reload whilst aiming. Strategy Guide: When using this weapon, bare in mind that you have traded raw damage output for the ability to scout out for players easier. Enemies using the Twin Mag Assault Rifle can outplay you from longer ranges, due to their gun being hitscan and yours not. Use the scope's thermal vision to pick out enemies that you may not have been able to see otherwise. The Thermal DMR excels at medium to longer ranges, so it is ideal to keep a closer ranged weapon for close quarters engagements. If you have been cornered and do not have other weapon in your hand, remember that Thermal DMR fires only slightly slower than most assault rifles, thus can be used at close range, though ineffectively. Consider the range you engage an enemy, you may need to predict your ballistics when firing at a moving target. Despite the high fire rate, you should fire more slowly when taking an enemy on a distance as to not waste ammo trying to control the wild recoil. History: Chapter 4 Season 3 - Update v25.00: Introduced the Thermal DMR in Common to Mythic."
    );
  }

  //if the message contains the word "art"
  if () {
    message.reply(
      "https://cdn.discordapp.com/attachments/1144492655020097627/1144683976502558750/lvMMdcpe.gif"
    );
  }
  if (message.content.ToLower().startsWith("thermy") && message.content.toLowerCase().includes("artwork")) {
    message.reply("/waifu type:SFW tag:waifu");
  }
}
