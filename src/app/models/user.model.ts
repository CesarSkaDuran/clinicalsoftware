import { Deserializable } from './deserealizable';
import { Doctor } from './doctor';

export class User implements Deserializable {
  id: number;
  name: string;
  last_name: string;
  chat_id: string;
  doctor: Doctor;

  fullName() {
    return `${this.name} ${this.last_name != null ? this.last_name : ''}`;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
