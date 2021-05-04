import { IContact } from 'app/entities/contact/contact.model';

export interface ICompany {
  id?: number;
  companyName?: string;
  address?: string | null;
  primaryContact?: string | null;
  contacts?: IContact[] | null;
}

export class Company implements ICompany {
  constructor(
    public id?: number,
    public companyName?: string,
    public address?: string | null,
    public primaryContact?: string | null,
    public contacts?: IContact[] | null
  ) {}
}

export function getCompanyIdentifier(company: ICompany): number | undefined {
  return company.id;
}
