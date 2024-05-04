import { Star } from "@/models";
import { BaseProvider } from "@/services/wallet/providers/base-provider";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/vue";
import { ethers } from "ethers";
import { Ref, ref } from "vue";
import { contracts } from "~/blockchainTotal/config/network";
import { Coords, fuelTarget } from "~/blockchainTotal/types";
import { ConnectWalletWC } from "~/blockchainTotal/walletconnect/auth";
import {
  ApproveFor,
  CreateNewStarWC,
  IncreaseStarLevel,
  MintToken,
  OpenBox,
  RefuelStar,
} from "~/blockchainTotal/walletconnect/methods";

export class WalletConnectProvider extends BaseProvider {
  account = ref('');
  isConnected = ref(false);
  walletProvider: Ref<ethers.providers.ExternalProvider>

  async connect() {
    if (this.isConnected.value) {
      return this.account
    }

    this.account = await ConnectWalletWC()

    const { walletProvider } = useWeb3ModalProvider()
    const { isConnected } = useWeb3ModalAccount()

    this.walletProvider = walletProvider
    this.isConnected = isConnected

    return this.account
  }

  async approvePlasma(amount: number) {
    return this.checkConnection(() => ApproveFor({
      walletProvider: this.walletProvider.value,
      user: this.account.value,
      amount,
      token: contracts.plasma,
      spender: contracts.starNFT,
    }));
  }

  async createStar(name: string, coords: Coords) {
    const owner = this.account.value;
    const uri = `${document.location.hostname}`;
    const race = Star.getRandomRace();

    await this.checkConnection(() => CreateNewStarWC({
      walletProvider: this.walletProvider.value,
      owner,
      name,
      uri,
      race,
      coords
    }), null);

    const starsCount = await this.getStarsCount()

    return  this.getStarById(starsCount - 1)
  }

  async refuelStar(starId: number, amount: number, target: fuelTarget) {
    await this.checkConnection(() => RefuelStar({
      walletProvider: this.walletProvider.value,
      user: this.account.value,
      starId,
      amount,
      target
    }), null);

    return this.getStarById(starId)
  }

  async refuelStarLevelUp(starId: number, amount: number) {
    return this.refuelStar(starId, amount, 'levelup');
  }

  async refuelStarExistence(starId: number, amount: number) {
    return this.refuelStar(starId, amount, 'existence');
  }

  async increaseStarLevel(starId: number) {
    await this.checkConnection(() => IncreaseStarLevel(this.walletProvider.value, starId), null);
    return this.getStarById(starId)
  }

  async mintPlasma(amount: number): Promise<any> {
    return MintToken({
      walletProvider: this.walletProvider.value,
      user: this.account.value,
      amount,
      token: contracts.plasma
    });
  }

  async openBox(boxId: number) {
    try {
      await OpenBox(this.walletProvider.value, boxId);

      return true
    } catch (error) {
      console.error(error);
      return false
    }
  }
  
}
