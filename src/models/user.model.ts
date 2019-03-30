export class User {
  readonly id?: string;
  readonly joined_date?: string;
  readonly is_staff?: boolean;
  readonly username: string;
  email: string;
  first_name: string;
  last_name: string;
  image?: string | File;
  city?: string;
  state?: string;
  key?: string;

  getShortName() {
    return `${this.first_name} ${this.last_name[0]}`;
  }
  
  getFullName() {
    return `${this.first_name} ${this.last_name}`;
  }
}