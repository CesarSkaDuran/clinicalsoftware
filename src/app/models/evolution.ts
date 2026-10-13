import { Deserializable } from './deserealizable';

export class Evolution implements Deserializable {
    id: number;
    details: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}