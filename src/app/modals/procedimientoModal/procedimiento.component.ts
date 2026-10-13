import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NuevoProcedimiento } from '../nuevoProcedimiento/nuevoProcedimiento-modal.component';
import { CurrencyPipe } from '@angular/common';

moment.locale('es');

@Component({
    selector: 'app-procedimiento',
    templateUrl: './procedimiento.component.html'
})
export class ProcedimientoComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;


    obs = new FormGroup({
        id: new FormControl('', []),
        categoria: new FormControl('', []),
        procedimiento: new FormControl('', []),
        tipo_pago: new FormControl('1', []),
        valor: new FormControl(this.data?.valor_sesion, []),
        cantidad: new FormControl(1, []),
        pieza: new FormControl('', []),
        valor_sesion: new FormControl(0, []),
        otros: new FormControl('', []),
        obs: new FormControl('', []),

    });

    items: any[] = [];
    loading: boolean;
    categoriaSelect: any;
    categoria: any[] = [];
    Procedimiento: any[] = [];
    valorSelect: any;
    showOnlyName= false;
    diente=false;
    editing= false;
    dataAny: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<ProcedimientoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private currencyPipe: CurrencyPipe
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }
    loadRecords() {
        this.dataAny.push(this.data.procedimiento);
    }
    ngOnInit() {
        console.log(this.data.record_id);
        console.log(this.data.patient_id);
        console.log(this.data.diente)
        console.log(this.data.procedimiento);
        this.loadRecords();
        this.getCategoria() 
        this.getProcedimiento()

        if (this.data.procedimiento) {
            this.obs.setValue({
                id: this.data.procedimiento.id ? this.data.procedimiento.id : null,
                categoria: this.data.procedimiento.categoria ? this.data.procedimiento.categoria.toString(): null,
                procedimiento: this.data.procedimiento.procedimiento ? this.data.procedimiento.procedimiento.toString() : null,
                tipo_pago: this.data?.procedimiento?.tipo_pago ? this.data?.procedimiento?.tipo_pago.toString() : null,
                valor: this.data.procedimiento.valor ? this.data.procedimiento.valor : null,
                obs: this.data.procedimiento.obs ? '' : null,
                cantidad: this.data.procedimiento.cantidad ? this.data.procedimiento.cantidad : null,
                pieza: this.data.procedimiento.pieza ? this.data.procedimiento.pieza : null,
                valor_sesion: this.data.procedimiento.valor_sesion ? this.data.procedimiento.valor_sesion : null,
                otros: this.data.procedimiento.otros ? this.data.procedimiento.otros : null,
            });

            if (this.data.procedimiento.id) {
                this.showOnlyName = true;
                this.editing = true;
            }
        } 
        if (this.data.diente) {
            this.obs.setValue({
                id: this.data.diente.id ? this.data.diente.id : null,
                categoria: this.data.diente.categoria ? this.data.diente.categoria.toString() : null,
                procedimiento: this.data.diente.procedimiento ? this.data.diente.procedimiento.toString() : null,
                tipo_pago: this.data?.diente?.tipo_pago ? this.data?.diente?.tipo_pago.toString() : null,
                valor: this.data.diente.valor ? this.data.diente.valor.toString() : null,
                obs: this.data.diente.obs ? '' : null,
                cantidad: this.data.diente.cantidad ? 1 : null,
                valor_sesion: this.data.diente.valor_sesion ? 0: null,
                pieza: this.data.diente.diente_id ? this.data.diente.diente_id : null,
                otros: this.data.diente.otros ? this.data.diente.otros : null,
               
            });

            if (this.data.diente.id) {
                this.diente = true;
            }
        } 

    }

    ngAfterViewInit() { } 

    setCategoriaSeleccionado(index) {
        this.categoriaSelect = index;
    }
    setValorSeleccionado(index) {
        this.valorSelect = index;
        this.obs.controls.valor.setValue(index);
    }

    openModal() {
        const dialogRef = this.dialog.open(NuevoProcedimiento, {
            width: '700px',
            height: '500px',
            maxHeight: '850px',

        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) return;
            //this.loadRecords();
            this.loadRecords();
            this.getCategoria()
            this.getProcedimiento()
            console.log(result);

        });
    }

    getCategoria() {
        this.loading = true;

        const queryParams = `search: ""`;
        const queryProps = 'id,nombre';

        this.apiService.getCategoria(queryParams, queryProps).subscribe(
            (result: any) => {
                this.loading = false;
                this.categoria = result.data.getCategoria;
               

                console.log(result);
            },
            (error: any) => {
                this.loading = false;
                console.log(error);
            }
        );
    }
    getProcedimiento() {
        this.loading = true;
        const status = 2;
        const queryParams = `search: ""`;
        const queryProps = 'id, nombre, categoria_id, valor1, valor2';

        this.apiService.getProcedimientoDental(queryParams, queryProps).subscribe(
            (result: any) => {
                this.loading = false;
                this.Procedimiento = result.data.getProcedimientoDental;
              

                console.log(result);
            },
            (error: any) => {
                this.loading = false;
                console.log(error);
            }
        );
    }
    formattedAmount;
    amount;
    transformAmount(element) {
        const data = this.obs.value;

        this.amount = data.valor;

        this.formattedAmount = this.currencyPipe.transform(this.formattedAmount);

        element.target.value = this.formattedAmount;
    }
    onTypeChange(selectedType) {

        this.obs.controls.valor.setValue(this.valorSelect);
    }
    saveEvolution() {

        this.sending = true;
        const data = this.obs.value;
        if (data.tipo_pago == 1) {
        const id = data.id ? `id: ${data.id},` : '';
        const categoria = `categoria: "${this.data.procedimiento.categoria}",`;
        const procedimiento = `procedimiento: "${this.data.procedimiento.procedimiento}",`;
        const valor = `valor: ${data.valor},`;
        const cantidad = `cantidad: "${data.cantidad}",`;
        const pieza = `pieza: "${this.data.procedimiento.pieza}",`;
        const otros = `otros: "${data.otros}",`;
        const obs = `obs: "${data.obs}",`;
        const valorSession = `valor_sesion: ${data.valor_sesion},`;
        const queryParams = `tipo: 2, patient_id:"${this.data.patient_id}",record_id:"${this.data.record_id}", ${cantidad} ${valorSession} ${categoria} ${obs} ${procedimiento} ${valor}${pieza} ${otros}`;
        const queryProps = 'id,';

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
    }
    savePlanStatus() {
        this.sending = true;
        const data = this.obs.value;
        const id = this.data.diente.id ? `id: ${this.data.diente.id},` : '';
        const queryParams = `plan_status: 1,  ${id} `;
        const queryProps = 'id';

        this.apiService.saveOdontograma(queryParams, queryProps).subscribe(
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

    saveStatus(){
        this.sending = true;
        const data = this.obs.value;
        const id = data.id ? `id: ${data.id},` : '';
        if (data.tipo_pago == 1){
            const queryParams = `status: 3, tipo_pago:${1} suma_sesion: ${this.data.procedimiento.suma_sesion + 1} cantidad:"${this.data.procedimiento.cantidad - 1}"  patient_id:"${this.data.patient_id}",record_id:"${this.data.record_id}", ${id} `;
            const queryProps = 'id,';

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
        }else{
            const queryParams = `status: 3, obs:"${data.obs}" valor: ${data.valor} tipo_pago:${2} suma_sesion: ${this.data.procedimiento.suma_sesion + 1} cantidad:"${this.data.procedimiento.cantidad - 1}"  patient_id:"${this.data.patient_id}",record_id:"${this.data.record_id}", ${id} `;
            const queryProps = 'id,';

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
     
        
    }


    saveFinal() {
        this.sending = true;
        const data = this.obs.value;
        const id = data.id ? `id: ${data.id},` : '';
        const queryParams = `status: 3, suma_sesion: ${this.data.procedimiento.suma_sesion + this.data.procedimiento.suma_sesion} cantidad: "0",  patient_id:"${this.data.patient_id}",record_id:"${this.data.record_id}", ${id} `;
        const queryProps = 'id,';

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

    save() {

        this.sending = true;
        const data = this.obs.value;

        const id = data.id ? `id: ${data.id},` : '';
        const categoria = `categoria: "${data.categoria}",`;
        const procedimiento = `procedimiento: "${data.procedimiento}",`;
        const valor = `valor: ${data.valor },`;
        const cantidad = `cantidad: "${data.cantidad}",`;
        const pieza = `pieza: "${data.pieza}",`;
        const otros = `otros: "${data.otros}",`;
        const obs = `obs: "${data.obs}",`;
        const valorSession = `valor_sesion: ${data.valor_sesion},`;
        const queryParams = `tipo: 1, patient_id:"${this.data.patient_id}",record_id:"${this.data.record_id}",  ${cantidad} ${valorSession} ${categoria} ${obs} ${procedimiento} ${valor}  ${pieza} ${otros} `;
        const queryProps = 'id,';

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
    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void { }
}
