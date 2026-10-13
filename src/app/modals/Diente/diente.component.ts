import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';

moment.locale('es');

@Component({
    selector: 'app-diente',
    templateUrl: './diente.component.html'
})
export class DienteComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;


    obs = new FormGroup({
        id: new FormControl('', []),
        corona: new FormControl('', []),
        corona_provisional: new FormControl('', []),
        endodoncia: new FormControl('', []),
        ausente: new FormControl('', []),
        restauracion: new FormControl('', []),
        implante: new FormControl('', []),
        perno_munon: new FormControl('', []),
        otros: new FormControl('', []),
        protesis_removible: new FormControl('', []),
        amalgama: new FormControl('', []),
        sellante: new FormControl('', []),
        diente_sano: new FormControl('', []),
        caries: new FormControl('', []),
        infeccion_pulpar: new FormControl('', []),
        fractura: new FormControl('', []),
        movilidad: new FormControl('', []),
        residuo_radical: new FormControl('', []),
        erosion: new FormControl('', []),
        desgaste: new FormControl('', []),
        cuello: new FormControl('', []),
        pieza_completa: new FormControl('', []),
        Mezial: new FormControl('', []),
        distal: new FormControl('', []),
        oclusal: new FormControl('', []),
        palatina: new FormControl('', []),
        lingual: new FormControl('', []),
        exodoncia: new FormControl('', []),
        vestibular: new FormControl('', []),
        cervical: new FormControl('', []),
        obs: new FormControl('', []),

    });

    items: any[] = [];
    valorSelect: any;

    constructor(
        public dialogRef: MatDialogRef<DienteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    ngOnInit() {
        console.log(this.data.record_id);
        console.log(this.data.diente);
        // if (this.data.examenes) {
        //     this.obs.setValue({
        //         id: this.data.record.id,
        //     });
        // }
    }
    setValorSeleccionado(index) {
        this.valorSelect = index;
    }

    ngAfterViewInit() { }

    save() {
        this.sending = true;
        const data = this.obs.value;

        const id = data.id ? `id: ${data.id},` : '';
        const corona = `corona: "${data.corona}",`;
        const corona_provisional = `corona_provisional: "${data.corona_provisional}",`;
        const endodoncia = `endodoncia: "${data.endodoncia}",`;
        const ausente = `ausente: "${data.ausente}",`;
        const restauracion = `restauracion: "${data.restauracion}",`;
        const implante = `implante: "${data.implante}",`;
        const perno_munon = `perno_munon: "${data.perno_munon}",`;
        const protesis_removible = `protesis_removible: "${data.protesis_removible}",`;
        const amalgama = `amalgama: "${data.amalgama}",`;
        const sellante = `sellante: "${data.sellante}",`;
        const diente_sano = `diente_sano: "${data.diente_sano}",`;
        const caries = `caries: "${data.caries}",`;
        const infeccion_pulpar = `infeccion_pulpar: "${data.infeccion_pulpar}",`;
        const fractura = `fractura: "${data.fractura}",`;
        const movilidad = `movilidad: "${data.movilidad}",`;
        const residuo_radical = `residuo_radical: "${data.residuo_radical}",`;
        const erosion = `erosion: "${data.erosion}",`;
        const desgaste = `desgaste: "${data.desgaste}",`;
        const cuello = `cuello: "${data.cuello}",`;
        const pieza_completa = `pieza_completa: "${data.pieza_completa}",`;
        const Mezial = `Mezial: "${data.Mezial}",`;
        const distal = `distal: "${data.distal}",`;
        const oclusal = `oclusal: "${data.oclusal}",`;
        const palatina = `palatina: "${data.palatina}",`;
        const lingual = `lingual: "${data.lingual}",`;
        const vestibular = `vestibular: "${data.vestibular}",`;
        const cervical = `cervical: "${data.cervical}",`;
        const exodoncia = `exodoncia: "${data.exodoncia}",`;
        const otros = `otros: "${data.otros}",`;
        const obs = `obs: "${data.obs}",`;
        const queryParams = `record_id:"${this.data.record_id}", status: 1, diente_id:${this.data.diente},  ${id}, ${otros} ${corona} ${obs} ${corona_provisional} ${endodoncia} ${ausente} ${restauracion} ${implante} ${perno_munon} ${protesis_removible} ${amalgama} ${sellante} ${diente_sano} ${caries} ${infeccion_pulpar} ${fractura} ${movilidad} ${residuo_radical} ${erosion} ${desgaste} ${cuello} ${pieza_completa} ${Mezial} ${distal} ${oclusal} ${palatina} ${lingual} ${vestibular} ${exodoncia} ${cervical}`;
        const queryProps = 'id, otros, corona, record_id, diente_id';

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

    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void { }
}
