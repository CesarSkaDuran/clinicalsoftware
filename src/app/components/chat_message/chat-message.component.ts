import { Component, OnInit, Input } from '@angular/core';
import { ChatMessage } from '../../models/chat-message';

@Component({
    selector: 'app-chat-message',
    template: `
        <div class="chat-bubble" [ngClass]="{'from-me': message.fromMe}">
            <span class="message">{{message.message}}</span>
            <span class="time">{{message.dateAsTime}}</span>
        </div>
    `,
})
export class ChatMessageComponent {
    @Input() message: ChatMessage;

    constructor() { }
}
