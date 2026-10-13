import { Deserializable } from './deserealizable';


export class RecordModel implements Deserializable {
    
    id: number;
    identification: string;
    created_at: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}