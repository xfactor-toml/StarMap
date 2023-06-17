import { ClientService, WalletService } from '@/services';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $client: ClientService;
    $wallet: WalletService;
  }
}
