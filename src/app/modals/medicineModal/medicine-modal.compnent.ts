import { Component, OnInit, AfterViewInit, Inject, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeIn } from 'ng-animate';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { trigger, transition, useAnimation } from '@angular/animations';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

moment.locale('es');

@Component({
    selector: 'app-medicine-modal',
    templateUrl: './medicine-modal.component.html',
    styleUrls: ['./medicine-modal.component.scss'],
    animations: [
        trigger('fadeIn', [
            transition(
                '* => *',
                useAnimation(fadeIn, {
                    params: { timing: '0.4', delay: 0 }
                })
            )
        ])
    ]
})
export class MedicineModalComponent implements OnInit, AfterViewInit, OnDestroy {
    fadeIn: any;
    sending = false;
    sended = false;

    medicine = new FormGroup({
        id: new FormControl('', []),
        medicine: new FormControl('', [Validators.required]),
        dose: new FormControl(null, [Validators.required]),
        measure: new FormControl('1', [Validators.required]),
        frequency: new FormControl('', []),
        duration: new FormControl('', [Validators.required]),
        quantity: new FormControl('', []),
        administration: new FormControl('', []),
    });

    medFilterCtrl: FormControl = new FormControl();
    public filteredServerSideMedicines: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    protected _onDestroy = new Subject<void>();
    public searchingMedicines = false;

    constructor(
        public dialogRef: MatDialogRef<MedicineModalComponent>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService
    ) { }

    ngOnInit() {
        // this.getCreationData();

        if (this.data?.medicine) {
            this.medicine.setValue({
                id: this.data.medicine.id ? this.data.medicine.id : '',
                medicine: this.data.medicine.medicine ?? '',
                dose: this.data.medicine.dose ?? '',
                measure: this.data.medicine.measure.toString() ?? '',
                frequency: this.data.medicine.frequency.toString() ?? '',
                duration: this.data.medicine.duration.toString() ?? '',
                quantity: this.data.medicine.quantity ?? '',
                administration: this.data.medicine.administration ?? '',
            });
        }

        if (this.data.medicine && this.data.medicine.medicine !== null) {
            this.filteredServerSideMedicines.next([this.data.medicine.medicine]);
        }

        this.medFilterCtrl.valueChanges.pipe(
            filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 3),
            tap(() => this.searchingMedicines = true),
            takeUntil(this._onDestroy),
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(term => this.apiService.getMedicines(`search: "${term}"`, 'id,name,atc_code,active,administration,pos,cum'))
        ).subscribe((results: any) => {
            console.log(results);
            this.searchingMedicines = false;
            this.filteredServerSideMedicines.next(results.data.medicines);
        }, error => {
            this.searchingMedicines = false;
        });
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    ngAfterViewInit() { }

    close(params: any = null) {
        this.dialogRef.close(params);
    }

    medicineSelectionChange($event) {
        console.log($event.value.adminstration);
        this.medicine.controls.administration.setValue($event.value.administration);
    }

    save() {
        this.sending = true;
        const data = this.medicine.value;

        const id = data.id ? `id: ${data.id},` : '';
        const record = this.data.record_id != '' ? `record_id: "${this.data.record_id}",` : '';
        const medicine = data.medicine != '' ? `medicine_id: ${data.medicine.id},` : '';
        const dose = data.dose != '' ? `dose: "${data.dose}",`: '';
        const measure = data.measure != '' ? `measure: "${data.measure}",`: '';
        const frequency = data.frequency != '' ? `frequency: "${data.frequency}",`: '';
        const duration = data.duration != '' ? `duration: "${data.duration}",`: '';
        const quantity = data.quantity != '' ? `quantity: "${data.quantity}",`: '';
        const administration = data.administration != '' ? `administration: "${data.administration}",`: '';

        const queryParams = `${id} ${record} ${medicine} ${dose} ${measure} ${frequency} ${duration} ${quantity} ${administration}`;
        const queryProps =
            'id, medicine{id,name,atc_code,active,administration,pos,cum}, dose, measure, frequency, duration, administration';

        this.apiService.saveMedicine(queryParams, queryProps).subscribe(
            (response: any) => {
                console.log(response);
                this.sending = false;
                this.snackBar.open('Guardado', null, {
                    duration: 4000
                });

                this.close(true);
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
}
