import { BaseProvider } from "./base-provider";
import { ref } from "vue";

export class ReaderProvider extends BaseProvider {
  account = ref('');

  async connect() {
    return ref('')
  }

  async approvePlasma() {}
  async createStar() {}
  async refuelStar() {}
  async refuelStarLevelUp() {}
  async refuelStarExistence() {}
  async increaseStarLevel() {}
  async mintPlasma() {}
}
