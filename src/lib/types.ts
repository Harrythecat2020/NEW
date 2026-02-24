export type Place = {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  image?: string;
  source?: string;
  type?: string;
};

export type Country = {
  iso2: string;
  name: string;
  lat: number;
  lng: number;
};

export type CachedCountry = {
  updatedAt: number;
  places: Place[];
};
