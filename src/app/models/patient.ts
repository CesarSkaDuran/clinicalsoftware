import { Deserializable } from './deserealizable';
import { RecordModel } from '../models/recordModel';

export class Patient implements Deserializable {
  id: number;
  identification: string;
  name: string;
  email: string;
  civil_status: string;
  position: string;
  birth_date: string;
  phone?: string;
  company: string;
  partner_name: string;
  partner_profession: string;
  profile_url: any;
  records: RecordModel;
  fecha:number;
  address:string;
  eps:number;
  sex:string;
  imagen:string;
  grupo_sanguineo: string;
  arl:string;
  pension:string;
  TipoDocumento:string;
  birthdayNotification?: string;
  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}