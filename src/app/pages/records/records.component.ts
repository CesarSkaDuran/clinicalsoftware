import { Component, OnInit, EventEmitter, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
// import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { Router } from '@angular/router';
import { RecordsService } from './records.service';
import * as moment from 'moment';

import icSearch from '@iconify/icons-ic/twotone-search';
import { SelectionModel } from '@angular/cdk/collections';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { Record } from 'src/app/models/record';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientsModalComponent } from 'src/app/modals/patientsModal/patients-modal.component';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { Patient } from 'src/app/models/patient';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})
export class RecordsComponent implements OnInit, AfterViewInit {
  loadingRecords = false;
  data: Record[] = [];

  icSearch = icSearch;
  displayedColumns: string[] = ['name', 'id', 'sexo',  'phone','company', 'created_at', 'ultimaFecha', ];

  // @Input()
  // columns: TableColumn<Record>[] = [
  //   { label: 'ID',  columnDef: 'identification', property: 'identification', type: 'text', visible: true },
  //   { label: 'patient',  columnDef: 'patient', property: 'patient', type: 'text', visible: false },
  //   { label: 'Nombre', columnDef: 'name', property: 'patient', innerProperty: 'name', type: 'relation', visible: true },
  //   // { label: 'Profesión', columnDef: 'position', property: 'patient', innerProperty: 'position', type: 'relation', visible: true },
  //   // { label: 'Teléfono', columnDef: 'phone', property: 'patient', innerProperty: 'phone', type: 'relation', visible: true },
  //   // { label: 'Empresa', columnDef: 'company', property: 'patient', innerProperty: 'company', type: 'relation', visible: true },
  //   { label: 'Ingreso',  columnDef: 'created_at', property: 'created_at', type: 'text', visible: true }
  // ];

  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', [])
  });

  searchText = '';

  patientsModalIsOpen = false;
  resultsLength_p = 0;
  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy = 'updated_at';
  order = 'desc';
  limit = 10;
  offset = 0;
  dataSource_p: MatTableDataSource<Patient> | null;
  dataSource: MatTableDataSource<Record> | null;
  selection = new SelectionModel<Record>(true, []);

  // shortcuts: ShortcutInput[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public keyUp = new Subject<any>();
  @ViewChild('search', { static: false }) searchEl: ElementRef;
  dataPatient: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private recordsService: RecordsService,
    private apiService: ApiService,
    private _snackBar: MatSnackBar
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
        this.loadRecords();
        this.loadPatients();
      });
  }

  // get visibleColumns() {
  //   return this.columns.filter(column => column.visible).map(column => column.property);
  // }

  ngOnInit() {
    // this.loadRecords();
    this.loadPatients();
    this.dataPatient;
    this.dataSource = new MatTableDataSource();
    this.dataSource_p = new MatTableDataSource();
    console.log('datos paciente', this.dataSource_p)

    this.apiService.setRecord(null);
  }

  ngAfterViewInit() {
    this.searchEl.nativeElement.focus();

    // this.shortcuts.push(
    //   {
    //     key: ['shift + b'],
    //     command: e => console.log('clicked ', e.key),
    //     preventDefault: true
    //   },
    //   {
    //     key: ['shift + n'],
    //     command: e => console.log('clicked ', e.key),
    //     preventDefault: true
    //   }
    // );

    // this.keyboard.select('shift + b').subscribe(e => {
    //   this.searchEl.nativeElement.focus();
    // });

    // this.keyboard.select('shift + n').subscribe(e => {
    //   console.log('open from shift+n');
    //   this.openPatientsModal();
    // });
  }

  // @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

  searchKeyUp($event: KeyboardEvent): void {
    console.log($event);
    if ($event.code === 'KeyN' && $event.shiftKey) {
      this.filters.controls.search.setValue('');
      return;
    }

    this.keyUp.next($event);
  }

  dateChange(event: any) {
    this.loadRecords();
    this.loadPatients();
  }

  sortRecords(event: MatSort): void {
    this.orderBy = event.active;
    this.order = event.direction;

    // this.loadRecords();
    this.loadPatients();
  }

  loadRecords() {
    this.loadingRecords = true;
    const date =
      this.filters.value.date !== '' && this.filters.value.date !== null
        ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
        : '';
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date}`;
    const queryProps =
      'data{id,identification, patient{id, name, identification, civil_status, position, birth_date, sex, TipoDocumento, address, phone, company, profile_url, partner_name, eps, arl, pension, partner_profession, chat_id}, details{id, motive}, conclusion{id, diagnosis}, created_at}, total';

    this.apiService.getRecordsPagination(queryParams, queryProps).subscribe(
      (response: any) => {
        this.data = response.data.recordsPagination.data;
        this.resultsLength = response.data.recordsPagination.total;
        this.dataSource.data = this.data;
        this.loadingRecords = false;
      },
      error => {
        this.loadingRecords = false;
        // this._snackBar.open('Error.', null, {
        //   duration: 4000
        // });
        console.log(error);
      }
    );
  }

  loadPatients() {
    // console.log('loading records...');
    // console.log(this.filters.value);

    this.loadingRecords = true;
    const date =
      this.filters.value.date !== '' && this.filters.value.date !== null
        ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
        : '';
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date}`;
    const queryProps =
      'data{id,identification, name, sex, arl, records{id, identification, created_at}, pension, TipoDocumento, position, birth_date, phone, address, company, email, partner_name, partner_profession, status, chat_id, eps profile_url, civil_status, created_at, updated_at}, total';

    this.apiService.getPatientsPagination(queryParams, queryProps).subscribe(
      (response: any) => {
        this.dataPatient = response.data.patientPagination.data;
        this.resultsLength_p = response.data.patientPagination.total;
        this.dataSource_p.data = this.dataPatient;
        this.loadingRecords = false;
      },
      error => {
        this.loadingRecords = false;
        // this._snackBar.open('Error.', null, {
        //   duration: 4000
        // });
        console.log(error);
      }
    );
  }

  pageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.loadRecords();
    this.loadPatients();
  }

  openPatientsModal() {
    if (!this.patientsModalIsOpen) {
      const dialogRef = this.dialog.open(PatientsModalComponent, {
        width: '460px',
        height: '562px',
        maxHeight: '800px'
      });

      this.patientsModalIsOpen = true;
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log('patients modal closed');
        this.patientsModalIsOpen = false;
        this.loadRecords();
        this.loadPatients();

        if (result.created) {
          localStorage.setItem('userCreated', 'true');
        }

        if (result) {
          this.selectRecordPatientGuard(result.record);
        }
        
      });
      
    }
  }

  changeDateTimeFormat(date: string) {
    return moment(date).format('DD/MM/YYYY hh:mm');
  }
  selectRecordPatientGuard(record: any) {
    // change for reception
    // return;
    console.log('to record');
    console.log(record);
    this.apiService.setRecord(record);
    // this.apiService.selectCompany({some: 'thing'});
    this.router.navigate(['/app/records/view', record.identification]);
  }

  openHistory(record: any){
    // this.apiService.setRecord(record);
    this.router.navigate(['/app/records/view', record.records[0].identification]);
  }

  selectRecord(record: any) {
    // change for reception
    // return;
    console.log('to record');
    console.log(record);
    this.apiService.setRecord(record);
    // this.apiService.selectCompany({some: 'thing'});
    this.router.navigate(['/app/control', record.identification, record.records[0].identification]);
  }

  replaceSpace(str: string) {
    return str.replace(/<br>/g, '\n');
  }

  trackByColumnDef<T>(index: number, column: TableColumn<T>) {
    return column.columnDef;
  }

  printRow(row: any, column: any) {
    console.log(row);
    console.log(column);
  }
}
