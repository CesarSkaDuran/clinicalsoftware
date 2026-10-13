import { Deserializable } from './deserealizable';
import * as moment from 'moment';

export class ChatMessage implements Deserializable {
    id: number;
    message: string;
    senderId: string;
    fromMe: boolean;
    isFile: boolean;
    fileUrl?: string;
    hasBeenReaded: boolean;
    date: Date;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

    get dateAsTime() : string {
        return moment(this.date).format('HH:mm A');
    }
}