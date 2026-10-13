import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';

moment.locale('es');

@Component({
    selector: 'app-procedure-modal',
    templateUrl: './procedure-modal.component.html'
})
export class ProcedureModalComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;

    procedure = new FormGroup({
        id: new FormControl('', []),
        code: new FormControl('', []),
        description: new FormControl('', []),
        tipo_procedimiento: new FormControl('', []),
    });

    items: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<ProcedureModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    ngOnInit() {
        
    }

    ngAfterViewInit() { }

    save() {
        this.sending = true;
        const data = this.procedure.value;

        
        const code = `code: "${data.code}",`;
        const description = `description: "${data.description}",`;
        const tipo_procedimiento = `tipo_procedimiento: "${data.tipo_procedimiento}",`;
        const queryParams = ` ${code} ${description} ${tipo_procedimiento} `;
        const queryProps = 'id';

        this.apiService.saveProcedure(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close(response.data.saveProcedure);

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
