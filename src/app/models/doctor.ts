import { Deserializable } from './deserealizable';
import { Appointment } from './appointment';

export class Doctor implements Deserializable {
    id: number;
    name: string;
    user_id:number;
    institution_id:number;
    office_id:number;
    specialization: string;
    address:string;
    phone:string;
    experience:string;
    avatar_url:string;
    consultation_price: string;
    in_place_price:string;
    virtual_price:string;
    informed_consent_link:string;
    bio:string;
    chat_id: string;
    status:number;
    profile_url: any;
    appointment:Appointment;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}