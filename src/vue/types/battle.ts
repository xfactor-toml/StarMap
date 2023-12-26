import { Race } from "~/blockchain/types";

export type BattleRunningState = 'initial' | 'searching';

export type BattleMember = {
  address: string
  name: string
  race: Race
}
