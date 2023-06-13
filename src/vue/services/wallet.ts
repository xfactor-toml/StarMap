import { Star } from '@/models';
import { markRaw } from 'vue';
import {
  ApprovePlasma,
  CreateNewStar,
  GetAllowance,
  GetAllStarData,
  GetBalance,
  GetCreationCost,
  NetworkAuth,
  RequiredPlasmaToApprove,
  SubscribeOnAccountChanging
} from '~/blockchain';
import { Coords, StarList } from '~/blockchain/types';

export class WalletService {
  account = '';
  connected = false;
  installed = false;
  currency = 'plasma';

  constructor() {
    this.init();
  }

  async init() {
    this.updateState(await SubscribeOnAccountChanging());
  }

  async connect() {
    return this.updateState(await NetworkAuth());
  }

  async approvePlasma(amount: number) {
    return this.checkConnection(() => ApprovePlasma(this.account, amount));
  }

  async createStar(name: string, coords: Coords) {
    const owner = this.account;
    const uri = `${document.location.hostname}`;
    const race = Star.getRandomRace();

    return this.checkConnection(() => CreateNewStar(owner, name, uri, race, coords), null);
  }

  async getAllowance() {
    return this.checkConnection(() => GetAllowance(this.account));
  }

  async getBalance() {
    return this.checkConnection(() => GetBalance(this.account), 0);
  }

  async getCreationCost(level = 1) {
    return this.checkConnection(() => GetCreationCost(level), 0);
  }

  async getStars(): Promise<StarList> {
    return this.checkConnection(() => GetAllStarData(), []);
  }

  async requiredPlasmaToApprove() {
    return this.checkConnection(() => RequiredPlasmaToApprove(this.account));
  }

  private async checkConnection<T extends (...args: unknown[]) => ReturnType<Awaited<T>>>(
    method: T,
    defaultValue?: Awaited<ReturnType<T>>
  ) {
    return (await this.connect()) ? method() : defaultValue;
  }

  private updateState(auth: string | null) {
    this.installed = auth !== null;

    if (!auth) {
      return false;
    }

    this.connected = true;
    this.account = auth;

    return true;
  }

  static VuePlugin = {
    install: app => {
      app.config.globalProperties.$wallet = markRaw(new WalletService());
    }
  };

  static StorePlugin = () => ({
    wallet: markRaw(new WalletService())
  });
}
