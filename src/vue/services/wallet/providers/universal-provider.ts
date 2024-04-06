import {
  ApprovePlasma,
  CreateNewStar,
  IncreaseStarLevel,
  MintPlasma,
  NetworkAuth,
  RefuelStar,
  SubscribeOnAccountChanging
} from "~/blockchain";
import { Coords, fuelTarget } from "~/blockchain/types";
import { BaseProvider } from "./base-provider";
import { Star } from "@/models";
import { ref } from "vue";
import { OpenBox } from "~/blockchain/boxes";
import { BlockchainConnectService } from "~/blockchainTotal";

export class UniversalProvider extends BaseProvider {
  account = ref('');
  subscribed = false;
  connectSubService: BlockchainConnectService;

  constructor () {
    super();
    this.connectSubService = new BlockchainConnectService();
  }

  async connect() {
    this.account = ref(await this.connectSubService.Auth())


    return this.account
  }

  /* async subscribe() {
    this.subscribed = true;
    this.account = ref(await SubscribeOnAccountChanging());
  } */

  async approvePlasma(amount: number) {
    return this.checkConnection(() => ApprovePlasma(this.account.value, amount));
  }

  async createStar(name: string, coords: Coords) {
    const owner = this.account.value;
    const uri = `${document.location.hostname}`;
    const race = Star.getRandomRace();

    return this.checkConnection(() => CreateNewStar(owner, name, uri, race, coords), null);
  }

  async refuelStar(starId: number, amount: number, target: fuelTarget) {
    return this.checkConnection(() => RefuelStar(this.account.value, starId, amount, target), null);
  }

  async refuelStarLevelUp(starId: number, amount: number) {
    return this.refuelStar(starId, amount, 'levelup');
  }

  async refuelStarExistence(starId: number, amount: number) {
    return this.refuelStar(starId, amount, 'existence');
  }

  async increaseStarLevel(starId: number) {
    return this.checkConnection(() => IncreaseStarLevel(this.account.value, starId), null);
  }

  async mintPlasma(amount: number): Promise<number> {
    return MintPlasma(this.account.value, amount);
  }

  async openBox(boxId: number) {
    try {
      await OpenBox(this.account.value, boxId);

      return true
    } catch (error) {
      console.error(error);
      return false
    }
  }
}
