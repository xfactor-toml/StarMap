import { DefineComponent } from 'vue';

type ClientScene<T extends string = string> = {
  name: T;
  label: string;
  enabled: boolean;
  clickable: boolean;
};

type Mode<
  T extends string = string,
  K extends ClientScene[] = ClientScene[]
> = {
  name: T;
  label?: string;
  clientScenes?: K;
  enabled?: boolean;
  onEnter?: (el: HTMLElement) => Promise<void>
  beforeLeave?: (el: HTMLElement) => Promise<void>
  getComponent: () => DefineComponent<{}, {}, any> | null
};

type Scene<
  T extends string,
  K extends Mode[],
> = {
  name: T;
  modes: K;
  initialMode: K[number]['name'];
  afterLeave?: () => void
  getComponent: () => DefineComponent<{}, {}, any>
};

export enum UISceneNames {
  Start = 'start',
  Galaxy = 'galaxy',
  Battle = 'battle',
}

export type GuiScenes = {
  [UISceneNames.Start]: Scene<UISceneNames.Start, [
    Mode<'preloader'>,
    Mode<'welcome'>
  ]>
  [UISceneNames.Galaxy]: Scene<UISceneNames.Galaxy, [
    Mode<'phantom', [
      ClientScene<'galaxy'>
    ]>,
    Mode<'real', [
      ClientScene<'galaxy'>,
      ClientScene<'star'>,
      ClientScene<'planet'>
    ]>,
    Mode<'season'>
  ]>,
  [UISceneNames.Battle]: Scene<UISceneNames.Battle, [
    Mode<'init'>,
    Mode<'accept'>,
    Mode<'connect'>,
    Mode<'loading'>,
    Mode<'process'>,
    Mode<'results'>,
    Mode<'rewards'>,
    Mode<'coins'>
  ]>
}

export type GuiScene = GuiScenes[keyof GuiScenes]

export type GuiMode<T extends UISceneNames = UISceneNames> = GuiScenes[T]['modes'][number]

export type GuiModeName<T extends UISceneNames = UISceneNames> = GuiMode<T>['name']

export type GuiClientSceneView<T extends UISceneNames = UISceneNames> = GuiMode<T>['clientScenes'][number]

export type GuiClientSceneName<T extends UISceneNames = UISceneNames> = GuiClientSceneView<T>['name']
