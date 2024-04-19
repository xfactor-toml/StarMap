import {
  BlockchainConnectService, LocalMethods
} from "~/blockchainTotal";
import { Coords, fuelTarget } from "~/blockchainTotal/types";
import { BaseProvider } from "./base-provider";
import { Star } from "@/models";
import { ref } from "vue";
import { OpenBoxWeb2 } from "~/blockchainTotal/local/methods/box";
import { getUserBoxesToOpenWeb2 } from "~/blockchainTotal/getters/boxesWeb2";

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
    console.log("Opening: ", boxId)
    try {
      await OpenBoxWeb2(this.account.value, boxId);

      return true
    } catch (error) {
      console.error(error);
      return false
    }
  }

  async getUserBoxesToOpen() {
    return this.checkConnection(() => getUserBoxesToOpenWeb2(this.account.value) as any, []);
  }

}
