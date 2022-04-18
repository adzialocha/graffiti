export type VariantImage = {
  type: 'image';
  arguments: {
    imagePath: string;
    link?: string;
  };
};

export type VariantText = {
  type: 'text';
  arguments: {
    link?: string;
  };
};

export type GraffitiTransform = {
  transform: {
    rotation: number;
  };
};

export type GraffitiBase = {
  id: Identifier;
  version: string;
  author: string;
  target: string[];
};

type GraffitiVariants = VariantImage | VariantText;

export type Graffiti = GraffitiBase & GraffitiTransform & GraffitiVariants;

export type Identifier = string;

export type Url = string;

export type PopupMessage = PopupState | PopupOpen;

export type PopupState = {
  type: 'popup/state';
  edit: boolean;
};

export type PopupOpen = {
  type: 'popup/open';
};

export type BackgroundMessage = BackgroundState;

export type State = {
  edit: boolean;
  ready: boolean;
};

export type BackgroundState = {
  type: 'background/state';
} & State;

export type ContentScriptMessage = Test;

// @TODO
export type Test = {
  type: 'content-script/test';
};
