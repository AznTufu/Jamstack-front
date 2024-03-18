import type {Competition} from "~/models/competition.model";
import type {Image} from "~/models/strapi.model";

export interface Player {
  id: number
  name: string
  ranking: number
  first_name: string
  last_name: string
  created_at: Date
  updated_at: Date
  competitions: Competition[],
  image: Image
}
