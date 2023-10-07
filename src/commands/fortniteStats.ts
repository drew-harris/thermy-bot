import z from "zod";
import { createCommand } from "../command";

export const fortniteStatsCmd = createCommand(
  {
    name: "wins",
    description: "Get Fortnite stats for a player",
    options: {
      name: {
        description: "the players name",
        type: z.string().min(1),
      },
      platform: {
        type: z.enum(["epic", "psn", "xbl"]),
        description: "The platform to get the stats of",
      },
    },
  },
  async (i) => {
    try {
      const params = new URLSearchParams({
        accountType: i.input.platform,
        name: i.input.name,
        image: "all",
      });
      if (!process.env.FORTNITE_KEY) {
        throw new Error("Could not get fortnite api key");
      }
      const response = await fetch(
        "https://fortnite-api.com/v2/stats/br/v2?" + params.toString(),
        {
          headers: {
            Authorization: process.env.FORTNITE_KEY,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("DATA: ", data);
        i.reply(data.data.image || "Could not get stats");
      } else {
        i.reply(await response.text());
      }
    } catch (err) {
      throw new Error("Could not get stats");
    }
  }
);
