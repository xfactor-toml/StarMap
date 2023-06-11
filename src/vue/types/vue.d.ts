import { Client3DService, WalletService } from '@/services';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $client: Client3DService;
    $wallet: WalletService;
  }
}
