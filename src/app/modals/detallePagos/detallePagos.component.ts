import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoreService } from 'src/app/core/core.service';
import { Router } from '@angular/router';
import { CredentialsService } from 'src/app/core';
import { environment } from 'src/environments/environment';

export interface pg {
  tipo_servicio: string;
  cantidad: number;
  liquidacion: string;
  servicio: string;
  total: string;
}

const PAGOS: pg[] = [
  {tipo_servicio: ' Lorem ipsum, dolor sit amet consectetur adipisicing elit.', cantidad: 3, liquidacion: 'H', servicio:'asdsadsad', total:"533131"},
  {tipo_servicio: 'Recusandae nostrum molestias inventore quibusdam.', cantidad: 5, liquidacion: 'He', servicio:'asdsadsad', total:"533131"},
  {tipo_servicio: 'Veritatis accusantium quibusdam, repellendus hic', cantidad: 10, liquidacion: 'Li', servicio:'asdsadsad', total:"533131"}
];

@Component({
  selector: 'vex-detallePagos',
  templateUrl: './detallePagos.component.html',
  styleUrls: ['./detallePagos.component.scss']
})

export class DetallePagosModalComponent implements OnInit {

  filters = new FormGroup({
    medico: new FormControl('', [Validators.required]),
    banco_id: new FormControl('', [Validators.required])
  });



  displayedColumns: string[] = ['tipo_servicio', 'cantidad', 'liquidacion'];
  dataSource = PAGOS;
  dataPago: any;
  loadingRecords: boolean;
  PagosTotal: any[] = [];
  totales: any;
  servicios: any;
  sending: boolean;
  status: any;
  BancoTotal: any[] = [];
  remisiones: any;

  constructor(
    public dialogRef: MatDialogRef<DetallePagosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private coreService: CoreService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private credentialsService: CredentialsService,
  ) {

  }
  close(params: any = null) {
    this.dialogRef.close(params);
  }
  openPresupuesto() {
    // const win = window.open(`http://localhost:8000/presupuesto/${this.id = this.route.snapshot.paramMap.get('id')}`, '_blank');
    const win = window.open(`${environment.serverUrl}/cobro/${this.dataPago.id }`, '_blank');
    win.focus();
  }
  loadPago() {
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `cobro_id:${this.dataPago.id}`;
    const queryProps =
      'id, cobro_id, nombre, valor, status, created_at';
    this.apiService.getDetalleCobro(queryParams, queryProps).subscribe(
      (response: any) => {
        this.PagosTotal = response.data.getDetalleCobro;
        this.totales = this.PagosTotal.reduce((
          acc,
          obj,
        ) => acc + (obj.valor++), 0
        );
      },
      error => {
        this.loadingRecords = false;
        this._snackBar.open('Error.', null, {
          duration: 4000
        });
        console.log(error);
      }
    );
  }
  loadBanco() {
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `search:" "`;
    const queryProps =
      'id,  nombre, monto_actual';
    this.apiService.getBanco(queryParams, queryProps).subscribe(
      (response: any) => {
        this.BancoTotal = response.data.getBanco;
        // this.totales = this.PagosTotal.reduce((
        //   acc,
        //   obj,
        // ) => acc + (obj.valor++), 0
        // );
      },
      error => {
        this.loadingRecords = false;
        this._snackBar.open('Error.', null, {
          duration: 4000
        });
        console.log(error);
      }
    );
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
        this._snackBar.open('Listado de Medicos Cargados', null, {
          duration: 4000
        });

      },
      (error: any) => {
        this.sending = false;
        this._snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.dataPago = this.data.params;
    this.status = this.data.params.status;
    this.loadPago();
    this.loadBanco();
    this.drRemision()
    console.log('datos modal', this.dataPago );
  }
  Finalizar(){
    // this.openPresupuesto();
    this.saveCuentaCobro();
  }
  saveCuentaCobro() {
    const data = this.filters.value;
    this.sending = true;
    const queryParams = `id:${this.dataPago.id}, banco_id: ${data.banco_id} doctor:${data.medico} `;
    const queryProps = 'id';

    this.apiService.saveCuentaCobro(queryParams, queryProps).subscribe(
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        console.log(queryParams)
        this.openPresupuesto();
        this.close()
      },
      (error: any) => {
        this.sending = false;
        this._snackBar.open('Seleccione el banco.', null, {
          duration: 4000
        });
        console.log(error);
      }
    );
  }

}
