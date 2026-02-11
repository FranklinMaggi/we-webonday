export type CardVariant =
  | "solution"
  | "preset"
  | "product"
  | "template";

export type CardAction = {
  label: string;
  onClick?: () => void;
};

export type CardModel = {
  id: string;

  title: string;
  description?: string;

  image?: string;

  selected?: boolean;

  action?: CardAction;
};
