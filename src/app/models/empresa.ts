import { Deserializable } from './deserealizable';

export class empresa implements Deserializable {
   
    id: number;
    afiliacion_id: number;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}