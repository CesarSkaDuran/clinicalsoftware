import { Deserializable } from './deserealizable';
import { Doctor } from './doctor';

export class Appointment implements Deserializable {
    id: number;
    name: String;
    company: String;
    value: string;
    phone_confirmation: string;
    email_confirmation: string;
    time: string;
    end_time: string;
    type: number;
    date: String;
    reason:string;
    doctor:Doctor;
    data: any[] = [];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}