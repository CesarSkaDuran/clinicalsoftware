import { Component, OnInit, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
// import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { Router } from '@angular/router';
import * as moment from 'moment';
// import { IncomeModalComponent } from '@app/components/modals/incomeModal/income-modal.component';
import twotoneRotateLeft from '@iconify/icons-ic/twotone-rotate-left';

import icSearch from '@iconify/icons-ic/twotone-search';
import icMore from '@iconify/icons-ic/twotone-more-vert';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icRemove from '@iconify/icons-ic/twotone-delete';
import { cuentaCobro } from 'src/app/models/cuentaCobro';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { ApiService } from 'src/app/core/api/api.service';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IncomeModalComponent } from 'src/app/modals/incomeModal/income-modal.component';
import { DetallePagosModalComponent } from 'src/app/modals/detallePagos/detallePagos.component';
import twotoneArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { DateModalComponent } from 'src/app/modals/dateModal/dateModal.component';
import { environment } from '../../../environments/environment.prod';
import { NuevoProcedimiento } from 'src/app/modals/nuevoProcedimiento/nuevoProcedimiento-modal.component';
export interface PeriodicElement {
  periodo: string;
  f_creacion: string;
  pago_ss: string;
  o_ingreso: string;
  h_extra: string;
  deducciones: string;
  total_pagar: string;
  empleados: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  { periodo: "CUCUTA SAS", empleados: "111111", f_creacion: "05/09/2021", pago_ss: "110", o_ingreso: "256000", h_extra: "1", deducciones: " $ 115.000", total_pagar: "$1.480.000" },
  { periodo: "BOX MEDIA", empleados: "222222", f_creacion: "05/09/2021", pago_ss: "122", o_ingreso: "556000", h_extra: "2", deducciones: " $ 115.000", total_pagar: "$1.480.000" }
];
@Component({
  selector: 'app-procedimientosPaciente',
  templateUrl: './procedimientosPaciente.component.html',
  styleUrls: ['./procedimientosPaciente.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})

export class ProcedimientosPacienteComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['company', 'nit', 'date', 'fecha', 'options'];
  data: cuentaCobro[] = [];

  searchText = '';
  loadingRecords = false;
  totalIncome: 0;

  icMore = icMore;
  icEdit = icEdit;
  icRemove = icRemove;
  icSearch = icSearch;
  patientsModalIsOpen = false;
  twotoneRotateLeft = twotoneRotateLeft;
  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  orderBy = 'status';
  order = 'desc';
  limit = 100;
  offset = 0;
  dataSource = ELEMENT_DATA;
  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', []),
    date2: new FormControl('', []),

  });
  twotoneArrowDropDown = twotoneArrowDropDown;
  // shortcuts: ShortcutInput[] = [];

  public keyUp = new Subject<any>();
  @ViewChild('search', { static: true }) searchEl: ElementRef;
  PagosTotal: any[] = [];
  totales: any;
  totalPagado: 0;
  total: 0;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private apiService: ApiService,
    private _snackBar: MatSnackBar
  ) {
    const codeSearchSubscription = this.keyUp
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(700),
        distinctUntilChanged(),
        flatMap(search => of(search).pipe(delay(400)))
      )
      .subscribe(result => {
        this.loadRecords();
      });
  }

  ngOnInit() {
    this.loadRecords();

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
  }

  // @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;
 

  openModal(element: any = null) {
    const dialogRef = this.dialog.open(NuevoProcedimiento, {
      width: '800px',
      height: '640px',
      maxHeight: '800px',
      data: {
        element,
        editar: true
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      this.loadRecords()
    });
  }
  searchKeyUp($event: KeyboardEvent): void {
    // console.log($event);
    if ($event.code === 'KeyN' && $event.shiftKey) {
      this.filters.controls.search.setValue('');
      return;
    }

    this.keyUp.next($event);
  }

  dateChange(event: any) {
    this.loadRecords();
  }

  sortRecords(event: MatSort): void {
    this.orderBy = event.active;
    this.order = event.direction;

    this.loadRecords();
  }
  afiliacionFilter: any[] = [];
  filterAfiliacion(status) {
    if (status == '0') {
      this.afiliacionFilter = this.data;
      return;
    }
    this.afiliacionFilter = this.data.filter((data: any) => data.status == status);
  }
  filterAfiliacion2(concepto) {
    if (concepto == '0') {
      this.afiliacionFilter = this.data;
      return;
    }
    this.afiliacionFilter = this.data.filter((data: any) => data.nombre == concepto);
  }
  loadRecords() {
    // console.log('loading records...');
    // console.log(this.filters.value);

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
    const queryParams = `  limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date} ${date2}`;
    const queryProps =
     
    'data{id,nombre, categoria{id, nombre} user_id,categoria_id,valor1,valor2,status,tipo}, total';

    this.apiService.getProcedimientoDentalPagination(queryParams, queryProps).subscribe(
      (response: any) => {
        this.data = response.data.getProcedimientoDentalPagination.data;
        this.resultsLength = response.data.getProcedimientoDentalPagination.total;
        this.afiliacionFilter = response.data.getProcedimientoDentalPagination.data;
        this.totalIncome = response.data.getProcedimientoDentalPagination.data.length === 0
          ? 0 : response.data.getProcedimientoDentalPagination.data.map((item: any) => parseFloat(item.status == 2 ? item.valor : 0))
            .reduce((item1: any, item2: any) => item1 + item2);
        this.totalPagado = response.data.getProcedimientoDentalPagination.data.length === 0
          ? 0 : response.data.getProcedimientoDentalPagination.data.map((item: any) => parseFloat(item.status == 1 ? item.valor : 0))
            .reduce((item1: any, item2: any) => item1 + item2);
        this.total = response.data.getProcedimientoDentalPagination.data.length === 0
          ? 0 : response.data.getProcedimientoDentalPagination.data.map((item: any) => parseFloat( item.valor ))
            .reduce((item1: any, item2: any) => item1 + item2);
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

  changeDateTimeFormat(date: string) {
    return moment(date).format('DD/MM/YYYY');
  }

  selectRecord(record: any) {
  }

  replaceSpace(str: string) {
    return str.replace(/<br>/g, '\n');
  }

  delete(income: any) {

    const r = confirm('¿Eliminar Procedimiento?');
    if (r === true) {
      this.loadingRecords = true;

      const id = income ? `id: ${income.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id';

      this.apiService.saveNuevoProcedimiento(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loadingRecords = false;

          this.loadRecords();

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
}
