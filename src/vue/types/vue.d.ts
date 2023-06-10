import { Client3DService } from '@/services';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $client: Client3DService;
  }
}
