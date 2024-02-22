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

export enum SceneName {
  Start = 'start',
  Galaxy = 'galaxy',
  Battle = 'battle',
}

export type GuiScenes = {
  [SceneName.Start]: Scene<SceneName.Start, [
    Mode<'preloader'>,
    Mode<'welcome'>
  ]>
  [SceneName.Galaxy]: Scene<SceneName.Galaxy, [
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
  [SceneName.Battle]: Scene<SceneName.Battle, [
    Mode<'init'>,
    Mode<'accept'>,
    Mode<'connect'>,
    Mode<'loading'>,
    Mode<'process'>,
    Mode<'results'>,
    Mode<'rewards'>
  ]>
}

export type GuiScene = GuiScenes[keyof GuiScenes]

export type GuiMode<T extends SceneName = SceneName> = GuiScenes[T]['modes'][number]

export type GuiModeName<T extends SceneName = SceneName> = GuiMode<T>['name']

export type GuiClientSceneView<T extends SceneName = SceneName> = GuiMode<T>['clientScenes'][number]

export type GuiClientSceneName<T extends SceneName = SceneName> = GuiClientSceneView<T>['name']
