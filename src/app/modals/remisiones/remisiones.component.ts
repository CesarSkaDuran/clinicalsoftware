import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';

moment.locale('es');

@Component({
    selector: 'app-remisiones',
    templateUrl: './remisiones.component.html'
})
export class RemisionComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;


    obs = new FormGroup({
        id: new FormControl('', []),
        id_medico: new FormControl('', []),

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
    remisiones: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<RemisionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }
    loadRecords() {
        this.dataAny.push(this.data.datos);
    }
    ngOnInit() {
        console.log(this.data.record_id);
        console.log(this.data.datos);
        this.loadRecords();
        this.drRemision();


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
        const id_medico = data.id_medico !== null
            ? `${data.id_medico}` : '';
        const win = window.open(`http://hcapi.clinicalsoftware.org/remision/${this.data.record_id}/${id_medico}/${this.data.datos.id}`, '_blank');
        // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
        win.focus();

        this.close(data)
    }

    drRemision() {
        this.sending = true;
        const queryParams = `status: 1,`;
        const queryProps = 'id, nombre, direccion, especializacion, telefono, direccion';

        this.apiService.getDrRemision(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;
                this.remisiones = response.data.getDrRemision;
                console.log('remision', this.remisiones)
                this.snackBar.open('Listado de Medicos Cargados', null, {
                    duration: 4000
                });

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
    saveStatus() {
        this.sending = true;
        const data = this.obs.value;
        const id = data.id ? `id: ${data.id},` : '';
        const date = data.date !== '' ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : '';
        const queryParams = `status: 1, tipo: 2, patient_id:"${this.data.patient_id}",record_id:"${this.data.record_id}", ${id} `;
        const queryProps = 'id, record_id, categoria, procedimiento, cantidad, pieza, obs';

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
