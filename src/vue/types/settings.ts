import { DefineComponent } from 'vue';

export type GuiScreenName = 'preloader' | 'welcome' | 'galaxy';

export type GuiModeName = 'phantom' | 'real' | 'season';

export type ClientViewName = 'galaxy' | 'star' | 'planet';

export type ClientView = {
  name: ClientViewName;
  label: string;
  enabled: boolean;
  clickable: boolean;
};

export type GuiMode<T extends GuiModeName = GuiModeName> = {
  name: T;
  label: string;
  views: ClientView[];
  enabled: boolean;
  getComponent: () => DefineComponent<{}, {}, any> | null
};

export type GuiScreen<T extends GuiScreenName = GuiScreenName> = {
  name: T;
  modes?: GuiMode[];
  defaultMode?: GuiModeName;
  getComponent: () => DefineComponent<{}, {}, any>
};

export type GuiLevel = {
  value: number;
  label: string;
};

export type StarBoostPanelType = 'energy' | 'exp';

export type BattleState = 'initial' | 'searching';
