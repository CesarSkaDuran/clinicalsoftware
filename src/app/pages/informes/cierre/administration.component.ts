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
import { environment } from 'src/environments/environment';
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
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})

export class AdministrationComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['company', 'nit', 'date', 'fecha', 'date2', 'concept', 'banco', 'value', 'status', 'options'];
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
    this.loadPago();
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
  loadPago() {
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `search:""`;
    const queryProps =
      'id, id_afiliacion, tercero{id, nombre, documento}, nombre, valor, iva, status, created_at, ';
    this.apiService.getCuentaCobro(queryParams, queryProps).subscribe(
      (response: any) => {
        this.PagosTotal = response.data.getCuentaCobro;
        this.totales = this.PagosTotal.reduce((
          acc,
          obj,
        ) => acc + (obj.valor++), 0
        );
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
  openPresupuesto(element: any) {
    // const win = window.open(`http://localhost:8000/cobro/${element.id}`, '_blank');
    const win = window.open(`${environment.serverUrl}/cobro/${element.id}`, '_blank');
    win.focus();
  }
  openModal(params: any = null) {
    const dialogRef = this.dialog.open(DetallePagosModalComponent, {
      width: '800px',
      height: '6400px',
      maxHeight: '800px',
      data: {
        params,
        numero: params.length
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadPago();
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
  filterAfiliacion(banco) {
    if (banco == '0') {
      this.afiliacionFilter = this.data;
      return;
    }
    this.afiliacionFilter = this.data.filter((data: any) => data.banco == banco);
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
    const queryParams = `tipo: 2,  limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date} ${date2}`;
    const queryProps =
      'data{id, id_afiliacion, banco, tercero{id, nombre, documento}, obs, fecha, nombre, valor, cuatroxmil, iva, status, created_at, updated_at }, total';

    this.apiService.getCuentaCobroPagination(queryParams, queryProps).subscribe(
      (response: any) => {
        this.data = response.data.getCuentaCobroPagination.data;
        this.resultsLength = response.data.getCuentaCobroPagination.total;
        this.afiliacionFilter = response.data.getCuentaCobroPagination.data;
        this.totalIncome = response.data.getCuentaCobroPagination.data.length === 0
          ? 0 : response.data.getCuentaCobroPagination.data.map((item: any) => parseFloat(item.status == 2 ? item.valor : 0))
            .reduce((item1: any, item2: any) => item1 + item2);
        this.totalPagado = response.data.getCuentaCobroPagination.data.length === 0
          ? 0 : response.data.getCuentaCobroPagination.data.map((item: any) => parseFloat(item.status == 1 ? item.valor : 0))
            .reduce((item1: any, item2: any) => item1 + item2);
        this.total = response.data.getCuentaCobroPagination.data.length === 0
          ? 0 : response.data.getCuentaCobroPagination.data.map((item: any) => parseFloat( item.valor ))
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

  openIncomeModal(income: any = null) {
    const dialogRef = this.dialog.open(IncomeModalComponent, {
      width: '1200px',
      height: '800px',
      maxHeight: '1024px',
      data: {
        income: income
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;

      this.loadRecords();
      console.log(result);
    });
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
  openDateModal() {
    const dialogRef = this.dialog.open(DateModalComponent, {
      width: '680px',
      height: 'auto',
      maxHeight: '800px',
      data: {
        // record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      this.loadRecords();
      this.loadPago();
    });
  }
  delete(income: any) {

    const r = confirm('¿Eliminar Ingreso?');
    if (r === true) {
      this.loadingRecords = true;

      const id = income ? `id: ${income.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id, concept, date, value, status';

      this.apiService.saveIncome(queryParams, queryProps).subscribe(
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
