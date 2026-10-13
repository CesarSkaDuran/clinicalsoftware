import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';

moment.locale('es');

@Component({
    selector: 'app-fechaConsulta',
    templateUrl: './fechaConsulta.component.html'
})
export class FechaConsultaComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;

    obs = new FormGroup({
        id: new FormControl('', []),
        created_at: new FormControl(null, [])
    });

    items: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<FechaConsultaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    ngOnInit() {
        if (this.data.fecha) {
            console.log(this.data.fecha);
            this.obs.setValue({
                id: this.data.fecha.id,
                created_at: this.data.fecha.created_at
            });
        }
    }

    ngAfterViewInit() { }

    save() {
        this.sending = true;
        const data = this.obs.value;
        const id = data.id ? `id: ${data.id},` : '';
        const created_at = `created_at: "${moment(data.created_at).format('YYYY-MM-DD')}",`;
        const queryParams = `${id}, identification: "${this.data.fecha.identification}", ${created_at}`;
        const queryProps = 'id, created_at';

        this.apiService.saveFechaConsulta(queryParams, queryProps).subscribe(
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
