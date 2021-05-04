import * as dayjs from 'dayjs';
import { IContact } from 'app/entities/contact/contact.model';

export interface IPersona {
  id?: number;
  name?: string;
  profile?: dayjs.Dayjs | null;
  contact?: IContact | null;
}

export class Persona implements IPersona {
  constructor(public id?: number, public name?: string, public profile?: dayjs.Dayjs | null, public contact?: IContact | null) {}
}

export function getPersonaIdentifier(persona: IPersona): number | undefined {
  return persona.id;
}
