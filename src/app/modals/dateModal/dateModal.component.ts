import { Component, OnInit, Inject, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

moment.locale('es');

@Component({
    selector: 'app-dateModal',
    templateUrl: './dateModal.component.html'
})
export class DateModalComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;


    obs = new FormGroup({
        id: new FormControl('', []),
        date: new FormControl('', []),
        patient: new FormControl('', []),

    });

    items: any[] = [];
    loading: boolean;
    categoriaSelect: any;
    categoria: any[] = [];
    Procedimiento: any[] = [];
    valorSelect: any;
    showOnlyName = false;
    editing = false;
    dataAny: any[] = [];
    searchingProcedures: boolean;

    constructor(
        public dialogRef: MatDialogRef<DateModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    public patientFilterCtrl: FormControl = new FormControl();

    public filteredPatients: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    protected _onDestroy = new Subject<void>();

    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
    
    loadRecords() {
        this.dataAny.push(this.data.procedimiento);
    }
    ngOnInit() {
        console.log(this.data.record);
        console.log(this.data.patient_id);
        console.log(this.data.procedimiento);
        this.loadRecords();
        this.loadPatients()
        this.patientFilterCtrl.valueChanges.pipe(
            filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 3),
            tap(() => this.searchingProcedures = true),
            takeUntil(this._onDestroy),
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(term => this.apiService.getPatients(`search: "${term}"`, 'id, name, identification'))
        ).subscribe((results: any) => {
            console.log(results);
            this.searchingProcedures = false;
            this.filteredPatients.next(results.data.patients);
        }, error => {
            this.searchingProcedures = false;
        });

    }

    ngAfterViewInit() { }

    setCategoriaSeleccionado(index) {
        this.categoriaSelect = index;
    }
    setValorSeleccionado(index) {
        this.valorSelect = index;
    }

    openFactura() {
        const data = this.obs.value;
        const date = data.date !== null
            ? `${moment(data.date).format('YYYY-MM-DD')}`: '';
        const win = window.open(`http://hcapi.clinicalsoftware.org/factura/${this.data.record.identification}/${date}`, '_blank');
        // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
        win.focus();
    }
    facturar() {
        this.sending = true;
        const data = this.obs.value;
        const id = data.id ? `id: ${data.id},` : '';
        const date = data.date !== '' ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : '';
        const queryParams = `status: 1, tipo: 3, patient_id:"${data.patient}", ${date} `;
        const queryProps = 'tipo, patient_id';

        this.apiService.saveProcedimientopaciente(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.snackBar.open('Guardado', null, {
                    duration: 4000
                });

                this.close(data);
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

    public patients: any[] = [];

    // public filterPatients() {
    //     if (!this.patients) {
    //         return;
    //     }
    //     // get the search keyword
    //     let search = this.patientFilterCtrl.value;
    //     if (!search) {
    //         this.filteredPatients.next(this.patients.slice());
    //         return;
    //     } else {
    //         search = search.toLowerCase();
    //     }
    //     // filter the banks
    //     this.filteredPatients.next(
    //         this.patients.filter(patient => patient.name.toLowerCase().indexOf(search) > -1)
    //     );
    // }
    loadPatients(callback = null) {
        console.log('loading patients...');

        let queryParams = `search:""`;
        let queryProperties =
            'id, name, identification';

        this.apiService.getPatients(queryParams, queryProperties).subscribe(
            (response: any) => {
                console.log(response);
                this.patients = response.data.patients;
                this.filteredPatients.next(response.data.patients.slice());

                if (callback) {
                    callback();
                }
            },
            error => {
                console.log(error);
            }
        );
    }
    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void { }
}
