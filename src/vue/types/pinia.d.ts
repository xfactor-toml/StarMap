import 'pinia';
import { Client3DService } from '@/services';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    client: Client3DService;
  }
}
