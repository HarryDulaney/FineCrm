import * as dayjs from 'dayjs';
import { IContact } from 'app/entities/contact/contact.model';

export interface ISalesRep {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  generatedRevenue?: number | null;
  commissionOwed?: number | null;
  startDate?: dayjs.Dayjs | null;
  region?: string | null;
  contacts?: IContact[] | null;
}

export class SalesRep implements ISalesRep {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public generatedRevenue?: number | null,
    public commissionOwed?: number | null,
    public startDate?: dayjs.Dayjs | null,
    public region?: string | null,
    public contacts?: IContact[] | null
  ) {}
}

export function getSalesRepIdentifier(salesRep: ISalesRep): number | undefined {
  return salesRep.id;
}
