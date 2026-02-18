
export interface Track {
  id: string;
  title: string;
  artist: string;
  price: number;
  coverUrl: string;
  audioUrl: string;
  genre: string;
  description?: string;
  itemType?: 'track' | 'sample-pack';
}

export interface CartItem extends Track {
  quantity: number;
}

export enum AppRoute {
  HOME = 'home',
  STORE = 'store',
  CREATIVE_SUITE = 'creative-suite',
  CART = 'cart'
}
