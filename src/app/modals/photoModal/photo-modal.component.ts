import { Component, OnInit, Inject, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Subject, Observable } from 'rxjs';


moment.locale('es');

@Component({
    selector: 'app-photo-modal',
    templateUrl: './photo-modal.component.html'
})
export class PhotoModalComponent implements OnInit {
    @Output()
    
    patient = new FormGroup({
        id: new FormControl('', []),
        imagen: new FormControl('', []),
    });
    sending= false;
    currentPatientPicture: string;
    showOnlyName= false;
    editing= false;
    constructor(
        public dialogRef: MatDialogRef<PhotoModalComponent>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService
    ) { }
    public pictureTaken = new EventEmitter<WebcamImage>();

    // toggle webcam on/off
    public showWebcam = true;
    public allowCameraSwitch = true;
    public multipleWebcamsAvailable = false;
    public deviceId: string;
    public videoOptions: MediaTrackConstraints = {
        // width: {ideal: 1024},
        // height: {ideal: 576}
    };
    public errors: WebcamInitError[] = [];
    
    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
    private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

    public ngOnInit(): void {
        WebcamUtil.getAvailableVideoInputs()
            .then((mediaDevices: MediaDeviceInfo[]) => {
                this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
            });
console.log(this.data.patient)
        if (this.data?.patient) {
            this.currentPatientPicture = this.data.patient.profile_url;
            this.patient.setValue({
                id: this.data.patient.id ? this.data.patient.id : '',
                imagen: this.data.patient.imagen ? this.data.patient.imagen : '',

            });
        }
        if (this.data.patient) {
            this.showOnlyName = true;
            this.editing = true;
        }
    }

    public triggerSnapshot(): void {
        this.trigger.next();
    }

    public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
    }

    public handleInitError(error: WebcamInitError): void {
        this.errors.push(error);
    }

    public showNextWebcam(directionOrDeviceId: boolean | string): void {
        // true => move forward through devices
        // false => move backwards through devices
        // string => move to device with given deviceId
        this.nextWebcam.next(directionOrDeviceId);
    }

    // public handleImage(webcamImage: WebcamImage): void {
    //     console.info('received webcam image', webcamImage);
    //     this.pictureTaken.emit(webcamImage);
    // }

    public cameraWasSwitched(deviceId: string): void {
        console.log('active device: ' + deviceId);
        this.deviceId = deviceId;
    }

    public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }

    public get nextWebcamObservable(): Observable<boolean | string> {
        return this.nextWebcam.asObservable();
    }
    public webcamImage: WebcamImage = null;

    handleImage(webcamImage: WebcamImage) {
        this.webcamImage = webcamImage;
        this.currentPatientPicture = webcamImage.imageAsDataUrl;
    }
    save() {
        this.sending = true;

        this.urltoFile(this.webcamImage.imageAsDataUrl, 'image.jpg', 'image/jpeg').then(file => {
            this.apiService.savePatientProfileImage(file, this.data.patient.id.toString()).subscribe(result => {
                console.log(result);
                this.close(this.currentPatientPicture);
                this.sending = false;
                this.snackBar.open('Guardado', null, {
                    duration: 4000
                });
            }, error => {
                console.log(error);
                this.sending = false;
                this.snackBar.open('Error.', null, {
                    duration: 4000
                });
            });
        });
    }
    urltoFile(url: string, filename: string, mimeType: string) {
        return (fetch(url)
            .then(function (res) { return res.arrayBuffer(); })
            .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
        );
    }
    // save() {
    //     this.sending = true;
    //     const data = this.patient.value;
    //     const identification = this.data.patient.identification != '' ? `identification: "${this.data.patient.identification}",` : '';
    //     const id = data.id ? `id: ${data.id},` : '';
    //     const imagen = data.imagen != '' ? `imagen: "${data.imagen}",` : null;
     
    //     const queryParams = `${id} ${imagen} ${identification} `;
    //     const queryProps =
    //         'id, imagen';

    //     this.apiService.savePatient(queryParams, queryProps).subscribe(
    //         (response: any) => {
    //             console.log(response);
    //             this.sending = false;
    //             this.snackBar.open('Guardado', null, {
    //                 duration: 4000
    //             });

    //             this.close();
    //         },
    //         error => {
    //             this.sending = false;
    //             // this.snackBar.open('Error.', null, {
    //             //   duration: 4000
    //             // });

    //             console.log(error);
    //         }
    //     );
    // }

    close(params: any = null) {
        this.dialogRef.close(params);
    }
    

}
