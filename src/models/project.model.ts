import { User } from "./user.model";

export class Project {
  readonly id?: string;
  readonly created_date?: string;
  readonly modified_date?: string;
  readonly start_date?: string;
  readonly end_date?: string;
  readonly client?: string | User;
  readonly designer?: string | User;
  readonly room: string;
  status: string;
  readonly shared_with: string;
  readonly budget: string;
  readonly pet_friendly: boolean;
  readonly limited_access: boolean;
  readonly style: string;
  readonly zipcode: number;
  designer_note: string;
  final_note: string;
  revision_count: string;
}

export enum ProjectStatus {
  DETAILS = 'DETAILS',
  DESIGN = 'DESIGN',
  CONCEPTS = 'CONCEPTS',
  FLOOR_PLAN = 'FLOOR_PLAN',
  REQUEST_ALTERNATIVES = 'REQUEST_ALTERNATIVES',
  ALTERNATIVES_READY = 'ALTERNATIVES_READY',
  FINAL_DELIVERY = 'FINAL_DELIVERY',
  SHOPPING_CART = 'SHOPPING_CART',
  ESTIMATE_SHIPPING_AND_TAX = 'ESTIMATE_SHIPPING_AND_TAX',
  CHECKOUT = 'CHECKOUT',
  ARCHIVED = 'ARCHIVED',
}
