import { Project } from './project.model';

export class Detail {
  readonly id?: string;
  readonly created_date?: string;
  readonly modified_date?: string;
  readonly project: string | Project;
  parent?: string | Detail;
  image: string | File;
  status: string;
  type: string;
}