import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';

moment.locale('es');

@Component({
    selector: 'app-examenes',
    templateUrl: './examenes.component.html'
})
export class ExamenesComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;

    radioIntraorales: string[] = ['PERIAPICAL COMPLETO DIGITAL ', '</br> PERIACAL PARCIAL DIGITAL', '</br> OCLUSAL SUPERIOR DIGITAL', ' </br> OCLUSAL INFERIOR DIGITAL', '</br> CORONALES DER.', '</br> CORONALES IZQ.'];
    radioExtraorales: string[] = ['PARONAMICA', '</br> PERFIL', '</br> ANTERO POSTERIOR', '</br> POSTERO ANTERIOR', '</br> SENOS PARANASALES', '</br> ATM - TRANSCRANEAL DER. ', '</br>ATM - TRANSCRANEAL IZQ.', '</br> CARPOGRAMA'];
    fotoIntraorales: string[] = ['OCLUSION DE FRENTE', '</br> OCLUSION DERECHA', '</br> OCLUSION IZQUIERDA', '</br> ARCO SUPERIOR', '</br> ARCO INFERIOR', '</br> OVER-JET', '</br> OVER BITE'];
    fotoExtraorales: string[] = ['FRENTE', '</br> PERFIL DERECHO', '</br> PERFIL IZQUIERDO', '</br> SONRRISA', '</br> 3/4 DERECHO', '</br> 3/4 IZQUIERDO', '</br> LINEA 1/2 FACIAL', '</br> TAMANO NATURAL I-I', '</br> FONDO COLOR BLANCO', '</br> FONDO COLOR AZUL'];
    modelos: string[] = ['MODELOS DE ESTUDIO', '</br> MODELOS DE TRABAJO' ];
    paquete_diagnostico: string[] = ['PAQUETE DE ORTODONCIA BASICO', '</br> PAQUETE DE ORTOPEDIA'];
    cefalometria: string[] = ['DIGITAL'];
    tomografia: string[] = ['DEL DIENTE', '</br> HEMIARCO', '</br> MAXILAR SUPERIOR', '</br> MAXILA INFERIOR', '</br> ATM DER. A/C', '</br> ATM IZQ. A/C', '</br> SENOS PARANASALES-MAXILARES', '</BR> LECTURA'];
   
    obs = new FormGroup({
        id: new FormControl('', []),
        radioIntraorales: new FormControl('', []),
        radioExtraorales: new FormControl('', []),
        fotoIntraorales: new FormControl('', []),
        fotoExtraorales: new FormControl('', []),
        modelos: new FormControl('', []),
        paquete_diagnostico: new FormControl('', []),
        cefalometria: new FormControl('', []),
        tomografia: new FormControl('', []),
        obs: new FormControl('', []),

    });

    items: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<ExamenesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    ngOnInit() {
        console.log(this.data.record_id);
        if (this.data.examenes) {
            this.obs.setValue({
                id: this.data.record.id,
            });
        }
    }

    ngAfterViewInit() { }

    save() {
        this.sending = true;
        const data = this.obs.value;

        const id = data.id ? `id: ${data.id},` : '';
        const record_id = `record_id: "${this.data.record_id}",`;
        const radioIntraorales = `radioIntraorales: "${data.radioIntraorales}",`;
        const radioExtraorales = `radioExtraorales: "${data.radioExtraorales}",`;
        const fotoIntraorales = `fotoIntraorales: "${data.fotoIntraorales}",`;
        const fotoExtraorales = `fotoExtraorales: "${data.fotoExtraorales}",`;
        const obs = `obs: "${data.obs}",`;
        const modelos = `modelos: "${data.modelos}",`;
        const paquete_diagnostico = `paquete_diagnostico: "${data.paquete_diagnostico}",`;
        const cefalometria = `cefalometria: "${data.cefalometria}",`;
        const tomografia = `tomografia: "${data.tomografia}",`;
        const queryParams = `${id}, ${tomografia} ${record_id}  ${obs} ${modelos} ${paquete_diagnostico} ${cefalometria} ${radioIntraorales} ${radioExtraorales} ${fotoIntraorales} ${fotoExtraorales}`;
        const queryProps = 'id, record_id, radioIntraorales, radioExtraorales, fotoIntraorales, fotoExtraorales, quimica_sanguinea ';

        this.apiService.SaveExamenes(queryParams, queryProps).subscribe(
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
