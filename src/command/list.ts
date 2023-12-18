import { Command, OptionCommand } from ".";
import { addCommandCommand } from "../commands/addCommandCommand";
import { fortniteStatsCmd } from "../commands/fortniteStats";
import { testCommand, testGroup } from "../commands/testCommand";
import { threedee } from "../commands/threedee";

export const commandsList: Command<any>[] = [
  testCommand,
  fortniteStatsCmd,
  addCommandCommand,
  testGroup,
  threedee,
];

export const addCommand = <T>(command: OptionCommand<T>) => {
  commandsList.push(command);
};
