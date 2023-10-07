import { Command } from ".";
import { addCommandCommand } from "../commands/addCommandCommand";
import { fortniteStatsCmd } from "../commands/fortniteStats";
import { testCommand } from "../commands/testCommand";

export const commandsList: Command<any>[] = [
  testCommand,
  fortniteStatsCmd,
  addCommandCommand,
];

export const addCommand = <T>(command: Command<T>) => {
  commandsList.push(command);
};
