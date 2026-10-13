import { Component, OnInit, Input, Output, AfterViewInit, OnDestroy, AfterContentInit } from '@angular/core';
import { EventEmitter } from '@angular/core';

import icCall from '@iconify/icons-ic/videocam';
import icSend from '@iconify/icons-ic/send';
import icAttach from '@iconify/icons-ic/attach-file';
import icClose from '@iconify/icons-ic/close';
import icMic from '@iconify/icons-ic/mic';
import icEnd from '@iconify/icons-ic/call-end';
import icExpand from '@iconify/icons-ic/fullscreen';
import icExpandExit from '@iconify/icons-ic/fullscreen-exit';
import icFlipCamera from '@iconify/icons-ic/baseline-flip-camera-android';
import { ChatMessage } from '../../models/chat-message';
import { ChatService } from 'src/app/core/api/chat.service';
import { Subscription } from 'rxjs';
import { CoreService } from 'src/app/core/core.service';
import { AgoraClient, ClientEvent, NgxAgoraService, Stream, StreamEvent } from 'ngx-agora';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html'
})
export class ChatBoxComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
    @Input() selectedUser;
    @Output() closeBtnPressed = new EventEmitter();
    @Output() expandedBtnPressed = new EventEmitter();
    chatListChagedListener: Subscription;
    callStatusChangeListener: Subscription;
    messages: ChatMessage[];
    messageImput = '';
    calling = false;
    meeting = false;
    expanded = false;
    isOnline = false;

    icCall = icCall;
    icSend = icSend;
    icAttach = icAttach;
    icClose = icClose;
    icMic = icMic;
    icEnd = icEnd;
    icExpand = icExpand;
    icExpandExit = icExpandExit;
    icFlipCamera = icFlipCamera;
    onChannel = false;

    remoteCalls: string[] = [];
    localCallId = null;
    connectCameraTries = 0;

    private client: AgoraClient;
    private localStream: Stream;
    private uid: number;

    constructor(private chatService: ChatService, private coreService: CoreService, private ngxAgoraService: NgxAgoraService) {
        // peer invitation
        this.uid = Math.floor(Math.random() * 100);
    }

    ngOnInit(): void {
        console.log(this.selectedUser);
        if (this.selectedUser) {
            this.messages = this.chatService.chatList[this.selectedUser.chat_id];
        }

        if (this.selectedUser.chat_id != null) {
            this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
            this.assignClientHandlers();

            // Added in this step to initialize the local A/V stream
            this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
            this.assignLocalStreamHandlers();
        }

    }

    ngAfterViewInit(): void {
        if (this.selectedUser.chat_id != null) {
            this.chatListChagedListener = this.chatService.chatListChanged$.subscribe((changedChatList: any[]) => {
                console.log('chatMessages changed');
                console.log(changedChatList);

                if (changedChatList[this.selectedUser.chat_id]) {
                    this.messages = changedChatList[this.selectedUser.chat_id];
                }
            });

            this.callStatusChangeListener = this.chatService.callStatusChanged$.subscribe((changedCallStatus: any) => {
                console.log('chatMessages changed');
                console.log(changedCallStatus);

                if (changedCallStatus === 'onLine') {
                    if(this.calling) {
                        this.calling = !this.calling;
                        if (this.expanded) {
                            this._toggleExpanded();
                        }
                        this.leave();
                        if (this.localStream.isPlaying) {
                            this.localStream.stop();
                            this.localStream.close();
                            console.log('close and stop');
                        }
                    }
                }

                if (changedCallStatus === 'calling') {
                    if (!this.calling) {
                        this.calling = !this.calling;
                    }
                }

                if (changedCallStatus === 'meeting') {
                    this.meeting = true;

                    this.connectCameraTries = 0;
                    this.startCall();

                    if (!this.expanded) {
                        this._toggleExpanded();
                    }
                }
            });

            setTimeout(() => {
                this.updatePatientOnlineStatus();

                setInterval(() => {
                    this.updatePatientOnlineStatus();
                }, 12000)
            }, 2500);
        }

    }

    ngAfterContentInit(): void {
        if (this.coreService.currentUser) {
            this.localCallId = `${this.selectedUser.chat_id}`;
            // this.localCallId = `${this.coreService.currentUser.chat_id}-${this.selectedUser.chat_id}`;
        }
    }

    updatePatientOnlineStatus() {
        this.chatService.queryPatientOnlineStatus(this.selectedUser.chat_id).then((response) => {
            if (response) {
                this.isOnline = response[this.selectedUser.chat_id];
            }
        });
    }

    onClosePressed() {
        this.closeBtnPressed.emit(null);
    }

    ngOnDestroy(): void {
        if (this.chatListChagedListener) {
            this.chatListChagedListener.unsubscribe();
        }

        if (this.localStream && this.localStream.isPlaying) {
            this.localStream.stop();
            this.localStream.close();
        }
    }

    sendMessage() {
        this.chatService.sendMessage(this.messageImput, this.coreService.currentUser.chat_id, this.selectedUser.chat_id);
        this.messageImput = '';
    }

    onCallPressed() {
        this.chatService.localInvitation(this.selectedUser.chat_id,
            this.localCallId,
            `${this.coreService.currentUser?.doctor?.name};${this.coreService.currentUser?.doctor?.avatar_url}`);
        // this.calling = !this.calling;
    }

    onEndCallPressed() {
        console.log('end call');
        try {
            this.chatService.endCall();
        } catch (error) {
            console.log(error);
        }
    }

    onCancellCallPressed() {
        console.log('cancel call');
        try {
            this.chatService.cancelCall();
        } catch (error) {
            console.log(error);
        }
    }

    onExpandedPressed() {
        this._toggleExpanded();
    }

    _toggleExpanded() {
        this.expanded = !this.expanded;
        this.expandedBtnPressed.emit(this.expanded);
    }

    // Call functions
    /**
     * Attempts to connect to an online chat room where users can host and receive A/V streams.
     */
    join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
        if (!this.onChannel) {
            console.log('LOG STATUS: connecting to channel')
            this.client.join(null, this.localCallId, this.uid, onSuccess, onFailure);
        } else {
            console.log('LOG STATUS: already in channel')
        }
    }

    /**
     * Attempts to upload the created local A/V stream to a joined chat room.
     */
    publish(): void {
        this.client.publish(this.localStream, err => console.log('Publish local stream error: ' + err));
    }

    private assignLocalStreamHandlers(): void {
        this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
            console.log('accessAllowed');
        });

        // The user has denied access to the camera and mic.
        this.localStream.on(StreamEvent.MediaAccessDenied, () => {
            console.log('accessDenied');
        });
    }

    private initLocalStream(onSuccess?: () => any): void {
        this.localStream.init(
            () => {
                // The user has granted access to the camera and mic.
                this.localStream.play(this.localCallId);
                if (onSuccess) {
                    onSuccess();
                }
            },
            (err) => {
                console.error('getUserMedia failed', err);
                // if (this.connectCameraTries < 3) {
                //     setTimeout(() => {
                //         this.startCall();
                //         this.connectCameraTries += 1;
                //         console.log(`try to load media. try: ${this.connectCameraTries}`);
                //     }, 1000)
                // }
            }
        );
    }

    startCall() {
        this.initLocalStream(() => this.join(uid => {
            if (!this.onChannel) {
                this.onChannel = true;
                this.publish();
            }
        }, (error) => {
            console.log('call error');

            console.error(error);
        }));
    }

    private assignClientHandlers(): void {
        this.client.on(ClientEvent.LocalStreamPublished, evt => {
            console.log('Publish local stream successfully');
        });

        this.client.on(ClientEvent.Error, error => {
            console.log('Got error msg:', error.reason);
            if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
                this.client.renewChannelKey(
                    '',
                    () => console.log('Renewed the channel key successfully.'),
                    renewError => console.error('Renew channel key failed: ', renewError)
                );
            }
        });

        this.client.on(ClientEvent.RemoteStreamAdded, evt => {
            const stream = evt.stream as Stream;
            this.client.subscribe(stream, { audio: true, video: true }, err => {
                console.log('Subscribe stream failed', err);
            });
        });

        this.client.on(ClientEvent.RemoteStreamSubscribed, evt => {
            const stream = evt.stream as Stream;
            const id = this.getRemoteId(stream);
            if (!this.remoteCalls.length) {
                this.remoteCalls.push(id);
                setTimeout(() => stream.play(id), 1000);
            }
        });

        this.client.on(ClientEvent.RemoteStreamRemoved, evt => {
            const stream = evt.stream as Stream;
            if (stream) {
                stream.stop();
                this.remoteCalls = [];
                console.log(`Remote stream is removed ${stream.getId()}`);
            }
        });

        this.client.on(ClientEvent.PeerLeave, evt => {
            const stream = evt.stream as Stream;
            if (stream) {
                stream.stop();
                this.remoteCalls = this.remoteCalls.filter(call => call !== `${this.getRemoteId(stream)}`);
                console.log(`${evt.uid} left from this channel`);
            }
            this.onEndCallPressed();
        });
    }

    private getRemoteId(stream: Stream): string {
        return `agora_remote-${stream.getId()}`;
    }

    leave() {
        this.client.leave(() => {
            console.log('Leavel channel successfully');
            this.onChannel = false;
        }, (err) => {
            console.log('Leave channel failed');
        });
    }
}
