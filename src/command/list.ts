import { Command, OptionCommand } from ".";
import { addCommandCommand } from "../commands/addCommandCommand";
import { fortniteStatsCmd } from "../commands/fortniteStats";
import { testCommand, testGroup } from "../commands/testCommand";

export const commandsList: Command<any>[] = [
  testCommand,
  fortniteStatsCmd,
  addCommandCommand,
  testGroup,
];

export const addCommand = <T>(command: OptionCommand<T>) => {
  commandsList.push(command);
};
