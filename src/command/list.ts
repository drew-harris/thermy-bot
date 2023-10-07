import { Command } from ".";
import { addCommandCommand } from "../commands/addCommandCommand";
import { ashmedaiCmd } from "../commands/ashmedai";
import { fortniteStatsCmd } from "../commands/fortniteStats";
import { testCommand } from "../commands/testCommand";

export const commandsList: Command<any>[] = [
  testCommand,
  fortniteStatsCmd,
  addCommandCommand,
  ashmedaiCmd,
];

export const addCommand = <T>(command: Command<T>) => {
  commandsList.push(command);
};
