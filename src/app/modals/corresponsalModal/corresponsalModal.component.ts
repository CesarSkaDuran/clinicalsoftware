import { Component, OnInit, Inject, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject, of } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { takeUntil, switchMap } from 'rxjs/operators';
import { PatientFormModalComponent } from '../patientFormModal/patient-form-modal.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import roundHighlightOff from '@iconify/icons-ic/round-highlight-off';

moment.locale('es');

@Component({
    selector: 'app-corresponsalModal',
    templateUrl: './corresponsalModal.component.html'
})

export class CorresponsalModalComponent implements OnInit, AfterViewInit, OnDestroy {
    isNew = true;
    userData: any = [];
    protected patients: any[] = [];
    displayedColumns: string[] = ['id', 'name', 'lastname', 'email', 'phone', 'course', 'country', 'date', 'age',];
    displayedColumn: string[] = ['name', 'date',];
    sending = false;
    selected: any = null;
    showOnlyName = false;
    loadingRecords = false;
    // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    model: any[] = [];
    msg: String = "";
    dataAppointment: any[] = [];
    tableData: any[] = [];
    roundHighlightOff = roundHighlightOff;
    loading = false;
    dataNewPropect: any[] = [];
    items: any[] = [];

    userForm = new FormGroup({
        id: new FormControl('', []),
        novedad: new FormControl('', [Validators.required]),
    });

    public patientFilterCtrl: FormControl = new FormControl();

    public filteredPatients: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    protected _onDestroy = new Subject<void>();

    constructor(

        public dialogRef: MatDialogRef<CorresponsalModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public dialog: MatDialog,
        private route: ActivatedRoute,

    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    loadRecords() {
        this.tableData.push(this.data.user);
        console.log('cita', this.tableData)
    }

    ngOnInit() {
        this.loadRecords();

        this.loadApponitment();
        this.dataAppointment;
        console.log('datos de pago', this.dataAppointment)
        //  this.getNewPropect();
    }
    loadApponitment() {
        console.log('loading records...');

        this.loadingRecords = true;
        // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const AppointmentId = this.tableData;
        const queryParams = `id: ${AppointmentId}`;
        const queryProps =
            'id, name, company, value, date, time, end_time, phone_confirmation, email_confirmation, status, type, doctor{ id, name, specialization, phone, accounts{ id, bank1, bank2, efecty, sured, contact, conclusion, consulting   } }';

        this.apiService.getAppointments(queryParams, queryProps).subscribe(
            (response: any) => {
                this.dataAppointment = response.data.appointments;
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

    delete(income: any) {

        const r = confirm('¿Eliminar Ingreso?');
        if (r === true) {
            this.loadingRecords = true;

            const id = income ? `id: ${income.id},` : '';
            const queryParams = `${id} delete: 1`;
            const queryProps = 'id ';

            this.apiService.deleteAppointment(queryParams, queryProps).subscribe(
                (response: any) => {
                    this.loadingRecords = false;

                    //      this.getPropect();

                    this._snackBar.open('Eliminado', null, {
                        duration: 4000
                    });
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
    }



    ngAfterViewInit() { }


    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    addEmployee(): void {
        this.dataNewPropect.push(this.model);
        this.msg = 'campo agregado';
    }

}

