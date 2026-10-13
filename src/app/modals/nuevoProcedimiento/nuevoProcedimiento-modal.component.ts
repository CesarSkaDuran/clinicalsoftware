import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';

moment.locale('es');

@Component({
    selector: 'app-nuevoProcedimiento-modal',
    templateUrl: './nuevoProcedimiento-modal.component.html'
})
export class NuevoProcedimiento implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;
    editar = false;
    procedure = new FormGroup({
     
        nombre: new FormControl('', []),
        categoria_id: new FormControl('', []),
        valor1: new FormControl('', []),
        valor2: new FormControl('', []),
    });

    items: any[] = [];
    loading: boolean;

    constructor(
        public dialogRef: MatDialogRef<NuevoProcedimiento>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    ngOnInit() {
        console.log(this.data?.element);
        
        if (this.data?.element) {
            
            this.procedure.setValue({
                
                nombre: this.data?.element?.nombre,
                
                categoria_id: this.data?.element?.categoria_id.toString(),
                
                valor1: this.data?.element?.valor1 ? this.data?.element?.valor1 : '',
                
                valor2: this.data?.element?.valor2,
            
                }
            );

            this.editar = true;

        } 
        else 
        {
            this.editar = false;
        }

        this.getCategoria()
    }

    ngAfterViewInit() { }
    categoriaSelect: any;
    categoria: any[] = [];
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
  
    save() {
        this.sending = true;
        const data = this.procedure.value;


        const nombre = `nombre: "${data.nombre}",`;
        const categoria_id = `categoria_id: ${data.categoria_id},`;
        const valor1 = `valor1: ${data.valor1},`;
        const valor2 = `valor2: ${data.valor2},`;
        const queryParams = ` ${nombre} ${categoria_id} ${valor1} ${valor2} `;
        const queryProps = 'id';

        this.apiService.saveNuevoProcedimiento(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close(response.data.saveNuevoProcedimiento);

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

    actualizar() {
        
        this.sending = true;
        
        const data = this.procedure.value;


        const nombre = `nombre: "${data.nombre}",`;
        const categoria_id = `categoria_id: ${data.categoria_id},`;
        const valor1 = `valor1: ${data.valor1},`;
        const valor2 = `valor2: ${data.valor2},`;
        const queryParams = `id: ${this.data?.element?.id} ${nombre} ${categoria_id} ${valor1} ${valor2} `;
        const queryProps = 'id';

        this.apiService.saveNuevoProcedimiento(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close(response.data.saveNuevoProcedimiento);

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
