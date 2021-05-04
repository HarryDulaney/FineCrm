import { IContact } from 'app/entities/contact/contact.model';

export interface IContactCategory {
  id?: number;
  categoryName?: string;
  contact?: IContact | null;
}

export class ContactCategory implements IContactCategory {
  constructor(public id?: number, public categoryName?: string, public contact?: IContact | null) {}
}

export function getContactCategoryIdentifier(contactCategory: IContactCategory): number | undefined {
  return contactCategory.id;
}
