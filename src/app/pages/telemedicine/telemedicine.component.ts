import { Component, OnInit } from '@angular/core';
import icMore from '@iconify/icons-ic/twotone-more-horiz';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icRemove from '@iconify/icons-ic/cancel';
import icCamera from '@iconify/icons-ic/portrait';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { NgxAgoraService, AgoraClient, ClientEvent, Stream, StreamEvent } from 'ngx-agora';
import icClose from '@iconify/icons-ic/close';
import { ApiService } from 'src/app/core/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentModalComponent } from 'src/app/modals/appointmentModal/appointment-modal.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-telemedicine',
    templateUrl: './telemedicine.component.html',
    styleUrls: ['./telemedicine.component.scss'],
    animations: [
        stagger80ms,
        scaleIn400ms,
        fadeInRight400ms,
        fadeInUp400ms
    ]
})
export class TelemedicineComponent implements OnInit {
    displayedColumns: string[] = ['status', 'patient', 'phone', 'date', 'time', 'service', 'doctor', 'options'];
    data: any[] = [];

    searchText = '';
    loadingRecords = false;
    totalIncome: 0;

    icMore = icMore;
    icEdit = icEdit;
    icRemove = icRemove;
    icCamera = icCamera;
    icClose = icClose;

    alertIsVisible = true;

    patientsModalIsOpen = false;

    resultsLength = 0;
    pageSize = 10;
    pageSizeOptions: number[] = [5, 10, 20, 50];
    orderBy = 'created_at';
    order = 'desc';
    limit = 10;
    offset = 0;

    localCallId = 'clinicalsoftware';
    title = 'angular-video-call';
    remoteCalls: string[] = [];

    private client: AgoraClient;
    private localStream: Stream;
    private uid: number;

    // shortcuts: ShortcutInput[] = [];

    constructor(
        public dialog: MatDialog,
        private ngxAgoraService: NgxAgoraService,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        private router: Router,
    ) {
        this.uid = Math.floor(Math.random() * 100);
    }

    ngOnInit() {
        this.loadRecords();
        this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
        this.assignClientHandlers();

        // Added in this step to initialize the local A/V stream
        this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
        this.assignLocalStreamHandlers();
    }

    /**
     * Attempts to connect to an online chat room where users can host and receive A/V streams.
     */
    join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
        this.client.join(null, 'clinicalsoftware', this.uid, onSuccess, onFailure);
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
            err => console.error('getUserMedia failed', err)
        );
    }

    dateChange(event: any) {
        this.loadRecords();
    }

    sortRecords(event: MatSort): void {
        this.orderBy = event.active;
        this.order = event.direction;

        // this.loadRecords();
    }

    loadRecords() {
        console.log('loading records...');

        this.loadingRecords = true;
        // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        // const queryParams = `search:""`;
        const queryParams = `limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}"`;
        const queryProps =
            'data{id, name, company, value, date, time, end_time, phone_confirmation, email_confirmation, reason, payment_type, status, doctor{name}, patient{identification, records{id,identification, patient{id, name, identification, civil_status, position, birth_date, address, phone, company, profile_url, partner_name, partner_profession, chat_id}, details{id, motive}, conclusion{id, diagnosis}, created_at}}}, total';

        this.apiService.getAppointmentsPagination(queryParams, queryProps).subscribe(
            (response: any) => {
                this.data = response.data.appointmentsPagination.data;
                this.resultsLength = response.data.appointmentsPagination.total;
                this.loadingRecords = false;
            },
            error => {
                this.loadingRecords = false;
                this._snackBar.open('Error.', null, {
                    duration: 4000
                });
                console.log(error);
            }
        );
    }

    pageChange(event: PageEvent) {
        this.limit = event.pageSize;
        this.offset = event.pageSize * event.pageIndex;
        this.loadRecords();
    }

    getStatusLabel(status) {
        switch (status) {
            case 1:
                return 'Agendada';
            case 2:
                return 'Por confirmar';
            case 3:
                return 'Finalizada';
            case 4:
                return 'Cancelada';
            default:
                break;
        }
    }

    openAppointmentModal(appointment: any = null) {
        const dialogRef = this.dialog.open(AppointmentModalComponent, {
            width: '680px',
            height: '520px',
            maxHeight: '850px',
            data: {
                appointment
            }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) return;

            this.loadRecords();
        });
    }

    goToRecord(appointment: any) {
        this.apiService.setRecord(appointment.patient.records[0]);
        this.router.navigate(['/app/records/view', appointment.patient.records[0].identification]);

    }

    startCall() {
        this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));
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
        });
    }

    private getRemoteId(stream: Stream): string {
        return `agora_remote-${stream.getId()}`;
    }
}
