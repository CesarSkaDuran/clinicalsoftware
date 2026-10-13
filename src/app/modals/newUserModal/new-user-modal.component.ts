import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-new-user-modal',
    templateUrl: './new-user-modal.component.html'
})
export class NewUserModalComponent implements OnInit, OnDestroy {
    constructor(
        public dialogRef: MatDialogRef<NewUserModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    ngOnInit() {
        console.log(this.data);
    }

    close(params: any = null) {
        this.dialogRef.close();
    }

    ngOnDestroy(): void { }
}
