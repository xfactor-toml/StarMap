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
  getComponent: () => DefineComponent<{}, {}, any> | null
};

type Scene<
  T extends string,
  K extends Mode[]
> = {
  name: T;
  modes: K;
  initialMode: K[number]['name'];
  getComponent: () => DefineComponent<{}, {}, any>
};

type StartScene = Scene<'start', [
  Mode<'preloader'>,
  Mode<'welcome'>
]>

type GalaxyScene = Scene<'galaxy', [
  Mode<'phantom', [
    ClientScene<'galaxy'>
  ]>,
  Mode<'real', [
    ClientScene<'galaxy'>,
    ClientScene<'star'>,
    ClientScene<'planet'>
  ]>,
  Mode<'season'>
]>

export type GuiScene = StartScene | GalaxyScene

export type GuiSceneName = GuiScene['name']

export type GuiMode = GuiScene['modes'][number]

export type GuiModeName = GuiMode['name']

export type GuiClientSceneView = GuiMode['clientScenes'][number]

export type GuiClientSceneName = GuiClientSceneView['name']
