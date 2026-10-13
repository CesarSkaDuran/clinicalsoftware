import { Deserializable } from './deserealizable';
import { empresa } from '../models/empresa';

export class cuentaCobro implements Deserializable {
    id: number;
    id_afiliacion: number;
    nombre: string;
    valor: string;
    iva: number;
    status: number;
    empresaCuenta: empresa;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}