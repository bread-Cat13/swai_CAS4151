import type { Location } from "./database";

export interface BoardData {
  location: Location;
  itemCount: number;
  lastUpdated: string;
}
