import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RipsSinFacturaService } from './rips-sin-factura.service';

@Component({
  selector: 'vex-rips-sin-factura',
  templateUrl: './rips-sin-factura.component.html',
  styleUrls: ['./rips-sin-factura.component.scss']
})
export class RipsSinFacturaComponent implements OnInit, OnDestroy {
  form: FormGroup;
  jsonPreview = '';
  private formSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private ripsService: RipsSinFacturaService) {
    this.form = this.formBuilder.group({
      numDocumentoIdObligado: ['', [Validators.required, Validators.maxLength(12)]],
      numNota: ['', [Validators.required, Validators.maxLength(30)]],
      usuarios: this.formBuilder.array([this.createUser()])
    });
  }

  get users(): FormArray {
    return this.form.get('usuarios') as FormArray;
  }

  ngOnInit() {
    this.formSubscription = this.form.valueChanges.subscribe(() => this.jsonPreview = '');
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  servicesFor(userIndex: number): FormArray {
    return this.users.at(userIndex).get('servicios') as FormArray;
  }

  addUser() {
    this.users.push(this.createUser());
  }

  removeUser(index: number) {
    if (this.users.length > 1) {
      this.users.removeAt(index);
    }
  }

  addService(userIndex: number) {
    this.servicesFor(userIndex).push(this.createService());
  }

  removeService(userIndex: number, serviceIndex: number) {
    const services = this.servicesFor(userIndex);
    if (services.length > 1) {
      services.removeAt(serviceIndex);
    }
  }

  generateJson() {
    this.jsonPreview = '';
    this.markControlTreeTouched(this.form);

    if (this.form.invalid || this.users.controls.some(user => this.servicesFor(this.users.controls.indexOf(user)).length === 0)) {
      return;
    }

    const payload = this.ripsService.build(this.form.getRawValue());
    this.jsonPreview = JSON.stringify(payload, null, 2);
  }

  downloadJson() {
    if (!this.jsonPreview) {
      return;
    }

    const numNota = this.form.get('numNota').value.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const blob = new Blob([this.jsonPreview], { type: 'application/json;charset=utf-8' });
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = `RIPS-SF-${numNota}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }

  private createUser(): FormGroup {
    return this.formBuilder.group({
      tipoDocumentoIdentificacion: ['', Validators.required],
      numDocumentoIdentificacion: ['', [Validators.required, Validators.maxLength(20)]],
      tipoUsuario: ['', [Validators.required, Validators.maxLength(2)]],
      fechaNacimiento: ['', Validators.required],
      codSexo: ['', [Validators.required, Validators.maxLength(2)]],
      codPaisResidencia: ['170', Validators.required],
      codMunicipioResidencia: ['', [Validators.required, Validators.maxLength(5)]],
      codZonaTerritorialResidencia: ['', [Validators.required, Validators.maxLength(2)]],
      incapacidad: ['', Validators.required],
      codPaisOrigen: ['170', Validators.required],
      registroSIRAS: [''],
      servicios: this.formBuilder.array([this.createService()])
    });
  }

  private createService(): FormGroup {
    const service = this.formBuilder.group({
      type: ['consulta', Validators.required],
      codPrestador: ['', [Validators.required, Validators.maxLength(12)]],
      fechaInicioAtencion: ['', Validators.required],
      numAutorizacion: [''],
      idMIPRES: [''],
      codCups: ['', [Validators.required, Validators.maxLength(6)]],
      viaIngresoServicioSalud: [''],
      modalidadGrupoServicioTecSal: ['', [Validators.required, Validators.maxLength(2)]],
      grupoServicios: ['', [Validators.required, Validators.maxLength(2)]],
      codServicio: ['', [Validators.required, Validators.maxLength(4)]],
      finalidadTecnologiaSalud: ['', [Validators.required, Validators.maxLength(2)]],
      causaMotivoAtencion: [''],
      codDiagnosticoPrincipal: ['', Validators.required],
      codDiagnosticoRelacionado1: [''],
      codDiagnosticoRelacionado2: [''],
      codDiagnosticoRelacionado3: [''],
      codDiagnosticoRelacionado: [''],
      codComplicacion: [''],
      tipoDiagnosticoPrincipal: [''],
      profesionalTipoDocumento: ['', Validators.required],
      profesionalNumeroDocumento: ['', [Validators.required, Validators.maxLength(20)]],
      vrServicio: ['', [Validators.required, Validators.min(0)]],
      conceptoRecaudo: ['', [Validators.required, Validators.maxLength(2)]],
      valorPagoModerador: ['0', [Validators.required, Validators.min(0)]],
      numFEVPagoModerador: ['']
    });

    this.updateServiceValidators(service, 'consulta');
    service.get('type').valueChanges.subscribe(type => this.updateServiceValidators(service, type));
    return service;
  }

  private updateServiceValidators(service: FormGroup, type: string) {
    this.setRequired(service, 'viaIngresoServicioSalud', type === 'procedimiento');
    this.setRequired(service, 'causaMotivoAtencion', type === 'consulta');
    this.setRequired(service, 'tipoDiagnosticoPrincipal', type === 'consulta');
  }

  private setRequired(group: FormGroup, controlName: string, required: boolean) {
    const control = group.get(controlName);
    control.setValidators(required ? [Validators.required] : []);
    control.updateValueAndValidity({ emitEvent: false });
  }

  private markControlTreeTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach(key => {
      const control = group.controls[key];
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markControlTreeTouched(control);
      }
    });
  }
}
