export interface AppState {
  themeColor: string;
  colorpicker: string;
  colors: { [s: string]: string };
  user: firebase.User | null;
  cards: Cards[]
}

export interface Cards {
  id: string;
  index: number;
  cardName: string;
  memos: { value: string }[];
}
