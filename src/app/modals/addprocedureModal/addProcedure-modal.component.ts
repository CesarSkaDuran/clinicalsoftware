import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


import { takeUntil, tap, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Subject, ReplaySubject } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

moment.locale('es');

@Component({
    selector: 'app-addProcedure-modal',
    templateUrl: './addProcedure-modal.component.html'
})
export class addProcedureModalComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;
    procFilterCtrl: FormControl = new FormControl();
    procedureForm = new FormGroup({
        id: new FormControl('', []),
        procedure: new FormControl('', []),

    });

    items: any[] = [];
    //dataProcedure: any []=[];
    sendingRecords: false;
    protected dataProcedure: any[] = [];
    tableData: any[] = [];
   

    constructor(
        public dialogRef: MatDialogRef<addProcedureModalComponent >,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }
    public patientFilterCtrl: FormControl = new FormControl();

    public filtereddataProcedure: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    protected _onDestroy = new Subject<void>();

    public searchingProcedures = false;

    ngOnInit() {
        this.loadProcedure();
        this.dataProcedure;
        console.log('datos procesos', this.dataProcedure);
        this.procFilterCtrl.valueChanges.pipe(
            filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 3),
            tap(() => this.searchingProcedures = true),
            takeUntil(this._onDestroy),
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(term => this.apiService.getProcedures(`search: "${term}"`, 'id,code,description'))
        ).subscribe((results: any) => {
            console.log(results);
            this.searchingProcedures = false;
            this.filtereddataProcedure.next(results.data.procedures);
        }, error => {
            this.searchingProcedures = false;
        });

        this.patientFilterCtrl.valueChanges
            .pipe(
                tap(() => this.searchingProcedures = true),
                takeUntil(this._onDestroy),
                debounceTime(500),
                distinctUntilChanged(),
                switchMap(term => this.apiService.getProcedures(`search: "${term}"`, 'id,code,description'))
            )
            .subscribe(() => {
                this.searchingProcedures = false;
                this.filterdataProcedure();
            });
        this.loadRecords();
    }

    ngAfterViewInit() { }
    loadProcedure() {
        console.log('sending records...');

        // this.sendingRecords = true;
        // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `search:""`;
        const queryProps =
            'id,  code, description ';
        this.apiService.getProcedures(queryParams, queryProps).subscribe(
            (response: any) => {
                this.dataProcedure = response.data.procedures;
                this.filtereddataProcedure.next(response.data.procedures.slice());
                console.log('datos del dia', this.tableData)
            },
            error => {
                this.sendingRecords = false;
                this.snackBar.open('Error.', null, {
                    duration: 4000
                });
                console.log(error);
            }
        );
    }

    protected filterdataProcedure() {
        if (!this.dataProcedure) {
            return;
        }
        // get the search keyword
        let search = this.patientFilterCtrl.value;
        if (!search) {
            this.filtereddataProcedure.next(this.dataProcedure.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        if (search) {

            this.filtereddataProcedure.next(

                this.dataProcedure.filter(patient => patient.description.toLowerCase().indexOf(search) > -1)
            );

        }
        if (!search) {

            this.filtereddataProcedure.next(

                this.dataProcedure.filter(patient => patient.code.toLowerCase().indexOf(search) > -1)
            );

        }
    }
    loadRecords() {
        this.tableData.push(this.data.procedure.identificacion);
    }

    save() {
        this.sending = true;
        const data = this.procedureForm.value;
        const id = data.id ? `id: ${data.id},` : '';
        const record_id = this.data.record_id != '' ? `record_id: "${this.data.record_id}",` : '';
        const procedure_id = `procedure_id: ${data.procedure},`;
        const queryParams = `${id} ${record_id} ${procedure_id} `;
        const queryProps = 'id, procedure_id, record_id';

        this.apiService.saveRecordProcedure(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;
                console.log(response);
                this.close(true);

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

    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void { }
}
