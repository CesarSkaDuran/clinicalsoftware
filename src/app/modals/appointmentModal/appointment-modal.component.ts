import { Component, OnInit, Inject, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';

import * as moment from 'moment';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { takeUntil } from 'rxjs/operators';
import { PatientFormModalComponent } from '../patientFormModal/patient-form-modal.component';
import { CoreService } from 'src/app/core/core.service';
import { Router } from '@angular/router';
import { NewHistoryModalComponent } from '../newHistoryModal/newHistoryModal.component';

moment.locale('es');

@Component({
    selector: 'app-appointment-modal',
    templateUrl: './appointment-modal.component.html'
})
export class AppointmentModalComponent implements OnInit, AfterViewInit, OnDestroy {
    protected patients: any[] = [];

    sending = false;
    selected: any = null;
    showOnlyName = false;
    editing = false;

    obs = new FormGroup({
        id: new FormControl('', []),
        patient: new FormControl('', []),
        date: new FormControl('', [Validators.required]),
        // value: new FormControl(0, [Validators.required]),
        time: new FormControl('', [Validators.required]),
        // type: new FormControl('1', [Validators.required]),
        end_time: new FormControl('', [Validators.required]),
        reason: new FormControl('', []),
        remision_id: new FormControl('', []),
        // payment_type: new FormControl('', []),
        status: new FormControl('2', []),
    });

    items: any[] = [];

    public patientFilterCtrl: FormControl = new FormControl();

    public filteredPatients: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

    protected _onDestroy = new Subject<void>();

    constructor(
        public dialogRef: MatDialogRef<AppointmentModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private coreService: CoreService,
        private router: Router
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }
    remisiones: any[] = [];
    drRemision() {
        this.sending = true;
        const queryParams = `status: 1,`;
        const queryProps = 'id, nombre, direccion, especializacion, telefono, direccion';

        this.apiService.getDrRemision(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;
                this.remisiones = response.data.getDrRemision;
                console.log('remision', this.remisiones)
                this.snackBar.open('Listado de Medicos Cargados', null, {
                    duration: 4000
                });

            },
            (error: any) => {
                this.sending = false;
                this.snackBar.open('Error.', null, {
                    duration: 4000
                });

                console.log(error);
            }
        );
    }
    ngOnInit() {
        console.log(this.data.appointment);
        this.drRemision()
        if (this.data.appointment) {
            this.obs.setValue({
                id: this.data.appointment.id ? this.data.appointment.id : null,
                patient: this.data.appointment.app_user_id ? this.data.appointment.app_user_id : null,
                date: this.data.appointment.date ? this.data.appointment.date : new Date(),
                // value: this.data.appointment.value ? parseInt(this.data.appointment.value, 10) : null,
                time: this.data.appointment.time ? this.data.appointment.time : null,
                // type: this.data.appointment.type ? this.data.appointment.type : '1',
                end_time: this.data.appointment.end_time ? this.data.appointment.end_time : null,
                reason: this.data.appointment.reason ? this.data.appointment.reason : null,
                // payment_type: this.data.appointment.payment_type ? this.data.appointment.payment_type.toString() : null,
                status: this.data.appointment.status ? this.data.appointment.status.toString() : null,
                remision_id: this.data.appointment.doctorRemision?.id ? this.data.appointment.doctorRemision?.id.toString() : null,
            });

            if (this.data.appointment.id) {
                this.showOnlyName = true;
                this.editing = true;
            }
        } else {
            // this.obs.controls.date.setValue(new Date());
            // this.obs.controls.value.setValue(this.coreService.currentUser.doctor.in_place_price);
        }

        this.loadPatients();

        // listen for search field value changes
        this.patientFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterPatients();
            });
    }

    ngAfterViewInit() { }

    onTypeChange(selectedType) {

        this.obs.controls.value.setValue(selectedType == 1 ?
            this.coreService.currentUser.doctor.in_place_price :
            this.coreService.currentUser.doctor.virtual_price);
    }

    goToRecord(appointment: any) {
        this.apiService.setRecord(appointment.patient.records[0]);
        this.router.navigate(['/app/records/view', appointment.patient.records[0].identification]);
        this.close();
    }

    save() {
        this.sending = true;
        const data = this.obs.value;

        console.log(data);

        const id = this.data.appointment ? `id: ${data.id},` : '';
        const name = this.data.appointment ? '' : `name: "${data.patient.name}",`;
        const patient_id = this.data.appointment ? '' : `patient_id: ${data.patient.id},`;
        const type = data.type !== '' ? `type: ${1},` : 1;
        const value = data.value !== '' ? `value: "${0}",` : "0";
        const date = data.date !== '' ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : '';
        const time = data.time !== '' ? `time: "${data.time}",` : '';
        const end_time = data.end_time !== '' ? `end_time: "${data.end_time}",` : '';
        const reason = data.reason !== '' ? `reason: "${data.reason}",` : '';
        const status = data.status !== '' ? `status: ${data.status},` : '';
        const remision_id = data.remision_id !== '' ? `remision_id: ${data.remision_id},` : '';
        const paymenType = data.payment_type !== '' ? `payment_type: ${1},` : 1;

        const queryParams = `${id} ${name} ${remision_id} ${value} ${type} ${date} ${time} ${end_time} ${reason} ${patient_id} ${paymenType} ${status}`;
        const queryProps = 'id, name, company, date, end_time, reason, payment_type, value, time, type';

        this.apiService.createAppointment(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close(data);

                this.snackBar.open('Guardado', null, {
                    duration: 4000
                });
            },
            error => {
                this.sending = false;
                this.snackBar.open('Error.', null, {
                    duration: 4000
                });

                console.log(error);
            }
        );
    }

    loadPatients(callback = null) {
        console.log('loading patients...');

        let queryParams = `search:""`;
        let queryProperties =
            'id, name';

        this.apiService.getPatients(queryParams, queryProperties).subscribe(
            (response: any) => {
                console.log(response);
                this.patients = response.data.patients;
                this.filteredPatients.next(response.data.patients.slice());

                if(callback) {
                    callback();
                }
            },
            error => {
                console.log(error);
            }
        );
    }
    openPatientModal(user: any = null) {
        const dialogRef = this.dialog.open(NewHistoryModalComponent, {
            width: '700px',
            height: '500px',
            maxHeight: '850px',
            data: {
                user: user
            }
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) return;
            //this.loadRecords();
            console.log(result);

        });
    }
    protected filterPatients() {
        if (!this.patients) {
            return;
        }
        // get the search keyword
        let search = this.patientFilterCtrl.value;
        if (!search) {
            this.filteredPatients.next(this.patients.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredPatients.next(
            this.patients.filter(patient => patient.name.toLowerCase().indexOf(search) > -1)
        );
    }

    openNewPatient(): void {
        const dialogRef = this.dialog.open(PatientFormModalComponent, {
            width: '600px',
            height: '562px',
            maxHeight: '800px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('patients form closed');
            if (result) {
                this.loadPatients(() => {
                    let match = this.patients.filter((value) => {
                        return value.id == result.id;
                    });

                    console.log(match);
                    console.log(result);
                    console.log(this.patients);

                    if (match.length > 0) {
                        this.obs.controls.patient.setValue(match[0]);
                    }
                });
            }
            //    this.loadPatients();
        });
    }

    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
}
