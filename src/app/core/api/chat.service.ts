import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import ApiHelpers from './api-helpers';
import { ChatMessage } from 'src/app/models/chat-message';
import AgoraRTM from 'agora-rtm-sdk';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Injectable()
export class ChatService {
    chatList: any = {};
    chatListChanged$: Observable<any>;
    callStatusChanged$: Observable<any>;
    private chatListChanged = new Subject<any>();
    private callStatusChanged = new Subject<any>();
    apiHelpers: ApiHelpers;
    client: any;
    status = 'OnLine';

    _invitation = null;
    _remoteInvitation = null;

    constructor(private httpClient: HttpClient) {
        console.log('chat constructor');
        this.apiHelpers = new ApiHelpers();

        this.chatListChanged$ = this.chatListChanged.asObservable();
        this.callStatusChanged$ = this.callStatusChanged.asObservable();

        this.client = AgoraRTM.createInstance(environment.agora.appId);
        // this.updateUserChats();
        // peer invitation
        this.peerInvitation();
    }

    async login(currentUserChatUid: string) {
        this.client.login({ token: null, uid: currentUserChatUid }).then(() => {
            console.log('AgoraRTM client login success');
            console.log(currentUserChatUid);

            this.subscribeRtmClientEvents();
        }).catch(err => {
            console.log('AgoraRTM client login failure', err);
        });
    }

    private subscribeRtmClientEvents() {
        this.client.on('MessageFromPeer', ({ text }, peerId) => {
            console.log(text);
            this.pushMessageToChat(peerId, text, peerId, false);
        });
    }

    sendMessage(text: string, myId: string, peerUid: string) {
        this.pushMessageToChat(peerUid, text, myId , true);
        this.pushMessageToServer(peerUid, text, myId);

        this.client.sendMessageToPeer(
            { text }, // An RtmMessage object.
            peerUid, // The user ID of the remote user.
        ).then(sendResult => {
            if (sendResult.hasPeerReceived) {
                /* Your code for handling the event that the remote user receives the message. */
            } else {
                /* Your code for handling the event that the message is received by the server but the remote user cannot be reached. */
            }
        }).catch(error => {
            /* Your code for handling the event of a message send failure. */
        });
    }

    queryPatientOnlineStatus(peerUid: string) {
        return this.client.queryPeersOnlineStatus([peerUid]);
    }

    private pushMessageToServer(peerUid: string, message: any, senderUid: string) {
        const stringDate = moment().format('YYYY-MM-DD hh:mm:ss');

        this.httpClient.get(`/graphql/secret?query=mutation{saveChatMessage(sender_id: "${senderUid}", receiver_id: "${peerUid}", message: "${encodeURIComponent(message)}", date: "${stringDate}"){success}}`).subscribe((response) => {
            console.log(response);
        });
    }

    private pushMessageToChat(peerUid: string, message: any, senderUid: string, fromMe: boolean) {
        if (this.chatList.hasOwnProperty(peerUid)) {
            this.chatList[peerUid].unshift(new ChatMessage().deserialize({message, senderId: senderUid, fromMe, date: Date.now()}));
        } else {
            this.chatList[peerUid] = [new ChatMessage().deserialize({ message, senderId: senderUid, fromMe, date: Date.now() })];
        }

        this.changeChatList(this.chatList);
    }

    private async getUserChats() {
        const response: any = await this.httpClient.get('/graphql/secret?query=query{userChats{first_user_id, second_user_id, messages{sender_id, message, is_file, file_url, seen, date}}}').toPromise();
        return response.data.userChats;
    }

    async updateUserChats(currentUserChatUid: string) {
        const serverChats = await this.getUserChats();

        if (serverChats.length > 0) {
            console.log(serverChats);

            for (const serverChat of serverChats) {
                const peerId = serverChat.first_user_id === currentUserChatUid
                    ? serverChat.second_user_id
                    : serverChat.first_user_id;

                this.chatList[peerId] = serverChat.messages.map((message: any) => {
                    message.fromMe = message.sender_id === currentUserChatUid;
                    return new ChatMessage().deserialize(message);
                });
            }

            this.changeChatList(this.chatList);
        }
    }

    private changeChatList(changedChatList: any) {
        this.chatList = changedChatList;
        this.chatListChanged.next(changedChatList);
    }

    logout() {
        this.client.logout();
    }

    /**
     * Call
     */

    localInvitation(calleeId, channel, userData) {
        if (this._invitation !== null) {
            this._invitation.removeAllListeners()
            this._invitation = null
        }

        // Create a local invitation
        this._invitation = this.client.createLocalInvitation(calleeId)

        // Local monitoring and inviting peers
        this._invitation.on('LocalInvitationReceivedByPeer', () => {
            console.log('Peers receive calls')
            // this.status = 'calling'
            this.changeCallStatus('calling');
            // this.eventBus.emit('LocalInvitationReceivedByPeer')
        })

        // Cancel call invitation
        this._invitation.on('LocalInvitationCanceled', () => {
            console.log('Cancel call invitation')
            // this.eventBus.emit('LocalInvitationCanceled')
        })

        // Called accepted call invitation
        this._invitation.on('LocalInvitationAccepted', () => {
            console.log('Peers accept invitations to call')
            this.changeCallStatus('meeting');
            // this.status = 'meeting'
            // this.eventBus.emit('LocalInvitationAccepted')
        })

        // Called down
        this._invitation.on('LocalInvitationRefused', () => {
            console.log('Peers refuse to call invitations')
            this.changeCallStatus('onLine');
            // this.status = 'onLine'
            // this.eventBus.emit('LocalInvitationRefused')
        })

        // Local call failed
        this._invitation.on('LocalInvitationFailure', () => {
            console.log('Call process failed')
            this.changeCallStatus('onLine');
            // this.status = 'onLine'
            // this.eventBus.emit('LocalInvitationFailure')
        })

        this._invitation.channelId = channel
        this._invitation.content = userData;

        console.log(this._invitation);

        // Send call invitation locally
        this._invitation.send()
    }

    peerInvitation() {
        // Remote monitor receives call invitation
        this.client.on('RemoteInvitationReceived', (remoteInvitation) => {
            console.log('Receive call invitation', remoteInvitation.callerId)
            console.log('remoteInvitation', remoteInvitation)

            // if (this.status !== 'onLine') {
            //     setTimeout(() => {
            //         remoteInvitation.refuse()
            //     }, 1000)
            //     return
            // }

            if (this._remoteInvitation !== null) {
                this._remoteInvitation.removeAllListeners()
                this._remoteInvitation = null
            }
            // this.status = 'calling'
            this._remoteInvitation = remoteInvitation
            this.peerEvents()
            // this.eventBus.emit('RemoteInvitationReceived', remoteInvitation)
        })
    }

    peerEvents() {
        // The caller has cancelled the call invitation
        this._remoteInvitation.on('RemoteInvitationCanceled', () => {
            console.log('The call invitation was cancelled')
            // this.status = 'onLine'
            this.changeCallStatus('onLine');
            // this.eventBus.emit('RemoteInvitationCanceled')
        })

        // Accepted call invitation successfully
        this._remoteInvitation.on('RemoteInvitationAccepted', () => {
            console.log('Peers receive calls')
            // this.eventBus.emit('RemoteInvitationAccepted')
        })

        // Call invitation rejected successfully
        this._remoteInvitation.on('RemoteInvitationRefused', () => {
            console.log('The call invitation has been declined')
            // this.eventBus.emit('RemoteInvitationRefused')
        })

        // Call invitation process failed
        this._remoteInvitation.on('RemoteInvitationFailure', () => {
            console.log('Peer call process failed')
            this.changeCallStatus('onLine');
            // this.status = 'onLine'
            // this.eventBus.emit('RemoteInvitationFailure')
        })
    }

    // Cancel call invitation
    cancelCall() {
        if (this.status !== 'meeting') {
            if (this._invitation) this._invitation.cancel();
            // this.status = 'onLine'
            this.changeCallStatus('onLine');
        }
    }

    endCall() {
        this.changeCallStatus('onLine');
    }

    // Accept call invitation
    acceptCall() {
        if (this._remoteInvitation) this._remoteInvitation.accept();
        // this.status = 'meeting'
        this.changeCallStatus('meeting');
    }

    // Decline call invitation
    refuseCall() {
        if (this._remoteInvitation) this._remoteInvitation.refuse();
        // this.status = 'onLine'
        this.changeCallStatus('onLine');
    }

    private changeCallStatus(changedStatus: any) {
        this.status = changedStatus;
        this.callStatusChanged.next(changedStatus);
    }
}