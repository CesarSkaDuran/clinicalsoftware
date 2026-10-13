import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/api/api.service';
import icMoney from '@iconify/icons-feather/dollar-sign';
import icUser from '@iconify/icons-feather/user';
import icPeople from '@iconify/icons-feather/users';
import icVirtual from '@iconify/icons-feather/file-text';
import icClose from '@iconify/icons-ic/close';
import icInform from '@iconify/icons-feather/alert-circle';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Appointment } from 'src/app/models/appointment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { of, Subject } from 'rxjs';
import icHistory from '@iconify/icons-feather/plus-square';
import { MatSort } from '@angular/material/sort';
import moment from 'moment';
import { NewHistoryModalComponent } from 'src/app/modals/newHistoryModal/newHistoryModal.component';
import { pagosModalComponent } from 'src/app/modals/pagosModal/pagosModal.component';
import baselineOpenInNew from '@iconify/icons-ic/baseline-open-in-new';
import baselineCheck from '@iconify/icons-ic/baseline-check';
import baselineDeleteForever from '@iconify/icons-ic/baseline-delete-forever';
import twotoneArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { AppointmentModalComponent } from 'src/app/modals/appointmentModal/appointment-modal.component';
import icAdmin from '@iconify/icons-feather/dollar-sign';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/core/core.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [
        stagger80ms,
        scaleIn400ms,
        fadeInRight400ms,
        fadeInUp400ms
    ]
})
export class HomeComponent implements OnInit {
    baselineOpenInNew = baselineOpenInNew;
    baselineCheck = baselineCheck;
    baselineDeleteForever = baselineDeleteForever;
    totalIncome: 0;
    icMoney = icMoney;
    icUser = icUser;
    icPeople = icPeople;
    icVirtual = icVirtual;
    icClose = icClose;
    alertIsVisible = true;
    icAdmin = icAdmin;
    icInform = icInform;
    dataSource: MatTableDataSource<Appointment> | null;
    dataAppointment: any[] = [];
    icHistory = icHistory;
    displayedColumns: string[] = ['patient', 'phone', 'date','date_1', 'time', 'service', 'doctor', 'status', 'options'];
    data: Appointment[] = [];
    loadingRecords = false;
    twotoneArrowDropDown = twotoneArrowDropDown;
    doctorFilter: any[] = [];
    dataDoctor: any[] = [];
    datos:any[]= [];
    total: number;
    totalPatient:number;
    resultsLength = 0;
    pageSize = 10;
    pageSizeOptions: number[] = [10, 50, 100];
    orderBy = 'created_at';
    order = 'desc';
    limit = 10;
    offset = 0;
    mes: string = '';
    //loadingRecords: boolean;
    filters = new FormGroup({
        search: new FormControl('', []),
        date: new FormControl('', []),
        date2: new FormControl('', []),
    });
    total_virtual: number;
    dataAppointment_1: any []=[];
    porcentaje: number;
    total_citas: number;
    loadingRecords2= false;

    constructor(
        public dialog: MatDialog,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        private router: Router,
        private coreService: CoreService,
    ) {
        const codeSearchSubscription = this.keyUp
            .pipe(
                map((event: any) => event.target.value),
                debounceTime(300),
                distinctUntilChanged(),
                flatMap(search => of(search).pipe(delay(300)))
            )
            .subscribe(result => {
                this.filters.controls.search.setValue(this.searchEl.nativeElement.value);
                this.loadAppointmentPaginator();
            });
    }

    @ViewChild(MatSort) sort: MatSort;
    public keyUp = new Subject<any>();
    @ViewChild('search', { static: false }) searchEl: ElementRef;



    loadAppointment() {
        console.log('loading records...');

        this.loadingRecords = true;
        // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `search:"" `;
        const queryProps =
            'id,  name, company, value, date, time, status, type, total, email_confirmation, phone_confirmation, reason, patient{id, name, identification, phone,}, doctor{id ,name,}';
        this.apiService.getAppointments(queryParams, queryProps).subscribe(
            (response: any) => {
                this.dataAppointment = response.data.appointments;
                this.datos = this.dataAppointment = response.data.appointments;

                this.total_citas = this.dataAppointment.reduce((
                    _acc,
                    obj,
                ) => _acc + (obj.total++ ),
                    0);
                    console.log('totales de citas', this.total_citas)
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

    loadAppointment_2() {
        console.log('loading records...');

        this.loadingRecords = true;
        // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `search:""`;
        const queryProps =
            'id,  name, company, value, date, time, status, type, email_confirmation, phone_confirmation, reason, patient_id, app_user_id, user_id, patient{id, name, identification, phone, status}, doctor{id ,name,}';
        this.apiService.getAppointmentMonth(queryParams, queryProps).subscribe(
            (response: any) => {
                this.dataAppointment = response.data.appointmentMonth;
                this.datos = this.dataAppointment = response.data.appointmentMonth;
               
                this.porcentaje = this.dataAppointment.reduce((
                    acc,
                    obj,
                ) => acc + (obj.status == '1' ? obj.value = obj.value++ : obj.status == '3' ? obj.value = obj.value++ : 0 ), 0);
                console.log("porcentaje: ", this.porcentaje);
                
                this.totalPatient = this.dataAppointment.reduce((
                    acc,
                    obj,
                ) => acc + (obj.status == '2'? obj.patient.status++  : 0)  , 0
                    );

                this.total_virtual = this.dataAppointment.reduce((
                    _acc,
                    obj,
                ) => _acc + (obj.status == '3' ? obj.status++ /3 : 0),
                    0);

                this.total_citas = this.dataAppointment.length;

                    console.log( 'datos del dia', this.dataAppointment)
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

    userName() {
        return this.coreService.currentUser.name;
    }

    doctorImage(){
        return this.coreService.currentUser.doctor.avatar_url
    }
    loadAppointmentPaginator() {
        this.loadingRecords2 = true;
        const date =
            this.filters.value.date !== '' && this.filters.value.date !== null
                ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
                : '';
        const date2 =
            this.filters.value.date2 !== '' && this.filters.value.date2 !== null
                ? `date2: "${moment(this.filters.value.date2).format('YYYY-MM-DD')}",`
                : '';
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date}  ${date2}`;
        const queryProps =
            'data{id, name, doctorRemision{id,especializacion, nombre}, company, value, date, time, end_time, phone_confirmation, email_confirmation, reason, created_at, payment_type, status, doctor{name}, patient{identification, records{id,identification, patient{id, name, identification, civil_status, position, birth_date, address, phone, company, profile_url, partner_name, partner_profession, chat_id}, details{id, motive}, conclusion{id, diagnosis}, created_at}}}, total';

        this.apiService.getAppointmentPagination(queryParams, queryProps).subscribe(
            (response: any) => {
                this.data = response.data.appointmentsPagination.data;

                const total = response.data?.appointmentsPagination?.total;
                this.resultsLength = (total !== undefined && total !== null) ? total : this.data.length;
                this.dataSource.data = this.data;
                this.doctorFilter = this.dataSource.data = this.data;
                this.dataDoctor = this.dataSource.data = this.data;
                this.loadingRecords2 = false;
                console.log('appointments pagination', { data: this.data, total: this.resultsLength });

            },
            error => {
                this.loadingRecords2 = false;
                this._snackBar.open('Error.', null, {
                    duration: 4000
                });
                console.log(error);
            }
        );
    }
    loadDoctors() {
        console.log('loading records...');

        this.loadingRecords = true;
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `search:" ${searchText} "`;
        const queryProps =
            'id, user_id, name, specialization, experience, consultation_price, address, in_place_price, consultation_price, virtual_price, accounts{ id, bank1, bank2  } ';

        this.apiService.getDoctors(queryParams, queryProps).subscribe(
            (response: any) => {
                //this.dataDoctor = response.data.doctors;
                //this.dataDoctor.data = this.data
                // this.doctorFilter = response.data.doctors;
                //this.filteredPatients.next(response.data.doctors.slice());

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
    loadRecords() {

        this.loadingRecords = true;
        const date =
            this.filters.value.date !== '' && this.filters.value.date !== null
                ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
                : '';
        const date2 =
            this.filters.value.date2 !== '' && this.filters.value.date2 !== null
                ? `date2: "${moment(this.filters.value.date2).format('YYYY-MM-DD')}",`
                : '';
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `dataHoy: 1, limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date} ${date2}`;
        const queryProps =
            'data{id, id_afiliacion, banco, tercero{id, nombre, documento}, obs, fecha, nombre, valor, cuatroxmil, iva, status, created_at, updated_at }, total';

        this.apiService.getCuentaCobroPagination(queryParams, queryProps).subscribe(
            (response: any) => {
                // this.data = response.data.getCuentaCobroPagination.data;
                this.resultsLength = response.data.getCuentaCobroPagination.total;
                this.totalIncome = response.data.getCuentaCobroPagination.data.length === 0
                    ? 0 : response.data.getCuentaCobroPagination.data.map((item: any) => parseFloat(item.valor))
                        .reduce((item1: any, item2: any) => item1 + item2);
                this.loadingRecords = false;
                console.log('recaudos', this.totalIncome)
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

    filterCourse(categoryId) {
        if (categoryId == '0') {
            this.doctorFilter = this.dataDoctor;
            return;
        }
        this.doctorFilter = this.dataDoctor.filter((dataDoctor: any) => dataDoctor.specialization == categoryId);
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource();
        this.loadAppointmentPaginator();
        this.loadAppointment_2();
        this.loadRecords();
    }

    sortRecords(event: MatSort): void {
        this.orderBy = event.active;
        this.order = event.direction;

        this.loadAppointmentPaginator();
    }

    pageChange(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.limit = event.pageSize;
        this.offset = event.pageSize * event.pageIndex;
        this.loadAppointmentPaginator();
    }
    searchKeyUp($event: KeyboardEvent): void {
        console.log($event);
        if ($event.code === 'KeyN' && $event.shiftKey) {
            this.filters.controls.search.setValue('');
            return;
        }

        this.keyUp.next($event);
    }

    dateChange(event: any) {
        this.loadAppointmentPaginator();
    }

    editUser(user: any) {
        this.openPropectModal(user);
    }
    editPagos(user: any) {
        this.openPagosModal(user);
    }
    openPropectModal(user: any = null) {
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
            this.loadAppointment()
            this.loadAppointmentPaginator();
            this.loadAppointment_2();
            this.porcentaje;
            this.totalPatient;
            this.porcentaje;
            console.log(result);    

        });
    }
    goToRecord(appointment: any) {
        this.apiService.setRecord(appointment.patient.records[0]);
        this.router.navigate(['/app/records/view', appointment.patient.records[0].identification]);

    }
    openPagosModal(user: any = null) {
        const dialogRef = this.dialog.open(pagosModalComponent, {
            width: '600px',
            height: '400px',
            maxHeight: '850px',
            data: {
                user: user
            }
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) return;
            this.loadAppointment();
            this.loadAppointmentPaginator();
            this.loadAppointment_2();
            this.porcentaje;
            this.totalPatient;
            this.porcentaje;
            //this.loadRecords();   
            console.log(result);

        });
    }
    openAppointmentModal(appointment: any = null) {
        const dialogRef = this.dialog.open(AppointmentModalComponent, {
            width: '680px',
            height: '520px',
            maxHeight: '850px',
            data: {
                appointment: appointment
            }
            
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) return; 
            this.loadAppointment()
            this.loadAppointmentPaginator();
            this.loadAppointment_2();
            this.porcentaje;
            this.totalPatient;
            this.porcentaje;
            //this.loadRecords();   
            console.log(result);

        });

      
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
                    this.loadAppointment()
                    this.loadAppointmentPaginator();
                    this.loadAppointment_2();
                    this.porcentaje;
                    this.totalPatient;
                    this.porcentaje;
                    
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

    getStatusClass(status: number) {
        switch (status) {
            case 1: return 'status-scheduled';
            case 2: return 'status-pending';
            case 3: return 'status-completed';
            case 4: return 'status-cancelled';
            default: return 'status-default';
        }
    }
}
