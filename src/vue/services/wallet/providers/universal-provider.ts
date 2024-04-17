import {
  BlockchainConnectService, LocalMethods
} from "~/blockchainTotal";
import { Coords, fuelTarget } from "~/blockchain/types";
import { BaseProvider } from "./base-provider";
import { Star } from "@/models";
import { ref } from "vue";
import { OpenBox } from "~/blockchain/boxes";

export class UniversalProvider extends BaseProvider {
  account = ref('');
  subscribed = false;
  connectSubService: BlockchainConnectService;

  constructor () {
    super();
    this.connectSubService = BlockchainConnectService.getInstance();
  }

  async connect() {
    this.account = ref(await this.connectSubService.connect())
    return this.account
  }

  async subscribe() {
    this.subscribed = true;
    // this.account = ref(await SubscribeOnAccountChanging());
  }

  async approvePlasma(amount: number) {
    return this.checkConnection(() => LocalMethods.Txns.ApprovePlasma(this.account.value, amount));
  }

  async createStar(name: string, coords: Coords) {
    const owner = this.account.value;
    const uri = `${document.location.hostname}`;
    const race = Star.getRandomRace();

    return this.checkConnection(() => LocalMethods.Txns.CreateNewStar(owner, name, uri, race, coords), null);
  }

  async refuelStar(starId: number, amount: number, target: fuelTarget) {
    return this.checkConnection(() => LocalMethods.Txns.RefuelStar(this.account.value, starId, amount, target), null);
  }

  async refuelStarLevelUp(starId: number, amount: number) {
    return this.refuelStar(starId, amount, 'levelup');
  }

  async refuelStarExistence(starId: number, amount: number) {
    return this.refuelStar(starId, amount, 'existence');
  }

  async increaseStarLevel(starId: number) {
    return this.checkConnection(() => LocalMethods.Txns.IncreaseStarLevel(this.account.value, starId), null);
  }

  async mintPlasma(amount: number): Promise<number> {
    return LocalMethods.Txns.MintPlasma(this.account.value, amount);
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
