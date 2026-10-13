import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of, Observable, ReplaySubject, Subject } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import * as moment from 'moment';

import { RecordsService } from '../records/records.service';

import { Lightbox } from 'ngx-lightbox';

import icDelete from '@iconify/icons-ic/twotone-delete';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDone from '@iconify/icons-ic/twotone-done';
import icBlock from '@iconify/icons-ic/twotone-block';
import icRemove from '@iconify/icons-ic/twotone-remove';

import icHistory from '@iconify/icons-feather/file-text';
import icPhysic from '@iconify/icons-feather/eye';
import icConclusion from '@iconify/icons-feather/life-buoy';
import icEvolution from '@iconify/icons-feather/trending-up';
import icMultimedia from '@iconify/icons-feather/image';
import icPopq from '@iconify/icons-feather/share-2';
import icControl from '@iconify/icons-feather/heart';
import icInfo from '@iconify/icons-feather/book-open';
import icPatient from '@iconify/icons-feather/users';
import icPrint from '@iconify/icons-ic/twotone-print';
import icChat from '@iconify/icons-ic/voice-chat';
import icCall from '@iconify/icons-ic/videocam';
import baselineCloudDownload from '@iconify/icons-ic/baseline-cloud-download';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialog } from '@angular/material/dialog';
import { CredentialsService } from 'src/app/core';
import { ApiService } from 'src/app/core/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PregnanciesModalComponent } from 'src/app/modals/pregnanciesModal/pregnancies-modal.component';
import { CitologiesModalComponent } from 'src/app/modals/citologiesModal/citologies-modal.component';
import { CoombsModalComponent } from 'src/app/modals/coombsModal/coombs-modal.component';
import { htoModalComponent } from 'src/app/modals/htoModal/hto-modal.component';
import { HbModalComponent } from 'src/app/modals/hbModal/hb-modal.component';
import { CitModalComponent } from 'src/app/modals/citModal/cit-modal.component';
import { VaccinesModalComponent } from 'src/app/modals/vaccinesModal/vaccines-modal.component';
import { ObsModalComponent } from 'src/app/modals/obsModal/obs-modal.component';
import { EvolutionModalComponent } from 'src/app/modals/evolutionModal/evolution-modal.component';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { ControlModalComponent } from 'src/app/modals/controlModal/control-modal.component';
import { MultimediaModalComponent } from 'src/app/modals/multimediaModal/multimedia-modal.component';
import { Patient } from 'src/app/models/patient';
import { PatientFormModalComponent } from 'src/app/modals/patientFormModal/patient-form-modal.component';
import { PhotoModalComponent } from 'src/app/modals/photoModal/photo-modal.component';
import { ChatMessage } from 'src/app/models/chat-message';
import { MedicineModalComponent } from 'src/app/modals/medicineModal/medicine-modal.compnent';
import { NewUserModalComponent } from 'src/app/modals/newUserModal/new-user-modal.component';
import { ProcedureModalComponent } from 'src/app/modals/procedureModal/procedure-modal.component';
import { Evolution } from 'src/app/models/evolution';

import { addProcedureModalComponent } from 'src/app/modals/addprocedureModal/addProcedure-modal.component';
import { diagnosticModalComponent } from 'src/app/modals/diagnosticModal/diagnostic-modal.component';
import { PatientsModalComponent } from 'src/app/modals/patientsModal/patients-modal.component';
import { ExamenesComponent } from 'src/app/modals/examenes/examenes.component';
import { DienteComponent } from 'src/app/modals/Diente/diente.component';
import { DienteInferiorComponent } from 'src/app/modals/Diente/dienteInferior.component';
import { ProcedimientoComponent } from 'src/app/modals/procedimientoModal/procedimiento.component';
import baselineOpenInNew from '@iconify/icons-ic/baseline-open-in-new';
import baselineRemoveRedEye from '@iconify/icons-ic/baseline-remove-red-eye';
import baselineLocalHospital from '@iconify/icons-ic/baseline-local-hospital';
import { DateModalComponent } from 'src/app/modals/dateModal/dateModal.component';
import { RemisionComponent } from 'src/app/modals/remisiones/remisiones.component';
import { ConsentimientoPacienteModalComponent } from 'src/app/modals/consentimientoPaciente/consentimientoPaciente-modal.component';
@Component({
  selector: 'app-user-record',
  templateUrl: './user-record.component.html',
  styleUrls: ['./user-record.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})
export class UserRecordComponent implements OnInit, OnDestroy {
  displayedControlColumns: string[] = ['week', 'weight', 'ta', 'pam', 'au', 'pression', 'fcf', 'edema', 'options'];
  controlsData: any[] = [];
  chatMessages: ChatMessage[] = [
    new ChatMessage().deserialize({
        id: 2,
        message: `i'm fine. Thanks`,
        fromMe: false,
        date: moment('2020-09-04 11:11:52').toDate(),
        senderId: '',
        isFile: false,
        hasBeenReaded: false
      }),
    new ChatMessage().deserialize({
      id: 2,
      message: 'Hello. How are you today?',
      fromMe: true,
      date: moment('2020-09-04 11:12:32').toDate(),
      senderId: '',
      isFile: false,
      hasBeenReaded: false
    }),
  ];
  
  categoriaSelect: any;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  color = true;
  color1 = true;
  color2 = true;
  color3 = true;
  color4 = true;
  color5 = true;
  color6 = true;
  color7 = true;
  color8 = true;

  color9 = true;
  color10 = true;
  color11 = true;
  color12 = true;
  color13 = true;
  color14 = true;
  color15 = true;
  color16 = true;

  colors = true;
  colors1 = true;
  colors2 = true;
  colors3 = true;
  colors4 = true;
  colors5 = true;
  colors6 = true;
  colors7 = true;
  colors8 = true;

  colors9 = true;
  colors10 = true;
  colors11 = true;
  colors12 = true;
  colors13 = true;
  colors14 = true;
  colors15 = true;
  colors16 = true;

  examen_periodontal = new FormGroup({
    bag_v1: new FormControl('', []),
    bag_v2: new FormControl('', []),
    bag_p: new FormControl('', []),
    bag_l: new FormControl('', []),
    Select_an_option: new FormControl('', []),
    red: new FormControl('', []),
    red1: new FormControl('', []),
    green: new FormControl('', []),
    green1: new FormControl('', []),
    p1_observations: new FormControl('', []),
    diente11: new FormControl('', []),
    diente12: new FormControl('', []),
    diente13: new FormControl('', []),
    diente14: new FormControl('', []),
    diente15: new FormControl('', []),
    diente16: new FormControl('', []),
    diente17: new FormControl('', []),
    diente18: new FormControl('', []),

    diente21: new FormControl('', []),
    diente22: new FormControl('', []),
    diente23: new FormControl('', []),
    diente24: new FormControl('', []),
    diente25: new FormControl('', []),
    diente26: new FormControl('', []),
    diente27: new FormControl('', []),
    diente28: new FormControl('', []),

    diente31: new FormControl('', []),
    diente32: new FormControl('', []),
    diente33: new FormControl('', []),
    diente34: new FormControl('', []),
    diente35: new FormControl('', []),
    diente36: new FormControl('', []),
    diente37: new FormControl('', []),
    diente38: new FormControl('', []),

    diente41: new FormControl('', []),
    diente42: new FormControl('', []),
    diente43: new FormControl('', []),
    diente44: new FormControl('', []),
    diente45: new FormControl('', []),
    diente46: new FormControl('', []),
    diente47: new FormControl('', []),
    diente48: new FormControl('', []),

    diente51: new FormControl('', []),
    diente52: new FormControl('', []),
    diente53: new FormControl('', []),
    diente54: new FormControl('', []),
    diente55: new FormControl('', []),

    e_observations: new FormControl('', [])



  });

  icDelete = icDelete;
  icEdit = icEdit;
  icDone = icDone;
  icBlock = icBlock;
  icRemove = icRemove;
  icCall = icCall;
  baselineCloudDownload = baselineCloudDownload;
  icHistory = icHistory;
  icPhysic = icPhysic;
  icConclusion = icConclusion;
  icEvolution = icEvolution;
  icMultimedia = icMultimedia;
  icPopq = icPopq;
  icControl = icControl;
  icInfo = icInfo;
  icPatient = icPatient;
  icPrint = icPrint;
  icChat = icChat;
  sending = false;
  searchText = '';
  resultsLength = 0;
  loadingControls = false;
  currentRecord: any = null;
  currentPatient: Patient;
  evolution_1: Evolution;
  loading = false;
  chatIsOpened = false;
  chatIsExpanded = false;
  baselineRemoveRedEye = baselineRemoveRedEye;
  baselineOpenInNew = baselineOpenInNew;
  baselineLocalHospital = baselineLocalHospital;
  uploadForm: FormGroup;

  public uploader: FileUploader = new FileUploader({
    isHTML5: true,
    url: 'https://hcapi.clinicalsoftware.org/v1/actions/recordMultimedia'
  });

  details = new FormGroup({
    id: new FormControl('', []),
    motive: new FormControl('', [Validators.required]),
    current_illness: new FormControl('', []),
    menarche: new FormControl('', []),
    cycles: new FormControl('', []),
    record_fur: new FormControl('', []),
    record_g: new FormControl('', []),
    record_p: new FormControl('', []),
    record_v: new FormControl('', []),
    record_a: new FormControl('', []),
    record_pp: new FormControl('', []),
    record_up: new FormControl('', []),
    record_fpp: new FormControl('', []),
    record_prs: new FormControl('', []),
    amenorrhea: new FormControl('', []),
    amenorrhea_text: new FormControl('', []),
  });

  resumen = new FormGroup({
    id: new FormControl('', []),
    esqueletico: new FormControl('', []),
    dental: new FormControl('', []),
    funcional: new FormControl('', []),
    estetico: new FormControl('', []),
    periodontal: new FormControl('', []),
    estetica_facial: new FormControl('', []),
    estetica_dental: new FormControl('', []),
    oclusion_funcional: new FormControl('', []),
    atm: new FormControl('', []),
    periodoncia: new FormControl('', []),
    requerimiento_paciente: new FormControl('', []),
    plan_tratamiento: new FormControl('', []),
    limitacion: new FormControl('', []),
    pronostico: new FormControl('', []),
    interconsultas: new FormControl('', []),
    radiografias: new FormControl('', []),
  });

  physical = new FormGroup({
    id: new FormControl('', []),
    physical_ta: new FormControl('', []),
    physical_fc: new FormControl('', []),
    weight: new FormControl('', []),
    height: new FormControl('', []),
    head: new FormControl('', []),
    // head: new FormControl('Normo céfalo, escleras anictéricas conjuntivas normo crómicas', []),
    neck: new FormControl('', []),
    // neck: new FormControl('Móvil sin adenopatías', []),
    thorax: new FormControl('', []),
    pregnancy: new FormControl('', []),
    exams: new FormControl('', []),
    sao: new FormControl('', []),
    temperature: new FormControl('', []),
    tension: new FormControl('', []),
    mental: new FormControl('', []),
    skin: new FormControl('', []),
    pulm: new FormControl('', []),
    abdomen: new FormControl('', []),
    extremities: new FormControl('', []),
    neurol: new FormControl('', []),
    imc: new FormControl('', []),
    otros: new FormControl('', []),
    ta: new FormControl('', []),
    spo2: new FormControl('', []),
    // pulm: new FormControl('tórax normo expansible ruidos cardiacos rítmicos sin soplos, ruidos respiratorios sin sobre agregados.', []),
    // abdomen: new FormControl('ruidos intestinales presentes blando depresible , no doloroso a la palpación , no masas ni megalias.', []),
    // extremities: new FormControl('eutróficas sin edemas, móviles', []),
    // neurol: new FormControl('alerta ,orientado, sigue ordenes, pupilas isocoricas reactivas a la luz, sin déficit sensitivo o motor aparente, ROT', []),
  });

  laboratory = new FormGroup({
    id: new FormControl('', []),
    patient_group: new FormControl('', []),
    patient_rh: new FormControl('', []),
    partner_group: new FormControl('', []),
    partner_rh: new FormControl('', [])
  });

  birth = new FormGroup({
    id: new FormControl('', []),
    date: new FormControl('', []),
    time: new FormControl('', []),
    type: new FormControl('', []),
    episiotomy: new FormControl('', []),
    alum: new FormControl('', []),
    blood_loss: new FormControl('', []),
    oxytocic: new FormControl('', []),
    anesthesia: new FormControl('', []),
    sex: new FormControl('', []),
    weight: new FormControl('', []),
    height: new FormControl('', []),
    size: new FormControl('', []),
    observations: new FormControl('', [])
  });

  labor = new FormGroup({
    id: new FormControl('', []),
    date: new FormControl('', []),
    time: new FormControl('', []),
    labor_ta: new FormControl('', []),
    labor_fcf: new FormControl('', []),
    membranes: new FormControl('', []),
    presentation: new FormControl('', []),
    observations: new FormControl('', [])
  });

  conclusion = new FormGroup({
    id: new FormControl('', []),
    surgical: new FormControl('', []),
    current_illness: new FormControl('', []),
    pathological: new FormControl('', []),
    notes: new FormControl('', []),
    diagnosis: new FormControl('', []),
    tests: new FormControl('', []),
    behavior: new FormControl('', []),
    process: new FormControl('', []),
    pharmacological: new FormControl('', []),
    family: new FormControl('', []),
    allergies: new FormControl('', []),
    diagnostic: new FormControl('', []),
    toxicologist: new FormControl('', []),
    occupational: new FormControl('', []),
    diagnostic_type: new FormControl('', []),
    external_cause: new FormControl('', []),
    purpose: new FormControl('', []),
    procedure: new FormControl('', []),
    authorization_number: new FormControl('', []),

    //nuevas cirugia plastica
    eructivas: new FormControl('', []),
    cualCirugia_plastica: new FormControl('', []),
    cirugia_plastica: new FormControl('', []),
    enfermedades_vasculares: new FormControl('', []),
    artritis: new FormControl('', []),
    diabetes: new FormControl('', []),
    hepatitis: new FormControl('', []),
    enfermedades_pulmonares: new FormControl('', []),
    flebitis: new FormControl('', []),
    transfusiones_sanguineas: new FormControl('', []),
    otro_cirugia: new FormControl('', []),
    cigarrillo: new FormControl('', []),
    alcohol: new FormControl('', []),
    problemas_articulares: new FormControl('', []),
    marcapasos: new FormControl('', []),
    presion_arterial: new FormControl('', []),
    infecciones: new FormControl('', []),
    cancer: new FormControl('', []),
    pregunta_ejercicio: new FormControl('', []),
    pregunta_dieta: new FormControl('', []),
    pregunta_corporal: new FormControl('', []),
    anomalias_congenitas: new FormControl('', []),
    cancer_familiar: new FormControl('', []),
    diabetes_familiar: new FormControl('', []),
    enfermedades_cardiacas: new FormControl('', []),
    tension: new FormControl('', []),
    embarazos: new FormControl('', []),
    hijos: new FormControl('', []),
    abortos: new FormControl('', []),
    ulcera_peptica: new FormControl('', []),
    g: new FormControl('', []),
    p: new FormControl('', []),
    c: new FormControl('', []),
    a: new FormControl('', []),
    problemas_tiroideos: new FormControl('', []),

    //odontologia
    labios: new FormControl('', []),
    mucosa: new FormControl('', []),
    frenillos: new FormControl('', []),
    paladar: new FormControl('', []),
    lengua: new FormControl('', []),
    piso_boca: new FormControl('', []),
    glandula: new FormControl('', []),
    dolor_muscular: new FormControl('', []),
    dolor_articular: new FormControl('', []),
    alteracion_movimiento: new FormControl('', []),
    maloclusiones: new FormControl('', []),
    crecimiento_desarrollo: new FormControl('', []),
    faseta_desgaste: new FormControl('', []),
    respirador_oral: new FormControl('', []),
    succion_digital: new FormControl('', []),
    lengua_protactil: new FormControl('', []),
    queliofagia: new FormControl('', []),
    fumador: new FormControl('', []),
    onicofagia: new FormControl('', []),
    hallazgo: new FormControl('', []),
    cambio_forma: new FormControl('', []),
    cambio_tamano: new FormControl('', []),
    cambio_numero: new FormControl('', []),
    cambio_color: new FormControl('', []),
    cambio_posicion: new FormControl('', []),
    impacto: new FormControl('', []),
    sesibilidad: new FormControl('', []),
    sangrado: new FormControl('', []),
    movilidad: new FormControl('', []),
    reseciones: new FormControl('', []),
    bolsa: new FormControl('', []),
    calculos: new FormControl('', []),
    abscesos: new FormControl('', []),
    erosion: new FormControl('', []),

  });

  evolution = new FormGroup({
    id: new FormControl('', []),
    details: new FormControl('', [])
  });

  popq = new FormGroup({
    id: new FormControl('', []),
    popq_Aa: new FormControl('', []),
    popq_Ba: new FormControl('', []),
    popq_C: new FormControl('', []),
    popq_gh: new FormControl('', []),
    popq_pb: new FormControl('', []),
    popq_tvl: new FormControl('', []),
    popq_Ap: new FormControl('', []),
    popq_Bp: new FormControl('', []),
    popq_D: new FormControl('', [])
  });
  patient = new FormGroup({
    id: new FormControl('', []),
    created_at: new FormControl('', []),
  });
  showOnlyName = false;
  orderBy = 'created_at';
  order = 'desc';
  limit = 50;
  offset = 0;
  mes: any = moment();
  date: any = moment();

  mesActual = ()=> {
    const today = new Date();
    let d = today.getDate();
    this.mes = d;
   
    console.log('dia', this.mes)
  }
  diagFilterCtrl: FormControl = new FormControl();
  public filteredServerSideDiagnoses: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();
  public searchingDiagnoses = false;

  procFilterCtrl: FormControl = new FormControl();
  public filteredServerSideProcedures: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public searchingProcedures = false;

  controlForm = new FormGroup({  
    id: new FormControl('', []),
    control: new FormControl('', []),

  });

  public patientFilterCtrl: FormControl = new FormControl();

  public filteredtableData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  
  novedad: any = {};
  tableData: any []=[];
  id: any;
  patient_id: any;
  displayedColumnsEvolucion: string[] = ['id', 'procedimiento', 'pieza', 'comentario', 'fecha', 'valor',  'acciones'];
  displayedColumnsTratamiento: string[] = ['id', 'procedimiento',  'pieza','comentario', 'fecha',  'valor', 'abono', 'estado', 'acciones'];
  displayedColumns: string[] = ['fecha', 'arcadia', 'pieza', 'caras', 'status', 'comentario', 'options'];
  patientsModalIsOpen = false;
  dataSource: any []=[];
  dataAny: { id: number; fecha: string; pieza: string; caras: string; status: string; }[];
  odontograma: any [] = [];
  odontogramaInferior: any[] = [];
  recordIdentification: string;
  planTratamiento: any[] = [];
  loadingRecords: boolean;
  evolutionTratamiento: any[] = [];
  total: number;
  totalEvolution: number;
  tratamientoTrue= false;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private recordsService: RecordsService,
    private credentialsService: CredentialsService,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private _lightbox: Lightbox,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
  }
  save() {

    this.sending = true;
    const data = this.controlForm.value;

    console.log(data);
    //const propect_id = `propect_id: ${data.id},`;
    if (data.control) {
      this.router.navigate([`/app/records/view/${this.currentRecord.patient.identification}/${data.control}`]);
      
    }

  }

  loadRecords() {
    this.dataAny = [
      {
        id: 1,
        pieza: '1',
        fecha: '2020-07-20',
        caras: 'Palatinas',
        status: 'Caries superficial',

      },
      {
        id: 1,
        pieza: '1',
        fecha: '2020-07-20',
        caras: 'Palatinas',
        status: 'Caries superficial',

      },

    ];
  }
  openPatientsModal(user: any = null) {
    if (!this.patientsModalIsOpen) {
      const dialogRef = this.dialog.open(PatientsModalComponent, {
        width: '460px',
        height: '562px',
        maxHeight: '800px',
              data: {
            user: user
        }
      });

      this.patientsModalIsOpen = true;

      dialogRef.afterClosed().subscribe((result: any) => {
        console.log('patients modal closed');
        this.patientsModalIsOpen = false;

        if (result.created) {
          localStorage.setItem('userCreated', 'true');
        }

        if (result) {
          this.selectRecord(result.record);
        }
      });
    }
  }
  
  ngOnInit() {
    // set cached record if exist
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    // this.loadExamenes();
    this.loadRecords();
    this.dataSource;
    console.log('examenes', this.route.snapshot.paramMap.get('recordId'))
    this.mesActual();
    this.getDientes();
    // this.getDiente17();
    // this.getDiente16();
    // this.getDiente15();
    // this.getDiente14();
    // this.getDiente13();
    // this.getDiente12();
    // this.getDiente11();
    
    // this.getDiente28();
    // this.getDiente27();
    // this.getDiente26();
    // this.getDiente25();
    // this.getDiente24();
    // this.getDiente23();
    // this.getDiente22();
    // this.getDiente21();

    // this.getDiente48();
    // this.getDiente47();
    // this.getDiente46();
    // this.getDiente45();
    // this.getDiente44();
    // this.getDiente43();
    // this.getDiente42();
    // this.getDiente41();

    // this.getDiente38();
    // this.getDiente37();
    // this.getDiente36();
    // this.getDiente35();
    // this.getDiente34();
    // this.getDiente33();
    // this.getDiente32();
    // this.getDiente31();
    
     this.cadenaSeparador();
    // this.getEvolution()
    this.setRecordFromCache();
    this.getRecordControl();
    this.getOdontograma();
    this.getEvolutionTratamiento();
    this.getProcedimientoPaciente();
    this.getConsentimiento();
    
    let record$ = this.route.paramMap.pipe(switchMap((params: ParamMap) => of(this.route.snapshot.paramMap.get('recordId'))));
    this.patient_id = this.route.snapshot.paramMap.get('recordPatient');
    this.recordIdentification = this.route.snapshot.paramMap.get('recordId');
    record$.subscribe(recordId => {
      this.getRecord(recordId);
      this.novedad;
      console.log('datos de detalle', this.getRecord);
      // this.getRecordMultimedia(recordId);

      this.uploader.setOptions({
        additionalParameter: {
          record_id: recordId
        },
        headers: [
          {
            name: 'authorization',
            value: `Bearer ${this.credentialsService.credentials.access_token}`
          }
        ]
      });
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (file) => { this.getRecordMultimedia(this.currentRecord.identification) };

    this.uploadForm = this.fb.group({
      document: [null, [Validators.required]],
    });

    this.diagFilterCtrl.valueChanges.pipe(
      filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 3),
      tap(() => this.searchingDiagnoses = true),
      takeUntil(this._onDestroy),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => this.apiService.getDiagnoses(`search: "${term}"`, 'id,cod_four,des_four'))
    ).subscribe((results:any) => {
      console.log(results);
      this.searchingDiagnoses = false;
      this.filteredServerSideDiagnoses.next(results.data.diagnoses);
    }, error => {
      this.searchingDiagnoses = false;
    });

    this.procFilterCtrl.valueChanges.pipe(
      filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 3),
      tap(() => this.searchingProcedures = true),
      takeUntil(this._onDestroy),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => this.apiService.getProcedures(`search: "${term}"`, 'id,code,description'))
    ).subscribe((results: any) => {
      console.log(results);
      this.searchingProcedures = false;
      this.filteredServerSideProcedures.next(results.data.procedures);
    }, error => {
      this.searchingProcedures = false;
    });

    this.patientFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterControl();
      });
  }
  protected filterControl() {
    if (!this.tableData) {
      return;
    }
    // get the search keyword
    let search = this.patientFilterCtrl.value;
    if (!search) {
      this.filteredtableData.next(this.tableData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredtableData.next(
      this.tableData.filter(patient => patient.name.toLowerCase().indexOf(search) > -1)
    );
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
    // this.diagFilterCtrl.valueChanges.pipe(
      // debounceTime(500),
      // distinctUntilChanged(),
      // switchMap(term => this.jobService.licenseSearch(term))
    // ).subscribe(results => this.jobs = results);
    // this.openPregnanciesModal();

  setRecordFromCache() {
    let currentRecord = this.recordsService.getCurrentRecordFromCache();

    this.setCurrentRecord(currentRecord);
  }

  setCurrentRecord(record: any) {
    this.currentRecord = record;
    this.loadControls();

    if (record?.details) {
      this.details.setValue({
        id: record?.details?.id,
        motive: record?.details?.motive ? record?.details?.motive.replace(/<br>/g, '\n') : '',
        current_illness: record?.details?.current_illness ? record?.details?.current_illness.replace(/<br>/g, '\n') : '',
        menarche: record?.details?.menarche,
        cycles: record?.details?.cycles,
        record_fur: record?.details?.record_fur,
        record_g: record?.details?.record_g,
        record_p: record?.details?.record_p,
        record_v: record?.details?.record_v,
        record_a: record?.details?.record_a,
        record_pp: record?.details?.record_pp,
        record_up: record?.details?.record_up,
        record_fpp: record?.details?.record_fpp,
        record_prs: record?.details?.record_prs,
        amenorrhea: record?.details?.amenorrhea,
        amenorrhea_text: ''
      });

      if (record?.details.record_fur) {
        this.setAmenhorrea(record?.details?.record_fur);
      }
      // this.details.setValue(record?.details?);
      // this.details.controls.record_fur.setValue(moment(record?.details?.record_fur).toISOString());
    }
    if (record.resumen) {
      this.resumen.setValue({
        id: record?.resumen?.id,
        esqueletico: record?.resumen?.esqueletico ? record?.resumen?.esqueletico.replace(/<br>/g, '\n') : '',
        dental: record?.resumen?.dental ? record?.resumen?.dental.replace(/<br>/g, '\n') : '',
        funcional: record?.resumen?.funcional,
        estetico: record?.resumen?.estetico,
        periodontal: record?.resumen?.periodontal,
        estetica_facial: record?.resumen?.estetica_facial,
        estetica_dental: record?.resumen?.estetica_dental,
        oclusion_funcional: record?.resumen?.oclusion_funcional,
        atm: record?.resumen?.atm,
        periodoncia: record?.resumen?.periodoncia,
        requerimiento_paciente: record?.resumen?.requerimiento_paciente,
        plan_tratamiento: record?.resumen?.plan_tratamiento,
        limitacion: record?.resumen?.limitacion,
        pronostico: record?.resumen?.pronostico,
        interconsultas: record?.resumen?.interconsultas,
        radiografias: record?.resumen?.radiografias,
      });

      if (record?.details?.periodontal) {
        this.setAmenhorrea(record?.details?.periodontal);
      }
      // this.details.setValue(record?.details?);
      // this.details.controls.record_fur.setValue(moment(record?.details?.record_fur).toISOString());
    }
    if (record.physical) {
      // this.physical.setValue(record.physical);
      this.physical.setValue(
        {
          id: record?.physical.id,
          physical_ta: record?.physical.physical_ta,
          physical_fc: record?.physical.physical_fc,
          weight: record?.physical.weight,
          height: record?.physical.height,
          head: record?.physical.head ? record?.physical.head : '',
          // head: record?.physical.head ? record?.physical.head : 'Normo céfalo, escleras anictéricas conjuntivas normo crómicas',
          // neck: record?.physical.neck ? record?.physical.neck : '',
          neck: record?.physical.neck ? record?.physical.neck : 'Móvil sin adenopatías',
          thorax: record?.physical.thorax,
          pregnancy: record?.physical.pregnancy,
          exams: record?.physical.exams ? record?.physical.exams.replace(/<br>/g, '\n') : '',
          sao: record?.physical.sao ? record?.physical.sao : '',
          temperature: record?.physical.temperature ? record?.physical.temperature : '',
          tension: record?.physical.tension ? record?.physical.tension : '',
          mental: record?.physical.mental ? record?.physical.mental : '',
          skin: record?.physical.skin ? record?.physical.skin : '',
          // pulm: record?.physical.pulm ? record?.physical.pulm.replace(/<br>/g, '\n') : 'tórax normo expansible ruidos cardiacos rítmicos sin soplos, ruidos respiratorios sin sobre agregados.',
          // abdomen: record?.physical.abdomen ? record?.physical.abdomen.replace(/<br>/g, '\n') : 'ruidos intestinales presentes blando depresible , no doloroso a la palpación , no masas ni megalias.',
          // extremities: record?.physical.extremities ? record?.physical.extremities.replace(/<br>/g, '\n') : 'eutróficas sin edemas, móviles',
          // neurol: record?.physical.neurol ? record?.physical.neurol.replace(/<br>/g, '\n') : 'alerta ,orientado, sigue ordenes, pupilas isocoricas reactivas a la luz, sin déficit sensitivo o motor aparente, ROT',
          pulm: record?.physical.pulm ? record?.physical.pulm.replace(/<br>/g, '\n') : '',
          abdomen: record?.physical.abdomen ? record?.physical.abdomen.replace(/<br>/g, '\n') : '',
          extremities: record?.physical.extremities ? record?.physical.extremities.replace(/<br>/g, '\n') : '',
          neurol: record?.physical.neurol ? record?.physical.neurol.replace(/<br>/g, '\n') : '',
          imc: record?.physical.imc ? record?.physical.imc.replace(/<br>/g, '\n') : '',
          otros: record?.physical.otros ? record?.physical.otros.replace(/<br>/g, '\n') : '',
          ta: record?.physical.ta ? record?.physical.ta : '',
          spo2: record?.physical.spo2 ? record?.physical.spo2 : '',
        }
      );
    }

    if (record.patient) {
      this.currentPatient = record?.patient;
    }



    if (record.evolution) {
      this.evolution = record?.evolution;
      this.evolution.setValue({
        id: record?.evolution.id,
        details: record?.evolution.details.replace(/<br>/g, '\n')
      });
    }

    if (record.laboratory) {
      this.laboratory.setValue(record.laboratory);
    }

    if (record.birth) {
      this.birth.setValue(record.birth);
    }

    if (record.labor) {
      this.labor.setValue(record.labor);
    }

    if (record.popq) {
      this.popq.setValue(record.popq);
    }

    if (record.conclusion) {
      this.conclusion?.setValue({
        id: record?.id,
        surgical: record?.conclusion?.surgical ? record?.conclusion?.surgical.replace(/<br>/g, '\n') : '',
        pathological: record?.conclusion?.pathological ? record?.conclusion?.pathological.replace(/<br>/g, '\n') : '',
        notes: record?.conclusion?.notes ? record?.conclusion?.notes.replace(/<br>/g, '\n') : '',
        diagnosis: record?.conclusion?.diagnosis ? record?.conclusion?.diagnosis.replace(/<br>/g, '\n') : '',
        tests: record?.conclusion?.tests ? record?.conclusion?.tests.replace(/<br>/g, '\n') : '',
        behavior: record?.conclusion?.behavior ? record?.conclusion?.behavior.replace(/<br>/g, '\n') : '',
        process: record?.conclusion?.process ? record?.conclusion?.process.replace(/<br>/g, '\n') : '',
        pharmacological: record?.conclusion?.pharmacological ? record?.conclusion?.pharmacological.replace(/<br>/g, '\n') : '',
        family: record?.conclusion?.family ? record?.conclusion?.family.replace(/<br>/g, '\n') : '',
        allergies: record?.conclusion?.allergies ? record?.conclusion?.allergies.toString() : '',
        diagnostic: record?.conclusion?.diagnostic ? record?.conclusion?.rel_diagnostic : '',
        toxicologist: record?.conclusion?.toxicologist ? record?.conclusion?.toxicologist.replace(/<br>/g, '\n') : '',
        occupational: record?.conclusion?.occupational ? record?.conclusion?.occupational.replace(/<br>/g, '\n') : '',
        diagnostic_type: record?.conclusion?.diagnostic_type ? record?.conclusion?.diagnostic_type.toString() : '',
        external_cause: record?.conclusion?.external_cause ? record?.conclusion?.external_cause.toString() : '',
        purpose: record?.conclusion?.purpose ? record?.conclusion?.purpose.toString() : '',
        procedure: record?.conclusion?.procedure_id ? record?.conclusion?.rel_procedure : '',
        authorization_number: record?.conclusion?.authorization_number ? record?.conclusion?.authorization_number : '',
        current_illness: record?.conclusion?.current_illness ? record?.conclusion?.current_illness : '',
        cualCirugia_plastica: record?.conclusion?.cualCirugia_plastica ? record?.conclusion?.cualCirugia_plastica : '',
        eructivas: record?.conclusion?.eructivas ? record?.conclusion?.eructivas.toString() : '',
        cirugia_plastica: record?.conclusion?.cirugia_plastica ? record?.conclusion?.cirugia_plastica.toString() : '',
        enfermedades_vasculares: record?.conclusion?.enfermedades_vasculares ? record?.conclusion?.enfermedades_vasculares.toString() : '',
        artritis: record?.conclusion?.artritis ? record?.conclusion?.artritis.toString() : '',
        diabetes: record?.conclusion?.diabetes ? record?.conclusion?.diabetes.toString() : '',
        ulcera_peptica: record?.conclusion?.ulcera_peptica ? record?.conclusion?.ulcera_peptica.toString() : '',
        hepatitis: record?.conclusion?.hepatitis ? record?.conclusion?.hepatitis.toString() : '',
        enfermedades_pulmonares: record?.conclusion?.enfermedades_pulmonares ? record?.conclusion?.enfermedades_pulmonares.toString() : '',
        flebitis: record?.conclusion?.flebitis ? record?.conclusion?.flebitis.toString() : '',
        transfusiones_sanguineas: record?.conclusion?.transfusiones_sanguineas ? record?.conclusion?.transfusiones_sanguineas.toString() : '',
        otro_cirugia: record?.conclusion?.otro_cirugia ? record?.conclusion?.otro_cirugia.toString() : '',
        cigarrillo: record?.conclusion?.cigarrillo ? record?.conclusion?.cigarrillo.toString() : '',
        alcohol: record?.conclusion?.alcohol ? record?.conclusion?.alcohol.toString() : '',
        problemas_articulares: record?.conclusion?.problemas_articulares ? record?.conclusion?.problemas_articulares.toString() : '',
        marcapasos: record?.conclusion?.marcapasos ? record?.conclusion?.marcapasos.toString() : '',
        presion_arterial: record?.conclusion?.presion_arterial ? record?.conclusion?.presion_arterial.toString() : '',

        infecciones: record?.conclusion?.infecciones ? record?.conclusion?.infecciones.toString() : '',
        cancer: record?.conclusion?.cancer ? record?.conclusion?.cancer.toString() : '',
        pregunta_ejercicio: record?.conclusion?.pregunta_ejercicio ? record?.conclusion?.pregunta_ejercicio.toString() : '',
        pregunta_dieta: record?.conclusion?.pregunta_dieta ? record?.conclusion?.pregunta_dieta.toString() : '',
        pregunta_corporal: record?.conclusion?.pregunta_corporal ? record?.conclusion?.pregunta_corporal.toString() : '',
        anomalias_congenitas: record?.conclusion?.anomalias_congenitas ? record?.conclusion?.anomalias_congenitas.toString() : '',
        cancer_familiar: record?.conclusion?.cancer_familiar ? record?.conclusion?.cancer_familiar.toString() : '',
        diabetes_familiar: record?.conclusion?.diabetes_familiar ? record?.conclusion?.diabetes_familiar.toString() : '',
        enfermedades_cardiacas: record?.conclusion?.enfermedades_cardiacas ? record?.conclusion?.enfermedades_cardiacas.toString() : '',
        tension: record?.conclusion?.tension ? record?.conclusion?.tension.toString() : '',
        embarazos: record?.conclusion?.embarazos ? record?.conclusion?.embarazos.toString() : '',
        hijos: record?.conclusion?.hijos ? record?.conclusion?.hijos.toString() : '',
        abortos: record?.conclusion?.abortos ? record?.conclusion?.abortos.toString() : '',
        problemas_tiroideos: record?.conclusion?.problemas_tiroideos ? record?.conclusion?.problemas_tiroideos.toString() : '',
        g: record?.conclusion?.g ? record?.conclusion?.g.toString() : '',
        p: record?.conclusion?.p ? record?.conclusion?.p.toString() : '',
        c: record?.conclusion?.c ? record?.conclusion?.c.toString() : '',
        a: record?.conclusion?.a ? record?.conclusion?.a.toString() : '',

        labios: record?.conclusion?.labios ? record?.conclusion?.labios.replace(/<br>/g, '\n') : '',
        mucosa: record?.conclusion?.mucosa ? record?.conclusion?.mucosa.replace(/<br>/g, '\n') : '',
        frenillos: record?.conclusion?.frenillos ? record?.conclusion?.frenillos.replace(/<br>/g, '\n') : '',
        paladar: record?.conclusion?.paladar ? record?.conclusion?.paladar.replace(/<br>/g, '\n') : '',
        lengua: record?.conclusion?.lengua ? record?.conclusion?.lengua.replace(/<br>/g, '\n') : '',
        piso_boca: record?.conclusion?.piso_boca ? record?.conclusion?.piso_boca.replace(/<br>/g, '\n') : '',
        glandula: record?.conclusion?.glandula ? record?.conclusion?.glandula.replace(/<br>/g, '\n') : '',
        dolor_muscular: record?.conclusion?.dolor_muscular ? record?.conclusion?.dolor_muscular.replace(/<br>/g, '\n') : '',
        dolor_articular: record?.conclusion?.dolor_articular ? record?.conclusion?.dolor_articular.replace(/<br>/g, '\n') : '',
        alteracion_movimiento: record?.conclusion?.alteracion_movimiento ? record?.conclusion?.alteracion_movimiento.replace(/<br>/g, '\n') : '',
        maloclusiones: record?.conclusion?.maloclusiones ? record?.conclusion?.maloclusiones.replace(/<br>/g, '\n') : '',
        crecimiento_desarrollo: record?.conclusion?.crecimiento_desarrollo ? record?.conclusion?.crecimiento_desarrollo.replace(/<br>/g, '\n') : '',
        faseta_desgaste: record?.conclusion?.faseta_desgaste ? record?.conclusion?.faseta_desgaste.replace(/<br>/g, '\n') : '',
        respirador_oral: record?.conclusion?.respirador_oral ? record?.conclusion?.respirador_oral.replace(/<br>/g, '\n') : '',
        succion_digital: record?.conclusion?.succion_digital ? record?.conclusion?.succion_digital.replace(/<br>/g, '\n') : '',
        lengua_protactil: record?.conclusion?.lengua_protactil ? record?.conclusion?.lengua_protactil.replace(/<br>/g, '\n') : '',
        queliofagia: record?.conclusion?.queliofagia ? record?.conclusion?.queliofagia.replace(/<br>/g, '\n') : '',
        fumador: record?.conclusion?.fumador ? record?.conclusion?.fumador.replace(/<br>/g, '\n') : '',
        onicofagia: record?.conclusion?.onicofagia ? record?.conclusion?.onicofagia.replace(/<br>/g, '\n') : '',
        hallazgo: record?.conclusion?.hallazgo ? record?.conclusion?.hallazgo.replace(/<br>/g, '\n') : '',
        cambio_forma: record?.conclusion?.cambio_forma ? record?.conclusion?.cambio_forma.replace(/<br>/g, '\n') : '',
        cambio_tamano: record?.conclusion?.cambio_tamano ? record?.conclusion?.cambio_tamano.replace(/<br>/g, '\n') : '',
        cambio_numero: record?.conclusion?.cambio_numero ? record?.conclusion?.cambio_numero.replace(/<br>/g, '\n') : '',
        cambio_color: record?.conclusion?.cambio_color ? record?.conclusion?.cambio_color.replace(/<br>/g, '\n') : '',
        cambio_posicion: record?.conclusion?.cambio_posicion ? record?.conclusion?.cambio_posicion.replace(/<br>/g, '\n') : '',
        impacto: record?.conclusion?.impacto ? record?.conclusion?.impacto.replace(/<br>/g, '\n') : '',
        sesibilidad: record?.conclusion?.sesibilidad ? record?.conclusion?.sesibilidad.replace(/<br>/g, '\n') : '',
        sangrado: record?.conclusion?.sangrado ? record?.conclusion?.sangrado.replace(/<br>/g, '\n') : '',
        movilidad: record?.conclusion?.movilidad ? record?.conclusion?.movilidad.replace(/<br>/g, '\n') : '',
        reseciones: record?.conclusion?.reseciones ? record?.conclusion?.reseciones.replace(/<br>/g, '\n') : '',
        bolsa: record?.conclusion?.bolsa ? record?.conclusion?.bolsa.replace(/<br>/g, '\n') : '',
        calculos: record?.conclusion?.calculos ? record?.conclusion?.calculos.replace(/<br>/g, '\n') : '',
        abscesos: record?.conclusion?.abscesos ? record?.conclusion?.abscesos.replace(/<br>/g, '\n') : '',
        erosion: record?.conclusion?.erosion ? record?.conclusion?.erosion.replace(/<br>/g, '\n') : '',

      });

      if (record.conclusion?.diagnostic !== null) {
        this.filteredServerSideDiagnoses.next([record.conclusion?.rel_diagnostic]);
      }

      if (record.conclusion?.procedure_id !== null) {
        this.filteredServerSideProcedures.next([record.conclusion?.rel_procedure]);
      }
    }
  }

  getRecord(id: any) {
    this.loading = true;
    const queryParams = `id: "${id}"`;
    const queryProps =
      // tslint:disable-next-line:max-line-length
      'id,identification, popq{id, popq_Aa, popq_Ba, popq_C, popq_gh, popq_pb, popq_tvl, popq_Ap, popq_Bp, popq_D}, examen{id, record_id, obs, ecografias, resonancias, tac, code, otros, orina, quimica_sanguinea, material_fecal, varios, hematologia, radioIntraorales, radioExtraorales, fotoIntraorales, fotoExtraorales, modelos, paquete_diagnostico, cefalometria, tomografia}, diagnoses{ id, diagnose{ id, cod_four, des_four,} },   procedures{ id, procedure{ id, code, description,} },  patient{id, name, identification, civil_status, position, sex, TipoDocumento, birth_date, phone, address, company, email, partner_name, arl, eps, pension, partner_profession, profile_url, chat_id}, details{id, motive, current_illness, menarche, cycles, record_fur, record_g, record_p, record_v, record_a, record_pp, record_up, record_prs, record_fpp, amenorrhea},  physical{id,physical_ta, physical_fc, weight, height, head, neck, thorax, pregnancy, exams, tension, mental, skin, pulm,abdomen, extremities, neurol, imc, spo2, otros}, evolutions{id, date, details, rejuv, mona, process}, observations{id, description}, pregnancies{id,date,description}, coombs{id,date,description}, htos{id,date,description}, hbs{id,date,description}, cits{id,date,description}, vaccines{id,date,description}, citologies{id,date,description}, laboratory{id, patient_group, patient_rh, partner_group, partner_rh}, labor{id, date, time, labor_ta, labor_fcf, membranes, presentation, observations}, birth{id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations}, medicines{id, medicine{id,name,atc_code,active,administration,pos,cum}, dose, measure, frequency, duration, quantity, administration}, conclusion{id, cualCirugia_plastica, surgical, pathological, notes, diagnosis, tests, behavior, process, pharmacological, family, allergies, diagnostic, diagnostic_type, toxicologist, occupational, external_cause, purpose, procedure_id, current_illness, authorization_number, eructivas, cirugia_plastica, problemas_tiroideos, ulcera_peptica, enfermedades_vasculares, artritis, diabetes, hepatitis, enfermedades_pulmonares, flebitis, transfusiones_sanguineas, otro_cirugia, cigarrillo, alcohol, problemas_articulares, marcapasos, presion_arterial, infecciones, cancer, pregunta_ejercicio, pregunta_dieta, pregunta_corporal, anomalias_congenitas, cancer_familiar, diabetes_familiar, enfermedades_cardiacas, tension, embarazos,  hijos, abortos, g, p, c, a, labios, mucosa, frenillos, paladar, lengua piso_boca, glandula, dolor_muscular, dolor_articular, alteracion_movimiento, maloclusiones,  crecimiento_desarrollo, faseta_desgaste, respirador_oral, succion_digital, lengua_protactil, queliofagia, fumador, onicofagia, hallazgo, cambio_tamano, cambio_forma, cambio_numero, cambio_color, cambio_posicion, impacto, sesibilidad, sangrado,  movilidad, reseciones, bolsa,  calculos, abscesos, erosion,  rel_diagnostic{id,cod_four,des_four}, rel_procedure{id,code,description}}, multimedias{id,name,description,url,type,status,created_at}, odontograma{id, diente_id, plan_status, created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, cervical, obs}, resumen{id, esqueletico, dental, funcional, estetico, periodontal, estetica_facial, estetica_dental, oclusion_funcional, atm, periodoncia, requerimiento_paciente, plan_tratamiento, limitacion, pronostico, interconsultas, radiografias }, created_at';
  
    this.apiService.getRecord(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.apiService.setRecord(result.data.record);
        this.novedad = result.data.record;
     //   console.log('novedades ', this.novedad)
        this.setCurrentRecord(result.data.record);

        const userCreated = localStorage.getItem('userCreated');

        if (userCreated) {
          // open modal with user info
          this.openNewUserModal();

          localStorage.removeItem('userCreated');
        }

        this.getRecordMultimedia(id);

        console.log(result);
        console.log('datos de detalle', this.novedad);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  deleteExamen(proc: any) {
    const r = confirm('¿Seguro que desea eliminar el Examenes?');
    if (r === true) {
      this.loading = true;

      const id = proc ? `id: ${proc},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id';

      this.apiService.SaveExamenes(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loading = false;

          this.getRecord(this.currentRecord.identification);

          this.snackBar.open('Eliminado', null, {
            duration: 4000
          });
        },
        error => {
          this.loading = false;
          this.snackBar.open('Error.', null, {
            duration: 4000
          });

          console.log(error);
        }
      );
    }
  }
  cadenaSeparador() {

    // var cadena = `"${this.currentRecord.identification}"` ,
    //   separador = "-", // un espacio en blanco
    //   limite = 2,
    //   arregloDeSubCadenas = cadena.split(separador, limite);

    // console.log(arregloDeSubCadenas);
  }
  getRecordControl() {
    this.loading = true;
    const patientId = this.id = this.route.snapshot.paramMap.get('recordPatient');
    const queryParams = `patient_id:"${patientId}"`;
    const queryProps =
      // tslint:disable-next-line:max-line-length
      'id,identification, popq{id, popq_Aa, popq_Ba, popq_C, popq_gh, popq_pb, popq_tvl, popq_Ap, popq_Bp, popq_D}, diagnoses{ id, diagnose{ id, cod_four, des_four,} },   procedures{ id, procedure{ id, code, description,} },  patient{id, name, identification, civil_status, position, sex, TipoDocumento, birth_date, phone, address, company, email, partner_name, arl, eps, pension, partner_profession, profile_url, chat_id}, details{id, motive, menarche, cycles, record_fur, record_g, record_p, record_v, record_a, record_pp, record_up, record_prs, record_fpp, amenorrhea}, physical{id,physical_ta, physical_fc, weight, height, head, neck, thorax, pregnancy, exams, tension, mental, skin, pulm,abdomen, extremities, neurol}, evolutions{id, date, details, rejuv, mona, process}, observations{id, description}, pregnancies{id,date,description}, coombs{id,date,description}, htos{id,date,description}, hbs{id,date,description}, cits{id,date,description}, vaccines{id,date,description}, citologies{id,date,description}, laboratory{id, patient_group, patient_rh, partner_group, partner_rh}, labor{id, date, time, labor_ta, labor_fcf, membranes, presentation, observations}, birth{id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations}, medicines{id, medicine{id,name,atc_code,active,administration,pos,cum}, dose, measure, frequency, duration, quantity, administration}, conclusion{id, surgical, pathological, notes, diagnosis, tests, behavior, process, pharmacological, family, allergies, diagnostic, diagnostic_type, toxicologist, occupational, external_cause, purpose, procedure_id, current_illness, authorization_number, rel_diagnostic{id,cod_four,des_four}, rel_procedure{id,code,description}}, multimedias{id,name,description,url,type,status,created_at}, created_at';

    this.apiService.getRecordControl(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.tableData = result.data.recordControl;
        this.filteredtableData.next(result.data.recordControl.slice());
        //   console.log('novedades ', this.novedad)
       

        console.log(result);
        console.log('datos de control', this.novedad);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  // getEvolution() {
  //   this.loading = true;
  //   const patientId = this.id = this.route.snapshot.paramMap.get('identification');
  //   const queryParams = `id: ${patientId}`;
  //   const queryProps = 'id, motive,';

  //   this.apiService.getRecordDetails(queryParams, queryProps).subscribe(
  //     (result: any) => {
  //       this.loading = false;
       
  //       console.log( 'novedades', this.novedad)

  //       console.log(result);
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       console.log(error);
  //     }
  //   );
  // }
consentimiento: any[]=[];
  // getConsentimiento() {
  //   this.loading = true;

  //   const queryParams = `search:"" `;
  //   const queryProps = 'id, user_id, doctor{id, nombre, especializacion}, nombre,doctor_id, obs, link, created_at';

  //   this.apiService.getConsentimiento(queryParams, queryProps).subscribe(
  //     (result: any) => {
  //       this.loading = false;
  //       this.consentimiento = result.data.getConsentimiento;
  //       console.log('consentimiento', this.consentimiento)

  //       console.log(result);
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       console.log(error);
  //     }
  //   );
  // }
  getConsentimiento() {
    this.loading = true;

    const queryParams = `record_id:"${this.route.snapshot.paramMap.get('recordId')}" `;
    const queryProps = 'id,  doctor{id, nombre, especializacion}, nombre,doctor_id, date, obs, created_at';

    this.apiService.getConsentimientoPaciente(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.consentimiento = result.data.getConsentimientoPaciente;
        console.log('consentimiento', this.consentimiento)

        console.log(result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }


  getProcedimientoPaciente() {
    this.tratamientoTrue = true;

    const queryParams = `tipo: 1, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, status, abono, suma_sesion, sesiones, cantidad, valor_sesion, categoria, valor, procedimiento, pieza, otros, created_at, obs';

    this.apiService.getProcedimientoPaciente(queryParams, queryProps).subscribe(
      (result: any) => {
        this.tratamientoTrue = true;
        this.planTratamiento = result.data.getProcedimientoPaciente;
        
        this.total = this.planTratamiento.reduce((
          acc,
          obj,
        ) => acc + (obj.valor),
          0);

        console.log(result);
      },
      (error: any) => {
        this.tratamientoTrue = false;
        console.log(error);
      }
    );
  }
  getEvolutionTratamiento() {
    this.loading = true;

    const queryParams = `tipo: 2, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, status, categoria, valor, procedimiento, pieza, created_at, obs';

    this.apiService.getProcedimientoPaciente(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.evolutionTratamiento = result.data.getProcedimientoPaciente;

        this.totalEvolution = this.evolutionTratamiento.reduce((
          acc,
          obj,
        ) => acc + (obj.valor),
          0);

        console.log(result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getOdontograma() {
    this.loading = true;
    const status = 1;
    const queryParams = `record_id:"${this.route.snapshot.paramMap.get('recordId')}" limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}"`;
    
    const queryProps = 'id, diente_id, plan_status, status, exodoncia, created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, cervical, obs ';

    this.apiService.getOdontograma(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.odontograma = result.data.getOdontograma;
        console.log(result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  getRecordMultimedia(id: any) {
    this.loading = true;
    const queryParams = `record_id: "${id}"`;
    const queryProps =
      'id,name,description,url,type,status,created_at';

    this.apiService.getMultimediasFromLocal(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        // TODO: set multimedias to record
        this.currentRecord.multimedias = result.data.multimedias;
        // this.apiService.setRecord(result.data.record);
        // this.setCurrentRecord(result.data.record);

        console.log(result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  savePhysical() {
    this.loading = true;
    const data = this.physical.value;

    const physicalTa =
      data.physical_ta !== '' && data.physical_ta != null ? `physical_ta: "${data.physical_ta}",` : 'physical_ta: ".",';
    const physicalFc =
      data.physical_fc !== '' && data.physical_fc != null ? `physical_fc: "${data.physical_fc}",` : 'physical_fc: ".",';
    const weight = data.weight !== '' && data.weight != null ? `weight: "${data.weight}",` : 'weight: ".",';
    const height = data.height !== '' && data.height != null ? `height: "${data.height}",` : 'height: ".",';
    const head = data.head !== '' && data.head != null ? `head: "${data.head}",` : 'head: ".",';
    const neck = data.neck !== '' && data.neck != null ? `neck: "${data.neck}",` : 'neck: ".",';
    const thorax = data.thorax !== '' && data.thorax != null ? `thorax: "${data.thorax}",` : 'thorax: ".",';
    const pregnancy =
      data.pregnancy !== '' && data.pregnancy != null ? `pregnancy: "${data.pregnancy}",` : 'pregnancy: ".",';
    const exams = data.exams !== '' && data.exams != null ? `exams: "${data.exams}",` : 'exams: ".",';

    const sao = data.sao !== '' && data.sao != null ? `sao: "${data.sao}",` : 'sao: ".", ';
    const temperature = data.temperature !== '' && data.temperature != null ? `temperature: "${data.temperature}",` : 'temperature: ".", ';
    const tension = data.tension !== '' && data.tension != null ? `tension: "${data.tension}",` : 'tension: ".", ';
    const mental = data.mental !== '' && data.mental != null ? `mental: "${data.mental}",` : 'mental: ".", ';
    const skin = data.skin !== '' && data.skin != null ? `skin: "${data.skin}",` : 'skin: ".", ';
    const pulm = data.pulm !== '' && data.pulm != null ? `pulm: "${data.pulm}",` : 'pulm: ".", ';
    const abdomen = data.abdomen !== '' && data.abdomen != null ? `abdomen: "${data.abdomen}",` : 'abdomen: ".", ';
    const extremities = data.extremities !== '' && data.extremities != null ? `extremities: "${data.extremities}",` : 'extremities: ".", ';
    const neurol = data.neurol !== '' && data.neurol != null ? `neurol: "${data.neurol}",` : 'neurol: ".", ';
    const imc = data.imc !== '' && data.imc != null ? `imc: "${data.imc}",` : 'imc: ".", ';
    const otros = data.otros !== '' && data.otros != null ? `otros: "${data.otros}",` : 'otros: ".", ';

    const ta = data.ta !== '' && data.ta != null ? `ta: "${data.ta}",` : 'ta: ".", ';
    const spo2 = data.spo2 !== '' && data.spo2 != null ? `spo2: "${data.spo2}",` : 'spo2: ".", ';


    const queryParams = `record_id: "${
      this.currentRecord.identification
      }", ${physicalTa} ${otros} ${ta} ${spo2} ${imc} ${physicalFc} ${weight} ${height} ${head} ${neck} ${thorax} ${exams} ${pregnancy} ${sao} ${temperature} ${tension} ${mental} ${skin} ${pulm} ${abdomen} ${extremities} ${neurol}`;
    const queryProps =
      // tslint:disable-next-line:max-line-length
      'id,identification, patient{id, name, identification, civil_status, position, birth_date, phone, address, company, email, partner_name, arl, eps, pension, partner_profession}, details{id, motive, menarche, cycles, record_fur, record_g, record_p, record_v, record_a, record_pp, record_up, record_prs, record_fpp, amenorrhea}, physical{id,physical_ta, physical_fc, weight, height, head, neck, thorax, pregnancy, exams, ta, spo2}, evolutions{id, date, details, rejuv, mona, process}, observations{id, description}, pregnancies{id,date,description}, coombs{id,date,description}, htos{id,date,description}, hbs{id,date,description}, cits{id,date,description}, vaccines{id,date,description}, citologies{id,date,description}, laboratory{id, patient_group, patient_rh, partner_group, partner_rh}, labor{id, date, time, labor_ta, labor_fcf, membranes, presentation, observations}, birth{id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations}, medicines{id, medicine{id,name,atc_code,active,administration,pos,cum}, dose, measure, frequency, duration, quantity, administration}, conclusion{id, surgical, pathological, notes, diagnosis, tests, behavior, process, pharmacological, family, allergies, diagnostic, diagnostic_type, toxicologist, occupational, external_cause, purpose, procedure_id, authorization_number, rel_diagnostic{id,cod_four,des_four}, rel_procedure{id,code,description}}, multimedias{id,name,description,url,type,status,created_at}, created_at';

    this.apiService.savePhysical(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.apiService.setRecord(response.data.savePhysical);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  saveResumenHistoria() {
    this.loading = true;
    const data = this.resumen.value;

    const esqueletico =
      data.esqueletico !== '' && data.esqueletico != null ? `esqueletico: "${data.esqueletico}",` : 'esqueletico: ".",';
    const dental =
      data.dental !== '' && data.dental != null ? `dental: "${data.dental}",` : 'dental: ".",';
    const funcional = data.funcional !== '' && data.funcional != null ? `funcional: "${data.funcional}",` : 'funcional: ".",';
    const estetico = data.estetico !== '' && data.estetico != null ? `estetico: "${data.estetico}",` : 'estetico: ".",';
    const periodontal = data.periodontal !== '' && data.periodontal != null ? `periodontal: "${data.periodontal}",` : 'periodontal: ".",';
    const estetica_facial = data.estetica_facial !== '' && data.estetica_facial != null ? `estetica_facial: "${data.estetica_facial}",` : 'estetica_facial: ".",';
    const estetica_dental = data.estetica_dental !== '' && data.estetica_dental != null ? `estetica_dental: "${data.estetica_dental}",` : 'estetica_dental: ".",';
    const oclusion_funcional =
      data.oclusion_funcional !== '' && data.oclusion_funcional != null ? `oclusion_funcional: "${data.oclusion_funcional}",` : 'oclusion_funcional: ".",';
    const atm = data.atm !== '' && data.atm != null ? `atm: "${data.atm}",` : 'atm: ".",';
    const periodoncia = data.periodoncia !== '' && data.periodoncia != null ? `periodoncia: "${data.periodoncia}",` : 'periodoncia: ".", ';
    const requerimiento_paciente = data.requerimiento_paciente !== '' && data.requerimiento_paciente != null ? `requerimiento_paciente: "${data.requerimiento_paciente}",` : 'requerimiento_paciente: ".", ';
    const plan_tratamiento = data.plan_tratamiento !== '' && data.plan_tratamiento != null ? `plan_tratamiento: "${data.plan_tratamiento}",` : 'plan_tratamiento: ".", ';
    const limitacion = data.limitacion !== '' && data.limitacion != null ? `limitacion: "${data.limitacion}",` : 'limitacion: ".", ';
    const pronostico = data.pronostico !== '' && data.pronostico != null ? `pronostico: "${data.pronostico}",` : 'pronostico: ".", ';
    const interconsultas = data.interconsultas !== '' && data.interconsultas != null ? `interconsultas: "${data.interconsultas}",` : 'interconsultas: ".", ';
    const radiografias = data.radiografias !== '' && data.radiografias != null ? `radiografias: "${data.radiografias}",` : 'radiografias: ".", ';

    const queryParams = `record_id: "${
      this.currentRecord.identification
      }", ${esqueletico}  ${dental} ${funcional} ${estetico} ${periodontal} ${estetica_facial} ${estetica_dental} ${atm} ${oclusion_funcional} ${periodoncia} ${requerimiento_paciente} ${plan_tratamiento} ${limitacion} ${pronostico} ${interconsultas} ${radiografias} `;
    const queryProps =
      // tslint:disable-next-line:max-line-length
      'id';

    this.apiService.saveResumen(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  saveDetails() {
    this.loading = true;
    const data = this.details.value;
    console.log(data);

    const motive = data.motive !== '' ? `motive: "${data.motive}",` : 'motive: ".",';
    const current_illness = data.current_illness !== '' ? `current_illness: "${data.current_illness}",` : 'current_illness: ".",';
    const menarche = data.menarche !== '' && data.menarche != null ? `menarche: "${data.menarche}",` : 'menarche: ".",';
    const cycles = data.cycles !== '' && data.cycles != null ? `cycles: "${data.cycles}",` : 'cycles: ".",';
    const record_fur =
      data.record_fur !== '' && data.record_fur != null
        ? `record_fur: "${moment(data.record_fur).format('YYYY-MM-DD')}",`
        : 'record_fur: ".",';
    const record_g = data.record_g !== '' && data.record_g != null ? `record_g: "${data.record_g}",` : 'record_g: ".",';
    const record_p = data.record_p !== '' && data.record_p != null ? `record_p: "${data.record_p}",` : 'record_p: ".",';
    const record_v = data.record_v !== '' && data.record_v != null ? `record_v: "${data.record_v}",` : 'record_v: ".",';
    const record_a = data.record_a !== '' && data.record_a != null ? `record_a: "${data.record_a}",` : 'record_a: ".",';
    const record_pp =
      data.record_pp !== '' && data.record_pp != null ? `record_pp: "${data.record_pp}",` : 'record_pp: ".",';
    const record_up =
      data.record_up !== '' && data.record_up != null ? `record_up: "${data.record_up}",` : 'record_up: ".",';
    const record_prs =
      data.record_prs !== '' && data.record_prs != null ? `record_prs: "${data.record_prs}",` : 'record_prs: ".",';
    const record_fpp =
      data.record_fpp !== '' && data.record_fpp != null ? `record_fpp: "${data.record_fpp}",` : 'record_fpp: ".",';
    const amenorrhea =
      data.amenorrhea !== '' && data.amenorrhea != null ? `amenorrhea: "${data.amenorrhea}",` : 'amenorrhea: ".",';

    const queryParams = `record_id: "${
      this.currentRecord.identification
    // tslint:disable-next-line:max-line-length
      }", ${motive} ${current_illness} ${menarche} ${cycles} ${record_fur} ${record_g} ${record_p} ${record_v} ${record_a} ${record_pp} ${record_up} ${record_prs}  ${record_fpp} ${amenorrhea}`;
    const queryProps =
      // tslint:disable-next-line:max-line-length
      'id,identification, patient{id, name, identification, civil_status, position, birth_date, phone, address, company, email, partner_name, arl, eps, pension, partner_profession}, details{id, motive, menarche, cycles, record_fur, record_g, record_p, record_v, record_a, record_pp, record_up, record_prs, record_fpp, amenorrhea}, physical{id,physical_ta, physical_fc, weight, height, head, neck, thorax, pregnancy, exams}, evolutions{id, date, details, rejuv, mona, process}, observations{id, description}, pregnancies{id,date,description}, coombs{id,date,description}, htos{id,date,description}, hbs{id,date,description}, cits{id,date,description}, vaccines{id,date,description}, citologies{id,date,description}, laboratory{id, patient_group, patient_rh, partner_group, partner_rh}, labor{id, date, time, labor_ta, labor_fcf, membranes, presentation, observations}, birth{id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations}, medicines{id, medicine{id,name,atc_code,active,administration,pos,cum}, dose, measure, frequency, duration, quantity, administration}, conclusion{id, surgical, pathological, notes, diagnosis, tests, behavior, process, pharmacological, family, allergies, diagnostic, diagnostic_type, toxicologist, occupational, external_cause, purpose, procedure_id, authorization_number, rel_diagnostic{id,cod_four,des_four}, rel_procedure{id,code,description}}, multimedias{id,name,description,url,type,status,created_at}, created_at';

    this.apiService.saveRecord(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.apiService.setRecord(response.data.saveRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  saveEvolution() {
    this.loading = true;
    const data = this.evolution.value;

    const details = `details: "${encodeURIComponent(data.details)}",`;
    const queryParams = `record_id: "${this.currentRecord.identification}", ${details}`;
    const queryProps = 'id, details';

    this.apiService.saveEvolution(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.currentRecord.evolution = response.data.saveEvolution;
        this.apiService.setRecord(this.currentRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  random(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
  }
  savePatient() {
    this.sending = true;
    const data = this.patient.value;
    const id = this.currentPatient.id ? `id: ${this.currentPatient.id},` : '';
    const fecha = `fecha: "${this.currentPatient.id}"`;
    const queryParams = `${id} ${fecha} `;
    const queryProps =
      'id, fecha';

    this.apiService.savePatient(queryParams, queryProps).subscribe(
      (response: any) => {
        console.log(response);
        this.sending = false;
        this.snackBar.open('Guardado', null, {
          duration: 4000
        });

        // this.close({ patient: response.data.savePatient, created: data.create_user == true });
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
  openNewUserModal() {
    const dialogRef = this.dialog.open(NewUserModalComponent, {
      width: '430px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openPregnanciesModal() {
    const dialogRef = this.dialog.open(PregnanciesModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }
  openDateModal() {
    const dialogRef = this.dialog.open(DateModalComponent, {
      width: '680px',
      height: 'auto',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }
  openCitologiesModal() {
    const dialogRef = this.dialog.open(CitologiesModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openCoombsModal() {
    const dialogRef = this.dialog.open(CoombsModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openHtoModal() {
    const dialogRef = this.dialog.open(htoModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openHbModal() {
    const dialogRef = this.dialog.open(HbModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openCitModal() {
    const dialogRef = this.dialog.open(CitModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openVaccinesModal() {
    const dialogRef = this.dialog.open(VaccinesModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openObsModal() {
    const dialogRef = this.dialog.open(ObsModalComponent, {
      width: '580px',
      height: '400px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.currentRecord.observations = result;
      }

      console.log(result);
    });
  }

  openEvoModal(evolution: any = null) {
    const dialogRef = this.dialog.open(EvolutionModalComponent, {
      width: '880px',
      height: '570px;',
      maxHeight: '800px',
      data: {
        evolution :evolution,
        record: this.currentRecord
      }
 
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) { return; }

      this.getRecord(this.currentRecord.identification);

      console.log(result);
    });
  }
  openConsentimientoModal(evolution: any = null) {
    const dialogRef = this.dialog.open(ConsentimientoPacienteModalComponent, {
      width: '880px',
      height: '570px;',
      maxHeight: '800px',
      data: {
        evolution: evolution,
        record: this.currentRecord,
       
      }

    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) { return; }

      this.getRecord(this.currentRecord.identification);
      this.getConsentimiento();

      console.log(result);
    });
  }

  openPhoto2Modal(): void {
    // const dialogRef = this.dialog.open(PhotoModal2Component, {
    //   width: '548px',
    //   height: '600px',
    //   maxHeight: '800px',
    //   data: {
    //     record: this.currentRecord
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.currentRecord.multimedias.push(result);
    //   }
    // });
  }

  /**
   *
   *
   * BEFORE BIRTH CONTROL
   *
   *
   */

  sortControl(event: Sort): void {
    this.orderBy = event.active;
    this.order = event.direction;

    this.getOdontograma();
  }

  pageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    // this.loadRecords();
  }

  loadControls() {
    // console.log('loading records...');

    this.loadingControls = true;

    const queryParams = `record_id: "${this.currentRecord.identification}"`;
    const queryProps =
      'id, date, weight, week, control_t, control_a, control_pam, control_au, pression, fcf, edema, created_at';

    this.apiService.getControls(queryParams, queryProps).subscribe(
      (response: any) => {
        this.controlsData = response.data.controls;
        this.loadingControls = false;
      },
      error => {
        this.loadingControls = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });
        console.log(error);
      }
    );
  }

  openControlModal(control: any = null) {
    const dialogRef = this.dialog.open(ControlModalComponent, {
      width: '460px',
      data: {
        control,
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadControls();
    });
  }

  /**
   *
   *
   *
   */
  selectRecord(currentRecord: any) {

    console.log(currentRecord);

    this.router.navigate(['/app/control/', currentRecord.identification,]);
  }  
  saveLaboratory() {
    this.loading = true;
    const data = this.laboratory.value;
    console.log(this.laboratory.value);

    const patientGroup =
      data.patient_group !== '' && data.patient_group !== null
        ? `patient_group: "${data.patient_group}",`
        : `patient_group: ".",`;
    const patientRh =
      data.patient_rh !== '' && data.patient_rh !== null
        ? `patient_rh: "${encodeURIComponent(data.patient_rh)}",`
        : `patient_rh: ".",`;
    const partnerGroup =
      data.partner_group !== '' && data.partner_group !== null
        ? `partner_group: "${data.partner_group}",`
        : `partner_group: ".",`;
    const partnerRh =
      data.partner_rh !== '' && data.partner_rh !== null
        ? `partner_rh: "${encodeURIComponent(data.partner_rh)}",`
        : `partner_rh: ".",`;

    const queryParams = `record_id: "${
      this.currentRecord.identification
    }", ${patientGroup} ${patientRh} ${partnerGroup} ${partnerRh}`;
    const queryProps = 'id, patient_group, patient_rh, partner_group, partner_rh';

    this.apiService.saveLaboratory(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.currentRecord.laboratory = response.data.saveLaboratory;
        this.apiService.setRecord(this.currentRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  saveLabor() {
    this.loading = true;
    const data = this.labor.value;

    const date =
      data.date !== '' && data.date != null ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : 'date: ".",';
    const time = data.time !== '' && data.time !== null ? `time: "${data.time}",` : `time: ".",`;
    const laborTa =
      data.labor_ta !== '' && data.labor_ta !== null ? `labor_ta: "${data.labor_ta}",` : `labor_ta: ".",`;
    const laborFcf =
      data.labor_fcf !== '' && data.labor_fcf !== null ? `labor_fcf: "${data.labor_fcf}",` : `labor_fcf: ".",`;
    const membranes =
      data.membranes !== '' && data.membranes !== null ? `membranes: "${data.membranes}",` : `membranes: ".",`;
    const presentation =
      data.presentation !== '' && data.presentation !== null
        ? `presentation: "${data.presentation}",`
        : `presentation: ".",`;
    const observations =
      data.observations !== '' && data.observations !== null
        ? `observations: "${data.observations}",`
        : `observations: ".",`;

    const queryParams = `record_id: "${
      this.currentRecord.identification
    }", ${date} ${time} ${laborTa} ${laborFcf} ${membranes} ${presentation} ${observations}`;
    const queryProps = 'id, date, time, labor_ta, labor_fcf, membranes, presentation, observations';

    this.apiService.saveLabor(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.currentRecord.labor = response.data.saveLabor;
        this.apiService.setRecord(this.currentRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  saveBirth() {
    this.loading = true;
    const data = this.birth.value;

    const date =
      data.date !== '' && data.date != null ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : 'date: ".",';
    const time = data.time !== '' && data.time !== null ? `time: "${data.time}",` : `time: ".",`;
    const type = data.type !== '' && data.type !== null ? `type: "${data.type}",` : `type: ".",`;
    const episiotomy =
      data.episiotomy !== '' && data.episiotomy !== null ? `episiotomy: "${data.episiotomy}",` : `episiotomy: ".",`;
    const alum = data.alum !== '' && data.alum !== null ? `alum: "${data.alum}",` : `alum: ".",`;
    const bloodLoss =
      data.blood_loss !== '' && data.blood_loss !== null ? `blood_loss: "${data.blood_loss}",` : `blood_loss: ".",`;
    const oxytocic =
      data.oxytocic !== '' && data.oxytocic !== null ? `oxytocic: "${data.oxytocic}",` : `oxytocic: ".",`;
    const anesthesia =
      data.anesthesia !== '' && data.anesthesia !== null ? `anesthesia: "${data.anesthesia}",` : `anesthesia: ".",`;
    const sex = data.sex !== '' && data.sex !== null ? `sex: "${data.sex}",` : `sex: ".",`;
    const weight = data.weight !== '' && data.weight !== null ? `weight: "${data.weight}",` : `weight: ".",`;
    const height = data.height !== '' && data.height !== null ? `height: "${data.height}",` : `height: ".",`;
    const size = data.size !== '' && data.size !== null ? `size: "${data.size}",` : `size: ".",`;
    const observations =
      data.observations !== '' && data.observations !== null
        ? `observations: "${data.observations}",`
        : `observations: ".",`;

    const queryParams = `record_id: "${
      this.currentRecord.identification
    // tslint:disable-next-line:max-line-length
    }", ${date} ${time} ${type} ${episiotomy} ${alum} ${bloodLoss} ${oxytocic} ${anesthesia} ${sex} ${weight} ${height} ${size} ${observations}`;
    const queryProps =
      // tslint:disable-next-line:max-line-length
      'id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations';

    this.apiService.saveBirth(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.currentRecord.birth = response.data.saveBirth;
        this.apiService.setRecord(this.currentRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  saveConclusion() {
    this.loading = true;
    const data = this.conclusion?.value;

    const surgical =
      data.surgical !== '' && data.surgical !== null ? `surgical: "${data.surgical}",` : `surgical: ".",`;
    const pathological =
      data.pathological !== '' && data.pathological !== null
        ? `pathological: "${data.pathological}",`
        : `pathological: ".",`;
    const notes = data.notes !== '' && data.notes !== null ? `notes: "${data.notes}",` : `notes: ".",`;
    const diagnosis =
      data.diagnosis !== '' && data.diagnosis !== null ? `diagnosis: "${data.diagnosis}",` : `diagnosis: ".",`;
    const tests = data.tests !== '' && data.tests !== null ? `tests: "${data.tests}",` : `tests: ".",`;
    const behavior =
      data.behavior !== '' && data.behavior !== null ? `behavior: "${data.behavior}",` : `behavior: ".",`;
    const process = data.process !== '' && data.process !== null ? `process: "${data.process}",` : `process: ".",`;
    const pharmacological = data.pharmacological !== '' && data.pharmacological !== null ? `pharmacological: "${data.pharmacological}",` : `pharmacological: ".",`;
    const family = data.family !== '' && data.family !== null ? `family: "${data.family}",` : `family: ".",`;
    const allergies = data.allergies !== '' && data.allergies !== null ? `allergies: "${data.allergies}",` : `allergies: ".",`;
    const diagnostic = data.diagnostic !== '' && data.diagnostic !== null ? `diagnostic: ${data.diagnostic.id},` : `diagnostic: 1,`;
    const toxicologist = data.toxicologist !== '' && data.toxicologist !== null ? `toxicologist: "${data.toxicologist}",` : `toxicologist: ".",`;
    const occupational = data.occupational !== '' && data.occupational !== null ? `occupational: "${data.occupational}",` : `occupational: ".",`;
    const diagnosticType = data.diagnostic_type !== '' && data.diagnostic_type !== null ? `diagnostic_type: ${data.diagnostic_type},` : '';
    const externalCause = data.external_cause !== '' && data.external_cause !== null ? `external_cause: ${data.external_cause},` : '';
    const purpose = data.purpose !== '' && data.purpose !== null ? `purpose: ${data.purpose},` : '';
    const procedure = data.procedure !== '' && data.procedure !== null ? `procedure: ${data.procedure.id},` : '';
    const current_illness = data.current_illness !== '' && data.current_illness !== null ? `current_illness: "${data.current_illness}",` : '';
    const cualCirugia_plastica = data.cualCirugia_plastica !== '' && data.cualCirugia_plastica !== null ? `cualCirugia_plastica: "${data.cualCirugia_plastica}",` : `cualCirugia_plastica: ".",`;
    const authorizationNumber = data.authorization_number !== '' && data.authorization_number !== null ? `authorization_number: "${data.authorization_number}",` : `authorization_number: "000",`;
    const eructivas = data.eructivas !== '' && data.eructivas !== null ? `eructivas: "${data.eructivas}",` : `eructivas: ".",`;
    const cirugia_plastica = data.cirugia_plastica !== '' && data.cirugia_plastica !== null ? `cirugia_plastica: "${data.cirugia_plastica}",` : `cirugia_plastica: ".",`;
    const problemas_tiroideos = data.problemas_tiroideos !== '' && data.problemas_tiroideos !== null ? `problemas_tiroideos: "${data.problemas_tiroideos}",` : `problemas_tiroideos: ".",`;
    const ulcera_peptica = data.ulcera_peptica !== '' && data.ulcera_peptica !== null ? `ulcera_peptica: "${data.ulcera_peptica}",` : `ulcera_peptica: ".",`;
    const enfermedades_vasculares = data.enfermedades_vasculares !== '' && data.enfermedades_vasculares !== null ? `enfermedades_vasculares: "${data.enfermedades_vasculares}",` : `enfermedades_vasculares: ".",`;
    const artritis = data.artritis !== '' && data.artritis !== null ? `artritis: "${data.artritis}",` : `artritis: ".",`;
    const diabetes = data.diabetes !== '' && data.diabetes !== null ? `diabetes: "${data.diabetes}",` : `diabetes: ".",`;
    const hepatitis = data.hepatitis !== '' && data.hepatitis !== null ? `hepatitis: "${data.hepatitis}",` : `hepatitis: ".",`;
    const enfermedades_pulmonares = data.enfermedades_pulmonares !== '' && data.enfermedades_pulmonares !== null ? `enfermedades_pulmonares: "${data.enfermedades_pulmonares}",` : `enfermedades_pulmonares: ".",`;
    const flebitis = data.flebitis !== '' && data.flebitis !== null ? `flebitis: "${data.flebitis}",` : `flebitis: ".",`;
    const transfusiones_sanguineas = data.transfusiones_sanguineas !== '' && data.transfusiones_sanguineas !== null ? `transfusiones_sanguineas: "${data.transfusiones_sanguineas}",` : `transfusiones_sanguineas: ".",`;
    const otro_cirugia = data.otro_cirugia !== '' && data.otro_cirugia !== null ? `otro_cirugia: "${data.otro_cirugia}",` : `otro_cirugia: ".",`;
    const cigarrillo = data.cigarrillo !== '' && data.cigarrillo !== null ? `cigarrillo: "${data.cigarrillo}",` : `cigarrillo: ".",`;
    const alcohol = data.alcohol !== '' && data.alcohol !== null ? `alcohol: "${data.alcohol}",` : `alcohol: ".",`;
    const problemas_articulares = data.problemas_articulares !== '' && data.problemas_articulares !== null ? `problemas_articulares: "${data.problemas_articulares}",` : `problemas_articulares: ".",`;
    const marcapasos = data.marcapasos !== '' && data.marcapasos !== null ? `marcapasos: "${data.marcapasos}",` : `marcapasos: ".",`;
    const presion_arterial = data.presion_arterial !== '' && data.presion_arterial !== null ? `presion_arterial: "${data.presion_arterial}",` : `presion_arterial: ".",`;
    const infecciones = data.infecciones !== '' && data.infecciones !== null ? `infecciones: "${data.infecciones}",` : `infecciones: ".",`;
    const cancer = data.cancer !== '' && data.cancer !== null ? `cancer: "${data.cancer}",` : `cancer: ".",`;
    const pregunta_ejercicio = data.pregunta_ejercicio !== '' && data.pregunta_ejercicio !== null ? `pregunta_ejercicio: "${data.pregunta_ejercicio}",` : `pregunta_ejercicio: ".",`;
    const pregunta_dieta = data.pregunta_dieta !== '' && data.pregunta_dieta !== null ? `pregunta_dieta: "${data.pregunta_dieta}",` : `pregunta_dieta: ".",`;
    const pregunta_corporal = data.pregunta_corporal !== '' && data.pregunta_corporal !== null ? `pregunta_corporal: "${data.pregunta_corporal}",` : `pregunta_corporal: ".",`;
    const anomalias_congenitas = data.anomalias_congenitas !== '' && data.anomalias_congenitas !== null ? `anomalias_congenitas: "${data.anomalias_congenitas}",` : `anomalias_congenitas: ".",`;
    const cancer_familiar = data.cancer_familiar !== '' && data.cancer_familiar !== null ? `cancer_familiar: "${data.cancer_familiar}",` : `cancer_familiar: ".",`;
    const diabetes_familiar = data.diabetes_familiar !== '' && data.diabetes_familiar !== null ? `diabetes_familiar: "${data.diabetes_familiar}",` : `diabetes_familiar: ".",`;
    const enfermedades_cardiacas = data.enfermedades_cardiacas !== '' && data.enfermedades_cardiacas !== null ? `enfermedades_cardiacas: "${data.enfermedades_cardiacas}",` : `enfermedades_cardiacas: ".",`;
    const tension = data.tension !== '' && data.tension !== null ? `tension: "${data.tension}",` : `tension: ".",`;
    const embarazos = data.embarazos !== '' && data.embarazos !== null ? `embarazos: "${data.embarazos}",` : `embarazos: ".",`;
    const hijos = data.hijos !== '' && data.hijos !== null ? `hijos: "${data.hijos}",` : `hijos: ".",`;
    const abortos = data.abortos !== '' && data.abortos !== null ? `abortos: "${data.abortos}",` : `abortos: ".",`;
    const g = data.g !== '' && data.g !== null ? `g: "${data.g}",` : `g: ".",`;
    const p = data.p !== '' && data.p !== null ? `p: "${data.p}",` : `p: ".",`;
    const c = data.c !== '' && data.c !== null ? `c: "${data.c}",` : `c: ".",`;
    const a = data.a !== '' && data.a !== null ? `a: "${data.a}",` : `a: ".",`;

    const labios = data.labios !== '' && data.labios !== null ? `labios: "${data.labios}",` : `labios: ".",`;
    const mucosa = data.mucosa !== '' && data.mucosa !== null ? `mucosa: "${data.mucosa}",` : `mucosa: ".",`;
    const frenillos = data.frenillos !== '' && data.frenillos !== null ? `frenillos: "${data.frenillos}",` : `frenillos: ".",`;
    const paladar = data.paladar !== '' && data.paladar !== null ? `paladar: "${data.paladar}",` : `paladar: ".",`;
    const lengua = data.lengua !== '' && data.lengua !== null ? `lengua: "${data.lengua}",` : `lengua: ".",`;
    const piso_boca = data.piso_boca !== '' && data.piso_boca !== null ? `piso_boca: "${data.piso_boca}",` : `piso_boca: ".",`;
    const glandula = data.glandula !== '' && data.glandula !== null ? `glandula: "${data.glandula}",` : `glandula: ".",`;
    const dolor_muscular = data.dolor_muscular !== '' && data.dolor_muscular !== null ? `dolor_muscular: "${data.dolor_muscular}",` : `dolor_muscular: ".",`;
    const dolor_articular = data.dolor_articular !== '' && data.dolor_articular !== null ? `dolor_articular: "${data.dolor_articular}",` : `dolor_articular: ".",`;
    const alteracion_movimiento = data.alteracion_movimiento !== '' && data.alteracion_movimiento !== null ? `alteracion_movimiento: "${data.alteracion_movimiento}",` : `alteracion_movimiento: ".",`;
    const maloclusiones = data.maloclusiones !== '' && data.maloclusiones !== null ? `maloclusiones: "${data.maloclusiones}",` : `maloclusiones: ".",`;
    const crecimiento_desarrollo = data.crecimiento_desarrollo !== '' && data.crecimiento_desarrollo !== null ? `crecimiento_desarrollo: "${data.crecimiento_desarrollo}",` : `crecimiento_desarrollo: ".",`;
    const faseta_desgaste = data.faseta_desgaste !== '' && data.faseta_desgaste !== null ? `faseta_desgaste: "${data.faseta_desgaste}",` : `faseta_desgaste: ".",`;
    const respirador_oral = data.respirador_oral !== '' && data.respirador_oral !== null ? `respirador_oral: "${data.respirador_oral}",` : `respirador_oral: ".",`;
    const succion_digital = data.succion_digital !== '' && data.succion_digital !== null ? `succion_digital: "${data.succion_digital}",` : `succion_digital: ".",`;
    const lengua_protactil = data.lengua_protactil !== '' && data.lengua_protactil !== null ? `lengua_protactil: "${data.lengua_protactil}",` : `lengua_protactil: ".",`;
    const queliofagia = data.queliofagia !== '' && data.queliofagia !== null ? `queliofagia: "${data.queliofagia}",` : `queliofagia: ".",`;
    const fumador = data.fumador !== '' && data.fumador !== null ? `fumador: "${data.fumador}",` : `fumador: ".",`;
    const onicofagia = data.onicofagia !== '' && data.onicofagia !== null ? `onicofagia: "${data.onicofagia}",` : `onicofagia: ".",`;
    const hallazgo = data.hallazgo !== '' && data.hallazgo !== null ? `hallazgo: "${data.hallazgo}",` : `hallazgo: ".",`;
    const cambio_forma = data.cambio_forma !== '' && data.cambio_forma !== null ? `cambio_forma: "${data.cambio_forma}",` : `cambio_forma: ".",`;
    const cambio_tamano = data.cambio_tamano !== '' && data.cambio_tamano !== null ? `cambio_tamano: "${data.cambio_tamano}",` : `cambio_tamano: ".",`;
    const cambio_numero = data.cambio_numero !== '' && data.cambio_numero !== null ? `cambio_numero: "${data.cambio_numero}",` : `cambio_numero: ".",`;
    const cambio_color = data.cambio_color !== '' && data.cambio_color !== null ? `cambio_color: "${data.cambio_color}",` : `cambio_color: ".",`;
    const cambio_posicion = data.cambio_posicion !== '' && data.cambio_posicion !== null ? `cambio_posicion: "${data.cambio_posicion}",` : `cambio_posicion: ".",`;
    const impacto = data.impacto !== '' && data.impacto !== null ? `impacto: "${data.impacto}",` : `impacto: ".",`;
    const sesibilidad = data.sesibilidad !== '' && data.sesibilidad !== null ? `sesibilidad: "${data.sesibilidad}",` : `sesibilidad: ".",`;
    const sangrado = data.sangrado !== '' && data.sangrado !== null ? `sangrado: "${data.sangrado}",` : `sangrado: ".",`;
    const movilidad = data.movilidad !== '' && data.movilidad !== null ? `movilidad: "${data.movilidad}",` : `movilidad: ".",`;
    const reseciones = data.reseciones !== '' && data.reseciones !== null ? `reseciones: "${data.reseciones}",` : `reseciones: ".",`;
    const bolsa = data.bolsa !== '' && data.bolsa !== null ? `bolsa: "${data.bolsa}",` : `bolsa: ".",`;
    const calculos = data.calculos !== '' && data.calculos !== null ? `calculos: "${data.calculos}",` : `calculos: ".",`;
    const abscesos = data.abscesos !== '' && data.abscesos !== null ? `abscesos: "${data.abscesos}",` : `abscesos: ".",`;
    const erosion = data.erosion !== '' && data.erosion !== null ? `erosion: "${data.erosion}",` : `erosion: ".",`;

    const queryParams = `record_id: "${
      this.currentRecord.identification
      }", ${surgical} ${pathological} ${cualCirugia_plastica} ${current_illness} ${notes} ${diagnosis} ${tests} ${behavior} ${process} ${pharmacological} ${family} ${allergies} ${diagnostic} ${toxicologist} ${occupational} ${diagnosticType} ${externalCause} ${purpose} ${procedure} ${authorizationNumber} ${eructivas} ${cirugia_plastica} ${problemas_tiroideos} ${ulcera_peptica} ${enfermedades_vasculares} ${artritis} ${diabetes} ${hepatitis} ${enfermedades_pulmonares} ${flebitis} ${transfusiones_sanguineas} ${otro_cirugia} ${cigarrillo} ${alcohol} ${problemas_articulares} ${marcapasos} ${presion_arterial} ${infecciones} ${cancer} ${pregunta_ejercicio} ${pregunta_dieta} ${pregunta_corporal} ${anomalias_congenitas} ${cancer_familiar} ${diabetes_familiar} ${tension} ${embarazos} ${hijos} ${abortos} ${g} ${p} ${c} ${a} ${enfermedades_cardiacas} ${labios} ${mucosa} ${frenillos} ${paladar} ${lengua} ${piso_boca} ${glandula} ${dolor_muscular} ${dolor_articular} ${alteracion_movimiento} ${maloclusiones} ${crecimiento_desarrollo} ${faseta_desgaste} ${respirador_oral} ${succion_digital} ${lengua_protactil} ${queliofagia} ${fumador} ${onicofagia} ${hallazgo} ${cambio_forma} ${cambio_tamano} ${cambio_numero} ${cambio_color} ${cambio_posicion} ${impacto} ${sesibilidad} ${sangrado} ${movilidad} ${reseciones} ${bolsa} ${calculos} ${abscesos} ${erosion} `;
    const queryProps = 'id, surgical, pathological, notes, diagnosis, diagnostic, tests, behavior,  process, pharmacological, family, allergies';

    this.apiService.saveConclusion(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.currentRecord.conclusion = response.data.saveConclusion;
        this.apiService.setRecord(this.currentRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  loadExamenes() {
    console.log('loading records...');

    this.loading = true;
    const dataId = this.currentRecord.identification;
    const queryParams = `record_id: ${dataId}`;
    const queryProps =
      'id, user_id, observacion, created_at';

    this.apiService.getExamenes(queryParams, queryProps).subscribe(
      (response: any) => {

        this.dataSource = response.data.examenes;
        console.log('examenes', this.dataSource)

      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });
        console.log(error);
      }
    );
  }
  
  furChange($event: any) {
    const date = moment(this.details.controls.record_fur.value);
    if (date.isValid()) {
      const fpp = date.add(10, 'days').add(1, 'year').subtract(3, 'months');
      this.details.controls.record_fpp.setValue(fpp.format('DD/MM/YYYY'));

      this.setAmenhorrea(this.details.controls.record_fur.value);
      this.setDaysUntilBirth(fpp);
    }
  }

  setAmenhorrea(date: any) {
    const dateParsed = moment(date);
    if (dateParsed.isValid()) {
      const now = moment();
      this.details.controls.amenorrhea_text
        .setValue(now.diff(dateParsed, 'days') + ' días (' + now.diff(dateParsed, 'weeks') + ' semanas)');
    }
  }

  setDaysUntilBirth(date: any) {

  }

  setStrSpaces(string: string) {
    return string.replace(/<br>/g, '\n');
  }

  civilToString(civilStatus: any) {
    if (civilStatus === 1) return 'Soltero/a';
    if (civilStatus === 2) return 'Casado/a';
    if (civilStatus === 3) return 'Unión Libre';
    if (civilStatus === 4) return 'Divorciado/a';
    if (civilStatus === 5) return 'Viudo/a';

    return 'Otro';
  }

  ageFromDate(date: string) {
    return moment().diff(moment(date), 'years');
  }

  openPatient(patient: any): void {
    const dialogRef = this.dialog.open(PatientFormModalComponent, {
      width: '500px',
      height: '562px',
      maxHeight: '800px',
      data: {
        patient
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('patients form closed');
      if (result) {
        this.currentPatient = result;
      }
    });
  }

  openMedicine(medicine: any = null): void {
    const dialogRef = this.dialog.open(MedicineModalComponent, {
      width: '1204px',
      height: '464px',
      maxHeight: '800px',
      data: {
        medicine,
        record_id: this.currentRecord.identification
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRecord(this.currentRecord.identification);
      }
    });
  }

  openExamenes(examenes: any = null): void {
    const dialogRef = this.dialog.open(ExamenesComponent, {
      width: 'auto',
      height:'660px',
      maxHeight: 'auto',
      data: {
        examenes,
        record_id: this.currentRecord.identification
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRecord(this.currentRecord.identification);
      }
    });
  }
  openDiente(diente: any = null): void {
    const dialogRef = this.dialog.open(DienteComponent, {
      width: '650',
      height: '1024',
      maxHeight: '1024',
      data: {
        diente:diente,
        record_id: this.currentRecord.identification
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRecord(this.currentRecord.identification);
        this.getOdontograma();
        this.getDientes();
        // this.getDiente17();
        // this.getDiente16();
        // this.getDiente15();
        // this.getDiente14();
        // this.getDiente13();
        // this.getDiente12();
        // this.getDiente11();

        // this.getDiente28();
        // this.getDiente27();
        // this.getDiente26();
        // this.getDiente25();
        // this.getDiente24();
        // this.getDiente23();
        // this.getDiente22();
        // this.getDiente21();

        // this.getDiente48();
        // this.getDiente47();
        // this.getDiente46();
        // this.getDiente45();
        // this.getDiente44();
        // this.getDiente43();
        // this.getDiente42();
        // this.getDiente41();

        // this.getDiente38();
        // this.getDiente37();
        // this.getDiente36();
        // this.getDiente35();
        // this.getDiente34();
        // this.getDiente33();
        // this.getDiente32();
        // this.getDiente31();
        
      }
    });
  }
  openDienteInferior(diente: any = null): void {
    const dialogRef = this.dialog.open(DienteInferiorComponent, {
      width: '650',
      height: '1024',
      maxHeight: 'auto',
      data: {
        diente: diente,
        record_id: this.currentRecord.identification
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRecord(this.currentRecord.identification);
        this.getOdontograma();
        
      }
    });
  }
  openProcedimiento(procedimiento: any = null): void {
    const dialogRef = this.dialog.open(ProcedimientoComponent, {
      width: '850px',
      height: 'auto',
      maxHeight: 'auto',
      data: {
        procedimiento: procedimiento,
        record_id: this.currentRecord.identification,
        patient_id: this.currentPatient.identification,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRecord(this.currentRecord.identification);
        this.getOdontograma();
        this.getEvolutionTratamiento();
        this.getProcedimientoPaciente();
      }
    });
  }
  
  openProcedimientoDetails(diente: any = null): void {
    const dialogRef = this.dialog.open(ProcedimientoComponent, {
      width: '850px',
      height: 'auto',
      maxHeight: 'auto',
      data: {
        diente: diente,
        record_id: this.currentRecord.identification,
        patient_id: this.currentPatient.identification,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRecord(this.currentRecord.identification);
        this.getOdontograma();
        this.getEvolutionTratamiento();
        this.getProcedimientoPaciente();
      }
    });
  }
  openProcedure(procedure: any = null): void {
    const dialogRef = this.dialog.open(ProcedureModalComponent, {
      width: '580px',
      height: '456px',
      maxHeight: '800px',
      data: {
        procedure
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.getRecord(this.currentRecord.identification);
      }
    });
  }
  NewOpenProcedure(procedure: any = null): void {
    const dialogRef = this.dialog.open(addProcedureModalComponent, {
      width: '780px',
      height: '456px',
      maxHeight: '800px',
      data: {
        procedure ,
        record_id: this.currentRecord.identification
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.getRecord(this.currentRecord.identification);
      }
    });
  }
  NewOpenDiagnostic(diagnostic: any = null): void {
    const dialogRef = this.dialog.open(diagnosticModalComponent, {
      width: '780px',
      height: '456px',
      maxHeight: '800px',
      data: {
        diagnostic,
        record_id: this.currentRecord.identification
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRecord(this.currentRecord.identification);
      }
    });
  }

  savePopq() {
    this.loading = true;
    const data = this.popq.value;

    const popq_Aa = data.popq_Aa !== '' && data.popq_Aa !=  null ? `popq_Aa: "${data.popq_Aa}",` : `popq_Aa: ".",`;
    const popq_Ba = data.popq_Ba !== '' && data.popq_Ba !=  null ? `popq_Ba: "${data.popq_Ba}",` : `popq_Ba: ".",`;
    const popq_C = data.popq_C !== '' && data.popq_C !=  null ? `popq_C: "${data.popq_C}",` : `popq_C: ".",`;
    const popq_gh = data.popq_gh !== '' && data.popq_gh !=  null ? `popq_gh: "${data.popq_gh}",` : `popq_gh: ".",`;
    const popq_pb = data.popq_pb !== '' && data.popq_pb !=  null ? `popq_pb: "${data.popq_pb}",` : `popq_pb: ".",`;
    const popq_tvl = data.popq_tvl !== '' && data.popq_tvl !=  null ?
      `popq_tvl: "${data.popq_tvl}",` : `popq_tvl: ".",`;
    const popq_Ap = data.popq_Ap !== '' && data.popq_Ap !=  null ? `popq_Ap: "${data.popq_Ap}",` : `popq_Ap: ".",`;
    const popq_Bp = data.popq_Bp !== '' && data.popq_Bp !=  null ? `popq_Bp: "${data.popq_Bp}",` : `popq_Bp: ".",`;
    const popq_D = data.popq_D !== '' && data.popq_D !=  null ? `popq_D: "${data.popq_D}",` : `popq_D: ".",`;

    // tslint:disable-next-line:max-line-length
    const queryParams = `record_id: "${this.currentRecord.identification}", ${popq_Aa} ${popq_Ba} ${popq_C} ${popq_gh} ${popq_pb} ${popq_tvl} ${popq_Ap} ${popq_Bp} ${popq_D}`;
    const queryProps = 'id, popq_Aa, popq_Ba, popq_C, popq_gh, popq_pb, popq_tvl, popq_Ap, popq_Bp, popq_D';

    this.apiService.savePopq(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.currentRecord.popq = response.data.savePopq;
        this.apiService.setRecord(this.currentRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      (error: any) => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  open(index: number): void {
    // open lightbox
    console.log(index);
    console.log(this.currentRecord.multimedias);
    this._lightbox.open(this.currentRecord.multimedias
      .filter((multimedia: any) => multimedia.type === 1).map((multimedia: any) => {
      multimedia.src = multimedia.url;
      multimedia.caption = multimedia.description;
      return multimedia;
    }), index);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  openVideo(multimedia: any) {

  }

  deleteMultimedia(multimedia: any) {
    const r = confirm('¿Seguro que desea eliminar el archivo?');
    if (r === true) {
      this.loading = true;

      const id = multimedia ? `id: ${multimedia.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id';

      this.apiService.saveLocalMultimedia(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loading = false;

          this.getRecordMultimedia(this.currentRecord.identification);

          this.snackBar.open('Eliminado', null, {
            duration: 4000
          });
        },
        error => {
          this.loading = false;
          this.snackBar.open('Error.', null, {
            duration: 4000
          });

          console.log(error);
        }
      );
    }
  }

  deleteMedicine(medicine: any) {
    const r = confirm('¿Seguro que desea eliminar el medicamento?');
    if (r === true) {
      this.loading = true;

      const id = medicine ? `id: ${medicine.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id';

      this.apiService.saveMedicine(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loading = false;

          this.getRecord(this.currentRecord.identification);

          this.snackBar.open('Eliminado', null, {
            duration: 4000
          });
        },
        error => {
          this.loading = false;
          this.snackBar.open('Error.', null, {
            duration: 4000
          });

          console.log(error);
        }
      );
    }
  }
  deleteProcedure(proc: any) {
    const r = confirm('¿Seguro que desea eliminar el Procedimiento?');
    if (r === true) {
      this.loading = true;

      const id = proc ? `id: ${proc.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id';

      this.apiService.saveRecordProcedure(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loading = false;

          this.getRecord(this.currentRecord.identification);

          this.snackBar.open('Eliminado', null, {
            duration: 4000
          });
        },
        error => {
          this.loading = false;
          this.snackBar.open('Error.', null, {
            duration: 4000
          });

          console.log(error);
        }
      );
    }
  }
  deleteDiagnoses(proc: any) {
    const r = confirm('¿Seguro que desea eliminar el Diagnostico?');
    if (r === true) {
      this.loading = true;

      const id = proc ? `id: ${proc.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id';

      this.apiService.saveRecordDiagnoses(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loading = false;

          this.getRecord(this.currentRecord.identification);

          this.snackBar.open('Eliminado', null, {
            duration: 4000
          });
        },
        error => {
          this.loading = false;
          this.snackBar.open('Error.', null, {
            duration: 4000
          });

          console.log(error);
        }
      );
    }
  }
  openMultimediaModal(multimedia: any) {
    const dialogRef = this.dialog.open(MultimediaModalComponent, {
      width: '480px',
      height: '504px',
      maxHeight: '800px',
      data: {
        multimedia
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) {return; }

      this.getRecordMultimedia(this.currentRecord.identification);
    });
  }

  openPhotoModal(patient: any): void {
    const dialogRef = this.dialog.open(PhotoModalComponent, {
      width: 'auto',
      height: '600px',
      maxHeight: '800px',
      data: {
        patient,
        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currentPatient.profile_url = result;
      }
    });
  }
  openRemisionModal(datos: any): void {
    const dialogRef = this.dialog.open(RemisionComponent, {
      width: '548px',
      height: 'auto',
      maxHeight: '800px',
      data: {
        datos,
        record_id: this.currentRecord.identification
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currentPatient.profile_url = result;
      }
    });
  }
  openMedicalEvolution(data:any) {
    const win = window.open(`https://hcapi.clinicalsoftware.org/evolucion/${this.currentRecord.identification}/${data.id}`, '_blank');
    // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    win.focus();
  }
  openMedicalConsentimiento(data: any) {
    const win = window.open(`https://hcapi.clinicalsoftware.org/consentimiento/${this.currentRecord.identification}/${data.id}`, '_blank');
    // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    win.focus();
  }
  openTotalEvolution() {
    const win = window.open(`https://hcapi.clinicalsoftware.org/evolutionList/${this.currentRecord.identification}`, '_blank');
    // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    win.focus();
  }
  openMedicalRecipe() {
    const win = window.open(`https://hcapi.clinicalsoftware.org/recipe/${this.currentRecord.identification}`, '_blank');
    this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    win.focus();
  }
  openMedicalExamen() {
    const win = window.open(`https://hcapi.clinicalsoftware.org/examen/${this.currentRecord.identification}`, '_blank');
    // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    win.focus();
  }
  openPresupuesto() {
    const win = window.open(`https://hcapi.clinicalsoftware.org/presupuesto/${this.currentRecord.identification}`, '_blank');
    // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    win.focus();
  }
  
  openConsentimiento(Solicitud: any) {



      const win = window.open(`${Solicitud.link}/${this.currentRecord.identification}`, '_blank');
    // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    win.focus();
    
    // if (Solicitud.id == 2) {
    //   const win = window.open(`https://hcapi.clinicalsoftware.org/colocacionmini/${this.currentRecord.identification}`, '_blank');
    // // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    // win.focus();
    // }
    // if (Solicitud.id == 3) {
    //   const win = window.open(`https://hcapi.clinicalsoftware.org/drboris/${this.currentRecord.identification}`, '_blank');
    //   // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    //   win.focus();
    // }
    // if (Solicitud.id == 4) {
    //   const win = window.open(`https://hcapi.clinicalsoftware.org/drangelica/${this.currentRecord.identification}`, '_blank');
    //   // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    //   win.focus();
    // }
    // if (Solicitud.id == 5) {
    //   const win = window.open(`https://hcapi.clinicalsoftware.org/ortodoncia/${this.currentRecord.identification}`, '_blank');
    //   // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    //   win.focus();
    // }
    // if (Solicitud.id == 6) {
    //   const win = window.open(`https://hcapi.clinicalsoftware.org/rehabilitacion/${this.currentRecord.identification}`, '_blank');
    //   // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    //   win.focus();
    // }

    // if (Solicitud.id == 7) {
    //   const win = window.open(`https://hcapi.clinicalsoftware.org/drjenny/${this.currentRecord.identification}`, '_blank');
    //   // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    //   win.focus();
    // }
    // if (Solicitud.id == 8) {
    //   const win = window.open(`https://hcapi.clinicalsoftware.org/consentimiento/${this.currentRecord.identification}`, '_blank');
    //   // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    //   win.focus();
    // }
    // if (Solicitud.id == 9) {
    //   const win = window.open(`https://hcapi.clinicalsoftware.org/endodoncia/${this.currentRecord.identification}`, '_blank');
    //   // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
    //   win.focus();
    // }
  }
  toggleChat() {
    this.chatIsOpened = !this.chatIsOpened;
  }

  expandeChat(event) {
    console.log(event);
    this.chatIsExpanded = !this.chatIsExpanded;
  }

  toPrint() {
    const url = `/#/records/print/${this.apiService.currentRecord.identification}`;
    const win = window.open(url, '_blank');
    win.focus();
    // this.router.navigate(['/records/print', this.apiService.currentRecord.identification]);
  }

  getMeasureString(measureId) {
    switch (measureId) {
      case 1:
        return 'Cant';
      case 2:
        return 'mg';
      case 3:
        return 'Tab';
      default:
        break;
    }
  }
  deleteTratamiento(income: any) {

    const r = confirm('¿Eliminar Plan de tratamiento?');
    if (r === true) {
      this.loadingRecords = true;

      const id = income ? `id: ${income.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id ';

      this.apiService.saveProcedimientopaciente(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loadingRecords = false;

          this.getProcedimientoPaciente();
          this.getEvolutionTratamiento();

          this.snackBar.open('Eliminado', null, {
            duration: 4000
          });
        },
        error => {
          this.loadingRecords = false;
          this.snackBar.open('Error.', null, {
            duration: 4000
          });

          console.log(error);
        }
      );
    }
  }

  deleteConsentimiento(income: any) {

    const r = confirm('¿Eliminar el consentimiento?');
    if (r === true) {
      this.loadingRecords = true;

      const id = income ? `id: ${income.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id ';

      this.apiService.saveConsentimientoPaciente(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loadingRecords = false;

          this.getConsentimiento();

          this.snackBar.open('Eliminado', null, {
            duration: 4000
          });
        },
        error => {
          this.loadingRecords = false;
          this.snackBar.open('Error.', null, {
            duration: 4000
          });

          console.log(error);
        }
      );
    }
  }

  deleteDiente(income: any) {

    const r = confirm('¿Eliminar Plan de tratamiento?');
    if (r === true) {
      this.loadingRecords = true;

      const id = income ? `id: ${income.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id ';

      this.apiService.saveOdontograma(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loadingRecords = false;

          this.getOdontograma();
          this.getDientes();
          // this.getDiente17();
          // this.getDiente16();
          // this.getDiente15();
          // this.getDiente14();
          // this.getDiente13();
          // this.getDiente12();
          // this.getDiente11();

          // this.getDiente28();
          // this.getDiente27();
          // this.getDiente26();
          // this.getDiente25();
          // this.getDiente24();
          // this.getDiente23();
          // this.getDiente22();
          // this.getDiente21();

          // this.getDiente48();
          // this.getDiente47();
          // this.getDiente46();
          // this.getDiente45();
          // this.getDiente44();
          // this.getDiente43();
          // this.getDiente42();
          // this.getDiente41();

          // this.getDiente38();
          // this.getDiente37();
          // this.getDiente36();
          // this.getDiente35();
          // this.getDiente34();
          // this.getDiente33();
          // this.getDiente32();
          // this.getDiente31();
          
          this.snackBar.open('Eliminado', null, {
            duration: 4000
          });
        },
        error => {
          this.loadingRecords = false;
          this.snackBar.open('Error.', null, {
            duration: 4000
          });

          console.log(error);
        }
      );
    }
  }

  savePlanTratamiento() {

    this.sending = true;
    const valor = `valor: ${this.total} ,`;
    const queryParams = `patient_id:"${this.currentPatient.identification}",record_id:"${this.currentRecord.identification}",  ${valor}  `;
    const queryProps = 'id, record_id, valor, patient_id, user_id';

    this.apiService.savePlanTratamiento(queryParams, queryProps).subscribe(
      (response: any) => {
        this.sending = false;

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });

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
  diente18: any = null;
  diente17: any = null;
  diente16: any = null;
  diente15: any = null;
  diente14: any = null;
  diente13: any = null;
  diente12: any = null;
  diente11: any = null;

  diente55: any = null;
  diente54: any = null;
  diente53: any = null;
  diente52: any = null;
  diente51: any = null;

  diente65: any = null;
  diente64: any = null;
  diente63: any = null;
  diente62: any = null;
  diente61: any = null;

  diente85: any = null;
  diente84: any = null;
  diente83: any = null;
  diente82: any = null;
  diente81: any = null;

  diente75: any = null;
  diente74: any = null;
  diente73: any = null;
  diente72: any = null;
  diente71: any = null;

  diente28: any = null;
  diente27: any = null;
  diente26: any = null;
  diente25: any = null;
  diente24: any = null;
  diente23: any = null;
  diente22: any = null;
  diente21: any = null;

  diente48: any = null;
  diente47: any = null;
  diente46: any = null;
  diente45: any = null;
  diente44: any = null;
  diente43: any = null;
  diente42: any = null;
  diente41: any = null;

  diente38: any = null;
  diente37: any = null;
  diente36: any = null;
  diente35: any = null;
  diente34: any = null;
  diente33: any = null;
  diente32: any = null;
  diente31: any = null;

  getDientes() {
    this.loading = true;
    const status = 1;
    const queryParams = `record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, cervical, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        
        result.data.getDienteIndidual.forEach(element => {

          if (element.diente_id === 18) { this.diente18 = element; }
          if (element.diente_id === 17) { this.diente17 = element; }
          if (element.diente_id === 16) { this.diente16 = element; }
          if (element.diente_id === 15) { this.diente15 = element; }
          if (element.diente_id === 14) { this.diente14 = element; }
          if (element.diente_id === 13) { this.diente13 = element; }
          if (element.diente_id === 12) { this.diente12 = element; }
          if (element.diente_id === 11) { this.diente11 = element; }

          if (element.diente_id === 28) { this.diente28 = element; }
          if (element.diente_id === 27) { this.diente27 = element; }
          if (element.diente_id === 26) { this.diente26 = element; }
          if (element.diente_id === 25) { this.diente25 = element; }
          if (element.diente_id === 24) { this.diente24 = element; }
          if (element.diente_id === 23) { this.diente23 = element; }
          if (element.diente_id === 22) { this.diente22 = element; }
          if (element.diente_id === 21) { this.diente21 = element; }

          //dientes niños

          if (element.diente_id === 55) { this.diente55 = element; }
          if (element.diente_id === 54) { this.diente54 = element; }
          if (element.diente_id === 53) { this.diente53 = element; }
          if (element.diente_id === 52) { this.diente52 = element; }
          if (element.diente_id === 51) { this.diente51 = element; }

          if (element.diente_id === 65) { this.diente65 = element; }
          if (element.diente_id === 64) { this.diente64 = element; }
          if (element.diente_id === 63) { this.diente63 = element; }
          if (element.diente_id === 62) { this.diente62 = element; }
          if (element.diente_id === 61) { this.diente61 = element; }

          if (element.diente_id === 65) { this.diente65 = element; }
          if (element.diente_id === 64) { this.diente64 = element; }
          if (element.diente_id === 63) { this.diente63 = element; }
          if (element.diente_id === 62) { this.diente62 = element; }
          if (element.diente_id === 61) { this.diente61 = element; }

          if (element.diente_id === 75) { this.diente75 = element; }
          if (element.diente_id === 74) { this.diente74 = element; }
          if (element.diente_id === 73) { this.diente73 = element; }
          if (element.diente_id === 72) { this.diente72 = element; }
          if (element.diente_id === 71) { this.diente71 = element; }   

          //fin

          if (element.diente_id === 38) { this.diente38 = element; }
          if (element.diente_id === 37) { this.diente37 = element; }
          if (element.diente_id === 36) { this.diente36 = element; }
          if (element.diente_id === 35) { this.diente35 = element; }
          if (element.diente_id === 34) { this.diente34 = element; }
          if (element.diente_id === 33) { this.diente33 = element; }
          if (element.diente_id === 32) { this.diente32 = element; }
          if (element.diente_id === 31) { this.diente31 = element; }

          if (element.diente_id === 48) { this.diente48 = element; }
          if (element.diente_id === 47) { this.diente47 = element; }
          if (element.diente_id === 46) { this.diente46 = element; }
          if (element.diente_id === 45) { this.diente45 = element; }
          if (element.diente_id === 44) { this.diente44 = element; }
          if (element.diente_id === 43) { this.diente43 = element; }
          if (element.diente_id === 42) { this.diente42 = element; }
          if (element.diente_id === 41) { this.diente41 = element; }
          
        });
        

        console.log('result.data.getDienteIndidual', result.data.getDienteIndidual)

        console.log('diente 18',this.diente18);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
 

  finalizar() {
    this.savePatient()
    this.saveDetails()
    this.saveConclusion()
    this.openMedicalRecipe()
  }
}
