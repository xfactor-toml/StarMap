import 'pinia';
import { Client3DService, WalletService } from '@/services';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    client: Client3DService;
    wallet: WalletService;
  }
}
