import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { empresa } from 'src/app/models/empresa';
import { TerceroModalComponent } from '../terceroModal/tercero-modal.component';
import { filter, tap, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, ReplaySubject } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { environment } from 'src/environments/environment';

moment.locale('es');

@Component({
    selector: 'app-gasto-modal',
    templateUrl: './gasto-modal.component.html'
})
export class GastoModalComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;

    obs = new FormGroup({
        id: new FormControl('', []),
        id_empresa: new FormControl('', [Validators.required]),
        nombre: new FormControl('', []),
        dataHoy: new FormControl('', [Validators.required]),
        valor: new FormControl('', [Validators.required]),
        sucursal_id: new FormControl(0, [Validators.required]),
        obs: new FormControl('', [])
    });

    items: any[] = [];
    sucursal: any[] = [];
    searchingEps: boolean;

    constructor(
        public dialogRef: MatDialogRef<GastoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private currencyPipe: CurrencyPipe
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }
    formattedAmount;
    amount;
    transformAmount(element) {

        this.amount = element.target.value;

        this.formattedAmount = this.currencyPipe.transform(this.formattedAmount);

        element.target.value = this.formattedAmount;
    }
    PlanFilterCtrl: FormControl = new FormControl();
    protected _onDestroy = new Subject<void>();
    public filtereddataEps: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    ngOnInit() {
        this.PlanFilterCtrl.valueChanges.pipe(
            filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 1),
            tap(() => this.searchingEps = true),
            takeUntil(this._onDestroy),
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(term => this.apiService.getTercero(`search: "${term}"`, 'id, nombre, documento, dv, telefono, direccion'))
        ).subscribe((results: any) => {
            console.log(results);
            this.searchingEps = false;
            this.filtereddataEps.next(results.data.getTercero);
        }, error => {
            this.searchingEps = false;
        });
        // this.loadEmpresaPaginator();
        // this.sucursales();
        console.log(this.data.income);
        if (this.data.income) {
            this.obs.setValue({
                id: this.data.income.id,
                id_empresa: this.data.income.id_empresa,
                sucursal_id: this.data.income.sucursal_id,
                nombre: this.data.income.nombre ? this.data.income.nombre : '',
                dataHoy: this.data.income.dataHoy,
                valor: this.data.income.valor,
                obs: this.data.income.obs,
                // iva: this.data.income.iva,
            });
        } else {
            this.obs.controls.dataHoy.setValue(new Date());
        }
    }

    ngAfterViewInit() { }
    total: number;
    dataEmpresaAny: any[] = [];
    resultsLength = 0;
    dataSource: MatTableDataSource<empresa> | null;
    totalAfiliados: any;
    loadingPropect: boolean;
    pageSize = 10;
    pageSizeOptions: number[] = [10, 50, 100];
    orderBy = 'created_at';
    order = 'desc';
    limit = 10;
    offset = 0;
    filters = new FormGroup({
        search: new FormControl('', []),
        date: new FormControl('', []),
        date2: new FormControl('', [])
    });
   
    openModalTerceros() {
        const dialogRef = this.dialog.open(TerceroModalComponent, {
            width: '800px',
            height: '600px',
            maxHeight: '800px',
            data: {
                // cuenta: cuenta
            }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // this.getData();
            if (result) {
                // let match = this.imagenSS.filter((value) => {
                //     return value.id == result.id;
                // });

                // console.log(match);
                // console.log(result);
                // console.log(this.imagenSS);
            }

        });
    }
    
    openPresupuesto(element: any) {
        // const win = window.open(`http://localhost:8000/gasto/${element.id}`, '_blank');
        const win = window.open(`${environment.serverUrl}/gasto/${element.id}`, '_blank');
        win.focus();
    }
    save() {
        this.sending = true;
        const data = this.obs.value;

        const id = this.data.income ? `id: ${data.id},` : '';
        const id_empresa = `id_empresa: ${data.id_empresa},`;
        const sucursal_id = `sucursal_id: ${data.sucursal_id},`;
        const nombre = data.nombre && data.nombre != '' ? `nombre: "${data.nombre}",` : '';

        const valor = data.valor !== '' && data.valor != null ? `valor: ${this.amount},` : 'valor: 0';
        const obs = `obs: "${data.obs}",`;
        const iva = `iva: ${0},`;
        const date = data.date != '' ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : '';
        const queryParams = `${id} ${id_empresa} ${sucursal_id} ${valor} ${obs} ${iva}  ${nombre}`;
        const queryProps = 'id, id_empresa, nombre,  valor, status';

        this.apiService.saveGasto(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close(response.data.saveGasto);
                this.openPresupuesto(response.data.saveGasto)
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
