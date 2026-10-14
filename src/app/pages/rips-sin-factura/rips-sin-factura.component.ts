import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RipsSinFacturaService } from './rips-sin-factura.service';

interface RipsCatalogOption {
  code: string;
  label: string;
}

@Component({
  selector: 'vex-rips-sin-factura',
  templateUrl: './rips-sin-factura.component.html',
  styleUrls: ['./rips-sin-factura.component.scss']
})
export class RipsSinFacturaComponent implements OnInit, OnDestroy {
  readonly patientDocumentOptions: RipsCatalogOption[] = [
    { code: 'AS', label: 'Adulto sin identificación' },
    { code: 'CC', label: 'Cédula de ciudadanía' },
    { code: 'CD', label: 'Carné diplomático' },
    { code: 'CE', label: 'Cédula de extranjería' },
    { code: 'CN', label: 'Certificado de nacido vivo' },
    { code: 'DE', label: 'Documento extranjero' },
    { code: 'MS', label: 'Menor sin identificación' },
    { code: 'PA', label: 'Pasaporte' },
    { code: 'PE', label: 'Permiso especial de permanencia' },
    { code: 'PT', label: 'Permiso por protección temporal' },
    { code: 'RC', label: 'Registro civil' },
    { code: 'SC', label: 'Salvoconducto de permanencia' },
    { code: 'TI', label: 'Tarjeta de identidad' }
  ];
  readonly professionalDocumentOptions: RipsCatalogOption[] = [
    { code: 'CC', label: 'Cédula de ciudadanía' },
    { code: 'CD', label: 'Carné diplomático' },
    { code: 'CE', label: 'Cédula de extranjería' },
    { code: 'DE', label: 'Documento extranjero' },
    { code: 'PA', label: 'Pasaporte' },
    { code: 'PE', label: 'Permiso especial de permanencia' },
    { code: 'PT', label: 'Permiso por protección temporal' },
    { code: 'SC', label: 'Salvoconducto de permanencia' }
  ];
  readonly userTypeOptions: RipsCatalogOption[] = [
    { code: '01', label: 'Contributivo cotizante' },
    { code: '02', label: 'Contributivo beneficiario' },
    { code: '03', label: 'Contributivo adicional' },
    { code: '04', label: 'Subsidiado' },
    { code: '05', label: 'No afiliado' },
    { code: '06', label: 'Especial o excepción cotizante' },
    { code: '07', label: 'Especial o excepción beneficiario' },
    { code: '08', label: 'Persona privada de la libertad (Fondo Nacional de Salud)' },
    { code: '09', label: 'Tomador o amparado ARL' },
    { code: '10', label: 'Tomador o amparado SOAT' },
    { code: '11', label: 'Tomador o amparado de plan voluntario de salud' },
    { code: '12', label: 'Particular' },
    { code: '13', label: 'Especial o excepción no cotizante (Ley 352 de 1997)' },
    { code: '14', label: 'Lesionado en accidente de tránsito sin seguro SOAT' }
  ];
  readonly sexOptions: RipsCatalogOption[] = [
    { code: 'F', label: 'Femenino' },
    { code: 'I', label: 'Indeterminado o intersexual' },
    { code: 'M', label: 'Masculino' }
  ];
  readonly zoneOptions: RipsCatalogOption[] = [
    { code: '01', label: 'Rural' },
    { code: '02', label: 'Urbana' }
  ];
  readonly incapacityOptions: RipsCatalogOption[] = [
    { code: 'NO', label: 'No' },
    { code: 'SI', label: 'Sí' }
  ];
  readonly modalityOptions: RipsCatalogOption[] = [
    { code: '01', label: 'Intramural' },
    { code: '02', label: 'Extramural: unidad móvil' },
    { code: '03', label: 'Extramural: domiciliaria' },
    { code: '04', label: 'Extramural: jornada de salud' },
    { code: '06', label: 'Telemedicina interactiva' },
    { code: '07', label: 'Telemedicina no interactiva' },
    { code: '08', label: 'Telemedicina telexperticia' },
    { code: '09', label: 'Telemedicina telemonitoreo' }
  ];
  readonly serviceGroupOptions: RipsCatalogOption[] = [
    { code: '01', label: 'Consulta externa' },
    { code: '02', label: 'Apoyo diagnóstico y complementación terapéutica' },
    { code: '03', label: 'Internación' },
    { code: '04', label: 'Quirúrgico' },
    { code: '05', label: 'Atención inmediata' }
  ];
  readonly purposeOptions: RipsCatalogOption[] = [
    { code: '11', label: 'Valoración integral para promoción y mantenimiento' },
    { code: '12', label: 'Detección temprana de enfermedad general' },
    { code: '13', label: 'Detección temprana de enfermedad laboral' },
    { code: '14', label: 'Protección específica' },
    { code: '15', label: 'Diagnóstico' },
    { code: '16', label: 'Tratamiento' },
    { code: '17', label: 'Rehabilitación' },
    { code: '18', label: 'Paliación' },
    { code: '19', label: 'Planificación familiar y anticoncepción' },
    { code: '20', label: 'Promoción y apoyo a la lactancia materna' },
    { code: '21', label: 'Atención básica de orientación familiar' },
    { code: '22', label: 'Atención para el cuidado preconcepcional' },
    { code: '23', label: 'Atención para el cuidado prenatal' },
    { code: '24', label: 'Interrupción voluntaria del embarazo' },
    { code: '25', label: 'Atención del parto y puerperio' },
    { code: '26', label: 'Atención para el cuidado del recién nacido' },
    { code: '27', label: 'Atención para el seguimiento del recién nacido' },
    { code: '28', label: 'Preparación para la maternidad y la paternidad' },
    { code: '29', label: 'Promoción de actividad física' },
    { code: '30', label: 'Promoción de la cesación del tabaquismo' },
    { code: '31', label: 'Prevención del consumo de sustancias psicoactivas' },
    { code: '32', label: 'Promoción de la alimentación saludable' },
    { code: '33', label: 'Promoción para el ejercicio de derechos sexuales y reproductivos' },
    { code: '34', label: 'Promoción para el desarrollo de habilidades para la vida' },
    { code: '35', label: 'Promoción de estrategias de afrontamiento de sucesos vitales' },
    { code: '36', label: 'Promoción de la sana convivencia y el tejido social' },
    { code: '37', label: 'Promoción de ambiente seguro y protección ambiental' },
    { code: '38', label: 'Promoción del empoderamiento para el derecho a la salud' },
    { code: '39', label: 'Promoción de prácticas de crianza y cuidado para la salud' },
    { code: '40', label: 'Promoción de la capacidad de agencia y cuidado de la salud' },
    { code: '41', label: 'Desarrollo de habilidades cognitivas' },
    { code: '42', label: 'Intervención colectiva' },
    { code: '43', label: 'Modificación de la estética corporal con fines estéticos' },
    { code: '44', label: 'Otra' }
  ];
  readonly consultationCauseOptions: RipsCatalogOption[] = [
    { code: '21', label: 'Accidente de trabajo' },
    { code: '22', label: 'Accidente en el hogar' },
    { code: '23', label: 'Accidente de tránsito de origen común' },
    { code: '24', label: 'Accidente de tránsito de origen laboral' },
    { code: '25', label: 'Accidente en el entorno educativo' },
    { code: '26', label: 'Otro tipo de accidente' },
    { code: '27', label: 'Evento catastrófico de origen natural' },
    { code: '28', label: 'Lesión por agresión' },
    { code: '29', label: 'Lesión autoinfligida' },
    { code: '30', label: 'Sospecha de violencia física' },
    { code: '31', label: 'Sospecha de violencia psicológica' },
    { code: '32', label: 'Sospecha de violencia sexual' },
    { code: '33', label: 'Sospecha de negligencia y abandono' },
    { code: '34', label: 'IVE por peligro para la salud o vida de la mujer' },
    { code: '35', label: 'IVE por malformación congénita incompatible con la vida' },
    { code: '36', label: 'IVE por violencia sexual, incesto, inseminación artificial o transferencia de óvulo fecundado no consentida' },
    { code: '37', label: 'Evento adverso en salud' },
    { code: '38', label: 'Enfermedad general' },
    { code: '39', label: 'Enfermedad laboral' },
    { code: '40', label: 'Promoción y mantenimiento de la salud: intervención individual' },
    { code: '41', label: 'Intervención colectiva' },
    { code: '42', label: 'Atención de población materno perinatal' },
    { code: '43', label: 'Riesgo ambiental' },
    { code: '44', label: 'Otros eventos catastróficos' },
    { code: '45', label: 'Accidente por mina antipersonal (MAP)' },
    { code: '46', label: 'Accidente por artefacto explosivo improvisado (AEI)' },
    { code: '47', label: 'Accidente por munición sin explotar (MUSE)' },
    { code: '48', label: 'Otra víctima del conflicto armado colombiano' },
    { code: '49', label: 'IVE por decisión de la persona gestante hasta semana 24' }
  ];
  readonly diagnosisTypeOptions: RipsCatalogOption[] = [
    { code: '01', label: 'Impresión diagnóstica' },
    { code: '02', label: 'Confirmado nuevo' },
    { code: '03', label: 'Confirmado repetido' }
  ];
  readonly entryRouteOptions: RipsCatalogOption[] = [
    { code: '01', label: 'Demanda espontánea' },
    { code: '02', label: 'Derivado de consulta externa' },
    { code: '03', label: 'Derivado de urgencias' },
    { code: '04', label: 'Derivado de hospitalización' },
    { code: '05', label: 'Derivado de sala de cirugía' },
    { code: '06', label: 'Derivado de sala de partos' },
    { code: '07', label: 'Recién nacido en la institución' },
    { code: '08', label: 'Recién nacido en otra institución' },
    { code: '09', label: 'Derivado de hospitalización domiciliaria' },
    { code: '10', label: 'Derivado de atención domiciliaria' },
    { code: '11', label: 'Derivado de telemedicina' },
    { code: '12', label: 'Derivado de jornada de salud' },
    { code: '13', label: 'Referido de otra institución' },
    { code: '14', label: 'Contrarreferido de otra institución' }
  ];
  readonly collectionConceptOptions: RipsCatalogOption[] = [
    { code: '01', label: 'Copago' },
    { code: '02', label: 'Cuota moderadora' },
    { code: '03', label: 'Pago compartido en plan voluntario de salud' },
    { code: '05', label: 'No aplica' }
  ];

  form: FormGroup;
  jsonPreview = '';
  errorMessage = '';
  successMessage = '';
  configSaved = false;
  savingConfig = false;
  savingReport = false;
  private configuredObligado = '';
  private configuredCodPrestador = '';
  private formSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private ripsService: RipsSinFacturaService) {
    this.form = this.formBuilder.group({
      numDocumentoIdObligado: ['', [Validators.required, Validators.maxLength(12)]],
      codPrestadorPredeterminado: ['', Validators.maxLength(12)],
      numNota: ['1', [Validators.required, Validators.maxLength(30)]],
      usuarios: this.formBuilder.array([this.createUser()])
    });
  }

  get users(): FormArray {
    return this.form.get('usuarios') as FormArray;
  }

  ngOnInit() {
    this.formSubscription = this.form.valueChanges.subscribe(() => {
      this.jsonPreview = '';
      this.successMessage = '';
      const obligatedId = (this.form.get('numDocumentoIdObligado').value || '').trim();
      const codPrestador = (this.form.get('codPrestadorPredeterminado').value || '').trim();
      if (this.configuredObligado && (obligatedId !== this.configuredObligado || codPrestador !== this.configuredCodPrestador)) {
        this.configSaved = false;
      }
    });

    this.ripsService.getProviderConfig().subscribe(config => {
      this.configuredObligado = config.numDocumentoIdObligado || '';
      this.configuredCodPrestador = config.codPrestador || '';
      this.configSaved = !!this.configuredObligado;
      this.form.patchValue({
        numDocumentoIdObligado: this.configuredObligado,
        codPrestadorPredeterminado: this.configuredCodPrestador,
        numNota: config.nextNumNota || '1'
      }, { emitEvent: false });
      this.applyDefaultCodPrestador();
    }, error => this.errorMessage = this.getErrorMessage(error, 'No se pudo cargar la configuración RIPS.'));
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

  saveProviderConfig() {
    const obligatedId = this.form.get('numDocumentoIdObligado');
    const codPrestador = this.form.get('codPrestadorPredeterminado');
    this.errorMessage = '';
    this.successMessage = '';

    if (obligatedId.invalid || codPrestador.invalid) {
      obligatedId.markAsTouched();
      codPrestador.markAsTouched();
      return;
    }

    this.savingConfig = true;
    this.ripsService.saveProviderConfig(obligatedId.value.trim(), codPrestador.value.trim()).subscribe(config => {
      this.configuredObligado = config.numDocumentoIdObligado || '';
      this.configuredCodPrestador = config.codPrestador || '';
      this.configSaved = !!this.configuredObligado;
      this.form.patchValue({ numNota: config.nextNumNota }, { emitEvent: false });
      const currentObligado = (this.form.get('numDocumentoIdObligado').value || '').trim();
      const currentCodPrestador = (this.form.get('codPrestadorPredeterminado').value || '').trim();
      this.configSaved = currentObligado === this.configuredObligado && currentCodPrestador === this.configuredCodPrestador;
      this.applyDefaultCodPrestador();
      this.successMessage = this.configSaved
        ? 'Configuración del obligado guardada.'
        : 'El formulario cambió mientras se guardaba; vuelve a guardar la configuración.';
      this.savingConfig = false;
    }, error => {
      this.errorMessage = this.getErrorMessage(error, 'No se pudo guardar la configuración.');
      this.savingConfig = false;
    });
  }

  saveAndDownload() {
    this.errorMessage = '';
    this.successMessage = '';

    const obligatedId = (this.form.get('numDocumentoIdObligado').value || '').trim();
    const codPrestador = (this.form.get('codPrestadorPredeterminado').value || '').trim();
    if (!this.configSaved || obligatedId !== this.configuredObligado || codPrestador !== this.configuredCodPrestador) {
      this.errorMessage = 'Guarda primero la configuración del obligado y del prestador.';
      return;
    }

    this.generateJson();
    if (!this.jsonPreview) {
      return;
    }

    this.savingReport = true;
    this.ripsService.saveReport(JSON.parse(this.jsonPreview)).subscribe(report => {
      this.jsonPreview = JSON.stringify(report.payload, null, 2);
      this.form.patchValue({ numNota: report.nextNumNota }, { emitEvent: false });
      this.successMessage = `Reporte guardado con numNota ${report.numNota}.`;
      this.savingReport = false;
      this.downloadJson(report.numNota);
    }, error => {
      this.errorMessage = this.getErrorMessage(error, 'No se pudo guardar el reporte RIPS.');
      this.savingReport = false;
    });
  }

  private downloadJson(numNota: string) {
    const safeNumNota = numNota.replace(/[^a-zA-Z0-9_-]/g, '_');
    const blob = new Blob([this.jsonPreview], { type: 'application/json;charset=utf-8' });
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = `RIPS-SF-${safeNumNota}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }

  private getErrorMessage(error: any, fallback: string): string {
    return error && error.error && error.error.message ? error.error.message : fallback;
  }

  private applyDefaultCodPrestador() {
    this.users.controls.forEach((_, userIndex) => {
      this.servicesFor(userIndex).controls.forEach(service => {
        if (!service.get('codPrestador').value) {
          service.get('codPrestador').setValue(this.configuredCodPrestador, { emitEvent: false });
        }
      });
    });
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
      codPrestador: [this.configuredCodPrestador, [Validators.required, Validators.maxLength(12)]],
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
