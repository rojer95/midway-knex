import { Table } from "../../../../../src";

@Table("Book")
export class Book {
  id?: number;
  title?: string;
  foo?: string;
  created_at?: Date;
  updated_at?: Date;
}
