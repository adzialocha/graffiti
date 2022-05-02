export type Points = number[][];

export type Selector = string;

export type VariantSpray = {
  mode: 'spray';
};

export type VariantMusic = {
  mode: 'music';
};

export type GraffitiBase = {
  id: Identifier;
  version: string;
  author: string;
  selector: Selector;
  path: Points;
};

type GraffitiVariants = VariantSpray | VariantMusic;

export type Graffiti = GraffitiBase & GraffitiTransform & GraffitiVariants;

export type Identifier = string;

export type Url = string;

// Popup Messages

export type PopupMessage = PopupState | PopupOpen;

export type PopupState = {
  type: 'popup/state';
  edit: boolean;
};

export type PopupOpen = {
  type: 'popup/open';
};

// Background Messages

export type BackgroundMessage = BackgroundState;

export type State = {
  edit: boolean;
  ready: boolean;
};

export type BackgroundState = {
  type: 'background/state';
} & State;

// Content Script Messages

export type ContentScriptMessage = Save;

export type Save = {
  type: 'content-script/save';
  selector: Selector;
  path: Points;
};
