import { Project } from './project.model';

export class Item {
  readonly id?: string;
  readonly created_date?: string;
  readonly modified_date?: string;
  readonly project: string | Project;
  parent?: string | Item;
  image: string | File;
  status: string;
  make: string;
  type: string;
  price: string;
  inspiration: string;
  lat: string;
  lng: string;
}