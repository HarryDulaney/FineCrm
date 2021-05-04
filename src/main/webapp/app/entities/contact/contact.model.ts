import * as dayjs from 'dayjs';
import { IContactCategory } from 'app/entities/contact-category/contact-category.model';
import { IPersona } from 'app/entities/persona/persona.model';
import { ISalesRep } from 'app/entities/sales-rep/sales-rep.model';
import { ICompany } from 'app/entities/company/company.model';
import { Language } from 'app/entities/enumerations/language.model';

export interface IContact {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string | null;
  linkedInProfile?: string | null;
  mailingAddress?: string | null;
  connectDate?: dayjs.Dayjs | null;
  jobTitle?: string | null;
  language?: Language | null;
  vip?: boolean | null;
  affiliate?: boolean | null;
  zipCode?: number | null;
  contactCategory?: IContactCategory | null;
  persona?: IPersona | null;
  salesRep?: ISalesRep | null;
  company?: ICompany | null;
}

export class Contact implements IContact {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public phoneNumber?: string | null,
    public linkedInProfile?: string | null,
    public mailingAddress?: string | null,
    public connectDate?: dayjs.Dayjs | null,
    public jobTitle?: string | null,
    public language?: Language | null,
    public vip?: boolean | null,
    public affiliate?: boolean | null,
    public zipCode?: number | null,
    public contactCategory?: IContactCategory | null,
    public persona?: IPersona | null,
    public salesRep?: ISalesRep | null,
    public company?: ICompany | null
  ) {
    this.vip = this.vip ?? false;
    this.affiliate = this.affiliate ?? false;
  }
}

export function getContactIdentifier(contact: IContact): number | undefined {
  return contact.id;
}
