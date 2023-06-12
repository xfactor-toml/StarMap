import 'pinia';
import { ClientService, WalletService } from '@/services';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    client: ClientService;
    wallet: WalletService;
  }
}
