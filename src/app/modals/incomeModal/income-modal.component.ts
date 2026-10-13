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
    selector: 'app-income-modal',
    templateUrl: './income-modal.component.html'
})
export class IncomeModalComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;
    displayedColumns: string[] = ['nombre_empleado', 'documento_empleado', 'contrato', 'afiliacion'];
    obs = new FormGroup({
        id: new FormControl('', []),
        id_empresa: new FormControl('', [Validators.required]),
        nombre: new FormControl('', []),
        dataHoy: new FormControl('', [Validators.required]),
        valor: new FormControl('', [Validators.required]),
        sucursal_id: new FormControl(1, []),
        obs: new FormControl('', []),
        cuatroxmil: new FormControl(0, []),
        iva: new FormControl('0', [Validators.required])
    });

    items: any[] = [];
    sucursal: any[] = [];
    searchingEps: boolean;
    detalleServicioOne: any;

    constructor(
        public dialogRef: MatDialogRef<IncomeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private currencyPipe: CurrencyPipe
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }
    PlanFilterCtrl: FormControl = new FormControl();
    protected _onDestroy = new Subject<void>();
    public filtereddataEps: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    formattedAmount;
    amount;
    transformAmount(element) {

        this.amount = element.target.value;

        this.formattedAmount = this.currencyPipe.transform(this.formattedAmount);

        element.target.value = this.formattedAmount;
    }
    ngOnInit() {
        this.loadDetalleServicio();
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

    totalServicio = 0;
    totalServicio1 = 0
    totalServicio2 = 0
    detalleServicio: any[] = [];
    loadDetalleServicio() {
        console.log('loading records...');

        this.loadingPropect = true;
        // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `search: " " `;
        const queryProps =
            'id,  id_empresa, empresa{id, nombre} cuatroxmil, iva, valor, nombre, obs, created_at';
        this.apiService.getTemporal(queryParams, queryProps).subscribe(
            (response: any) => {

                this.detalleServicio = response.data.getTemporal;
                this.detalleServicioOne = response.data.getTemporal[0];
                console.log('data 1', this.detalleServicioOne)
                this.totalServicio = this.detalleServicio.reduce((
                    acc,
                    obj,
                ) => acc + (obj.valor == 1 ? 0 : obj.valor++), 0
                );

                this.totalServicio1 = this.detalleServicio.reduce((
                    acc,
                    obj,
                ) => acc + (this.detalleServicioOne.cuatroxmil == 1 ? obj.valor / 1000 * 4 : 0), 0
                );
                this.totalServicio2 = this.detalleServicio.reduce((
                    acc,
                    obj,
                ) => acc + (this.detalleServicioOne.iva == 19 ? obj.valor * 0.19 : obj.valor * 0), 0
                );
            },
            error => {
                this.loadingPropect = false;
                this.snackBar.open('Error.', null, {
                    duration: 4000
                });
                console.log(error);
            }
        );
    }
    // loadEmpresaPaginator() {
    //     this.loadingPropect = true;
    //     const date =
    //         this.filters.value.date !== '' && this.filters.value.date !== null
    //             ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
    //             : '';
    //     const date2 =
    //         this.filters.value.date2 !== '' && this.filters.value.date2 !== null
    //             ? `date2: "${moment(this.filters.value.date2).format('YYYY-MM-DD')}",`
    //             : '';
    //     const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    //     const queryParams = ` limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date} ${date2}`;
    //     const queryProps =
    //         'data{ id, created_at, empleados{id, id_afiliacion, email, }, cuenta{id, valor, nombre, status}, afiliacion_id, status, contacto, telContacto, tipoEmpresa, razon_social, direccion, email, departamento, ciudad, numDocumento, dv, telEmpresaMovil, telEmpresaFijo, representanteLegal, contacto, email_responsable, email_contacto, telefono_responsable, arl, riesgo, caja_cf, iva}, total';

    //     this.apiService.getEmpresaPagination(queryParams, queryProps).subscribe(
    //         (response: any) => {
    //             this.total = response.data.empresaPagination.total;
    //             this.data = response.data.empresaPagination.data;
    //             this.dataEmpresaAny = response.data.empresaPagination.data;
    //             this.resultsLength = response.data.empresaPagination.total;
    //             this.dataSource.data = this.data;

    //             this.totalAfiliados = this.dataEmpresaAny.reduce((
    //                 acc,
    //                 obj,
    //             ) => acc + (obj.empleados.length++), 0
    //             );
    //             this.loadingPropect = false;
    //             console.log('estos son los datos para la empresa ', this.data)

    //         },
    //         error => {
    //             this.loadingPropect = false;
    //             this.snackBar.open('Error.', null, {
    //                 duration: 4000
    //             });
    //             console.log(error);
    //         }
    //     );
    // }
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
    // sucursales() {
    //     console.log('loading records...');
    //     this.loadingPropect = true;
    //     const queryParams = `afiliacion_id: ${0}`;
    //     const queryProps =
    //         'id, nombre, departamento';
    //     this.apiService.getSucursales(queryParams, queryProps).subscribe(
    //         (response: any) => {
    //             this.sucursal = response.data.sucursales;
    //         },
    //         error => {
    //             this.loadingPropect = false;
    //             this.snackBar.open('Error.', null, {
    //                 duration: 4000
    //             });
    //             console.log(error);
    //         }
    //     );
    // }
    openPresupuesto(element: any) {
        // const win = window.open(`http://localhost:8000/cobro/${element.id}`, '_blank');
        const win = window.open(`${environment.serverUrl}/cobro/${element.id}`, '_blank');
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
        const obs = data.obs && data.obs != '' ? `obs: "${data.obs}",` : '';
        const iva = data.iva && data.iva != '' ? `iva: ${data.iva},` : 0;
        const cuatroxmil = data.cuatroxmil && data.cuatroxmil != '' ? `cuatroxmil: ${data.cuatroxmil},` : '';
        const date = data.date != '' ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : '';
        const queryParams = `${id} ${id_empresa} ${sucursal_id} ${valor} ${obs} ${iva}  ${nombre} ${cuatroxmil}`;
        const queryProps = 'id, id_empresa, nombre,  valor, status';

        this.apiService.saveTemporal(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;
                this.loadDetalleServicio()
                // this.close(response.data.saveIncome);
                // this.openPresupuesto(response.data.saveIncome)
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

    deleteAll() {
        this.sending = true;
        const data = this.obs.value;

        const queryParams = `deleteAll: ${1}`;
        const queryProps = 'id, id_empresa, nombre,  valor, status';

        this.apiService.saveTemporal(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;
                this.loadDetalleServicio()
                // this.close(response.data.saveIncome);
                // this.openPresupuesto(response.data.saveIncome)
                // this.snackBar.open('Guardado', null, {
                //     duration: 4000
                // });
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
    // saveCuentaCobro() {
    //     this.sending = true;
    //     const data = this.obs.value;

    //     const id = data.id ? `id: ${data.id},` : '';
    //     const queryParams = `${id} id_empresa: ${data.id_empresa}, valor: ${this.totalServicio} nombre:"Servicio Permanente" iva: ${this.currentRecord.iva} `;
    //     const queryProps = 'id';

    //     this.apiService.saveCuentaCobro(queryParams, queryProps).subscribe(
    //         (response: any) => {
    //             this.sending = false;

    //             // this._snackBar.open('Guardado', null, {
    //             //     duration: 4000
    //             // });
    //             console.log(queryParams)

    //         },
    //         (error: any) => {
    //             this.sending = false;
    //             // this._snackBar.open('Error.', null, {
    //             //     duration: 4000
    //             // });
    //             console.log(error);
    //         }
    //     );
    // }
    saveCobro() {
        this.sending = true;
        const data = this.obs.value;

        const id = this.data.income ? `id: ${data.id},` : '';
        const id_empresa = `id_empresa: ${this.detalleServicioOne.id_empresa},`;
        const sucursal_id = `sucursal_id: ${1},`;
        const nombre = `nombre: "MULTIPLE",`;
        const valor = `valor: ${this.totalServicio},`;
        const obs = data.obs && data.obs != '' ? `obs: "${data.obs}",` : '';
        const iva = data.iva && data.iva != '' ? `iva: ${data.iva},` : `iva: ${0}`;
        const cuatroxmil = data.cuatroxmil && data.cuatroxmil != '' ? `cuatroxmil: ${data.cuatroxmil},` : `cuatroxmil: ${this.detalleServicioOne.cuatroxmil}`;
        const date = data.date != '' ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : '';
        const queryParams = `${id} ${id_empresa} ${cuatroxmil} ${sucursal_id} ${valor} ${obs} ${iva}  ${nombre}`;
        const queryProps = 'id';

        this.apiService.saveIncome(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;
                // this.loadDetalleServicio()
                this.close(data);
                // this.openPresupuesto(response.data.saveCuentaCobro)
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
