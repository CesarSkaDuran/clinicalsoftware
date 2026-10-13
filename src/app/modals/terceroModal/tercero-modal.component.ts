import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeIn } from 'ng-animate';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { trigger, transition, useAnimation } from '@angular/animations';
import { filter, tap, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
// import { TipoComprobantesModalComponent } from '../TipoComprobantes/tipoComprobantes-modal.component';
import { CurrencyPipe } from '@angular/common';

moment.locale('es');

@Component({
  selector: 'app-tercero-modal',
  templateUrl: './tercero-modal.component.html',
  styleUrls: ['./tercero-modal.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(
        '* => *',
        useAnimation(fadeIn, {
          params: { timing: '0.4', delay: 0 }
        })
      )
    ])
  ]
})
export class TerceroModalComponent implements OnInit, AfterViewInit {
  fadeIn: any;
  sending = false;
  sended = false;

  patient = new FormGroup({
    // id: new FormControl('', []),
    // tipo_terceros: new FormControl('', [Validators.required]),
    tipo_naturaleza: new FormControl('1', [Validators.required]),
    regimen: new FormControl('2', [Validators.required]),
    nombre: new FormControl('', []),
    apellido: new FormControl('', [Validators.required]),
    // fecha_nacimiento: new FormControl('', []),
    tipo_documento: new FormControl('', []),
    documento: new FormControl('', []),
    telefono: new FormControl('', []),
    // cupo: new FormControl('', []),
    email: new FormControl('', []),
    ciudad: new FormControl('', []),
    direccion: new FormControl('', []),
    // ruta: new FormControl('', []),
    dv: new FormControl('', []),
  });
  edit= false;
  tercero: any;

  constructor(
    public dialogRef: MatDialogRef<TerceroModalComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public dialog: MatDialog,
    // private currencyPipe: CurrencyPipe
  ) { }
  tipoFilterCtrl: FormControl = new FormControl();
   filtereddataTipo: any;
  public searchingTipo = false;
  protected _onDestroy = new Subject<void>();
  ngOnInit() {
    // this.tipoComprobante();
          // this.tipoFilterCtrl.valueChanges.pipe(
      //   filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 1),
      //   tap(() => this.searchingTipo = true),
      //   takeUntil(this._onDestroy),
      //   debounceTime(500),
      //   distinctUntilChanged(),
      //   switchMap(term => this.apiService.tipoComprobante(`tipo: 2`, 'id,nombre,simple, consecutivo'))
      // ).subscribe((results: any) => {
      //   console.log(results);
      //   this.searchingTipo = false;
      //   this.filtereddataTipo.next(results.data.tipoComprobante);
      // }, error => {
      //   this.searchingTipo = false;
      // });
    if (this.data.plan) {
      this.tercero = this.data.plan;
      console.log('datos', this.data.plan)
      this.patient.setValue({

        nombre: this.data.plan.nombre ? this.data.plan.nombre : null,
        apellido: this.data.plan.apellido ? this.data.plan.apellido : null,
        // tipo_terceros: this.data.plan.tipo_terceros ? this.data.plan.tipo_terceros.toString() : 0,
        regimen: this.data.plan.regimen ? this.data.plan.regimen.toString() : null,
        tipo_naturaleza: this.data.plan.tipo_naturaleza ? this.data.plan.tipo_naturaleza.toString() : null,
        // fecha_nacimiento: this.data.plan.fecha_nacimiento ? this.data.plan.fecha_nacimiento : new Date(),
        tipo_documento: this.data.plan.tipo_documento ? this.data.plan.tipo_documento.toString() : null,
        documento: this.data.plan.documento ? this.data.plan.documento : null,
        dv: this.data.plan.dv ? this.data.plan.dv : null,
        ciudad: this.data.plan.ciudad ? this.data.plan.ciudad : null,
        direccion: this.data.plan.direccion ? this.data.plan.direccion : null,
        // ruta: this.data.plan.ruta ? this.data.plan.ruta : null,
        telefono: this.data.plan.telefono ? this.data.plan.telefono : null,
        // cupo: this.data.plan.cupo ? this.data.plan.cupo : null,
        email: this.data.plan.email ? this.data.plan.email : null,

        // status: this.data.plan.status ? this.data.plan.status.toString() : null,
      });


      // this.showOnlyName = true;

      
      this.edit = true;

    }

  }
  formattedAmount;
  amount;
  transformAmount(element) {

    this.amount = element.target.value;

    // this.formattedAmount = this.currencyPipe.transform(this.formattedAmount);

    element.target.value = this.formattedAmount;
  }
 
  ngAfterViewInit() { }

  close(params: any = null) {
    this.dialogRef.close(params);
  }
  // tipoComprobante() {
  //   this.searchingTipo = true;

  //   const queryParams = ` tipo: 2`;
  //   const queryProps = 'id,simple,nombre, consecutivo';

  //   this.apiService.tipoComprobante(queryParams, queryProps).subscribe(
  //     (result: any) => {
  //       this.searchingTipo = false;
  //       this.filtereddataTipo = result.data.tipoComprobante;


  //       console.log('afiliacionesService', result);
  //     },
  //     (error: any) => {
  //       this.searchingTipo = false;
  //       console.log(error);
  //     }
  //   );
  // }
  save() {
    this.sending = true;
    const data = this.patient.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const tipo_terceros = data.tipo_terceros != '' ? `tipo_terceros: ${data.tipo_terceros},` : '';
    const tipo_naturaleza = data.tipo_naturaleza != '' ? `tipo_naturaleza: ${data.tipo_naturaleza},` : '';
    const regimen = data.regimen != '' ? `regimen: ${data.regimen},` : '';
    const nombre = data.nombre != '' ? `nombre: "${data.nombre}",` : '';
    // const fecha_nacimiento = data.fecha_nacimiento != '' ? `fecha_nacimiento: "${moment(data.fecha_nacimiento).format('YYYY-MM-DD')}",` : '';
    const apellido = data.apellido != '' ? `apellido: "${data.apellido}",` : '';
    const tipo_documento = data.tipo_documento != '' ? `tipo_documento: ${data.tipo_documento},` : '';
    const documento = data.documento != '' ? `documento: "${data.documento}",` : '';
    const telefono = data.telefono != '' ? `telefono: "${data.telefono}",` : '';
    const ciudad = data.ciudad != '' ? `ciudad: "${data.ciudad}",` : '';
    const email = data.email != '' ? `email: "${data.email}",` : '';
    const direccion = data.direccion != '' ? `direccion: "${data.direccion}",` : '';
    const ruta = data.ruta != '' ? `ruta: "${data.ruta}",` : '';
    const dv = data.dv != '' ? `dv: "${data.dv}",` : '';
    // const cupo = data.cupo != '' ? `cupo: "${this.amount}",` : `cupo: ${this.data.plan.cupo}`;
    const queryParams = `${id} ${dv}  ${tipo_naturaleza} ${regimen} ${nombre}  ${apellido} ${tipo_documento} ${documento} ${telefono} ${ciudad} ${email} ${direccion} `;
    const queryProps =
      'id,  tipo_terceros, regimen, nombre, fecha_nacimiento, apellido, tipo_documento, email, telefono, ciudad';

    this.apiService.saveTercero(queryParams, queryProps).subscribe(
      (response: any) => {
        console.log(response);
        this.sending = false;
        this.snackBar.open('Guardado', null, {
          duration: 4000
        });

        this.close(response.data.savePatient);
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
  saveEdit() {
    this.sending = true;
    const data = this.patient.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const tipo_terceros = data.tipo_terceros != '' ? `tipo_terceros: ${data.tipo_terceros},` : '';
    const tipo_naturaleza = data.tipo_naturaleza != '' ? `tipo_naturaleza: ${data.tipo_naturaleza},` : '';
    const regimen = data.regimen != '' ? `regimen: ${data.regimen},` : '';
    const nombre = data.nombre != '' ? `nombre: "${data.nombre}",` : '';
    // const fecha_nacimiento = data.fecha_nacimiento != '' ? `fecha_nacimiento: "${moment(data.fecha_nacimiento).format('YYYY-MM-DD')}",` : '';
    const apellido = data.apellido != '' ? `apellido: "${data.apellido}",` : '';
    const tipo_documento = data.tipo_documento != '' ? `tipo_documento: ${data.tipo_documento},` : '';
    const documento = data.documento != '' ? `documento: "${data.documento}",` : '';
    const telefono = data.telefono != '' ? `telefono: "${data.telefono}",` : '';
    const ciudad = data.ciudad != '' ? `ciudad: "${data.ciudad}",` : '';
    const email = data.email != '' ? `email: "${data.email}",` : '';
    const direccion = data.direccion != '' ? `direccion: "${data.direccion}",` : '';
    const ruta = data.ruta != '' ? `ruta: "${data.ruta}",` : '';
    const dv = data.dv != '' ? `dv: "${data.dv}",` : '';
    // const cupo = data.cupo != '' ? `cupo: "${this.amount}",` : `cupo: "${data.cupo}"` ;
    const queryParams = `id:${this.data.plan.id}, ${dv}  ${tipo_naturaleza} ${regimen} ${nombre}  ${apellido} ${tipo_documento} ${documento} ${telefono} ${ciudad} ${email} ${direccion} `;
    const queryProps =
      'id,  tipo_terceros, regimen, nombre, fecha_nacimiento, apellido, tipo_documento, email, telefono, ciudad';

    this.apiService.saveTercero(queryParams, queryProps).subscribe(
      (response: any) => {
        console.log(response);
        this.sending = false;
        this.snackBar.open('Guardado', null, {
          duration: 4000
        });

        this.close(response.data.savePatient);
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
}
