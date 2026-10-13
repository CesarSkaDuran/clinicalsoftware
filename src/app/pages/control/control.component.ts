import {
    Component,
    OnInit,
    Inject,
    AfterViewInit,
    OnDestroy
} from '@angular/core';

import * as moment from 'moment';
import {
    ApiService
} from 'src/app/core/api/api.service';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialog
} from '@angular/material/dialog';
import {
    MatSnackBar
} from '@angular/material/snack-bar';
import icEdit from '@iconify/icons-ic/twotone-edit';
import {
    FormControl,
    Validators,
    FormGroup,
    FormBuilder
} from '@angular/forms';
import icAdd from '@iconify/icons-ic/twotone-add';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icAssignment from '@iconify/icons-ic/twotone-assignment-ind';
import {
    RecordsService
} from 'src/app/pages/records/records.service';

import {
    filter,
    tap,
    takeUntil,
    debounceTime,
    distinctUntilChanged,
    switchMap
} from 'rxjs/operators';
import {
    ReplaySubject,
    Subject,
    of
} from 'rxjs';
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
import baselineOpenInNew from '@iconify/icons-ic/baseline-open-in-new';
import baselineRemoveRedEye from '@iconify/icons-ic/baseline-remove-red-eye';
import {
    stagger80ms
} from 'src/@vex/animations/stagger.animation';
import {
    scaleIn400ms
} from 'src/@vex/animations/scale-in.animation';
import {
    fadeInRight400ms
} from 'src/@vex/animations/fade-in-right.animation';
import {
    fadeInUp400ms
} from 'src/@vex/animations/fade-in-up.animation';
import {
    MedicineModalComponent
} from 'src/app/modals/medicineModal/medicine-modal.compnent';
import {
    ProcedureModalComponent
} from 'src/app/modals/procedureModal/procedure-modal.component';
import {
    ActivatedRoute,
    ParamMap,
    Router
} from '@angular/router';
import {
    CredentialsService
} from 'src/app/core';
import {
    Lightbox
} from 'ngx-lightbox';
import {
    HttpClient
} from '@angular/common/http';
import {
    diagnosticModalComponent
} from 'src/app/modals/diagnosticModal/diagnostic-modal.component';
import {
    Patient
} from 'src/app/models/patient';
import {
    NewUserModalComponent
} from 'src/app/modals/newUserModal/new-user-modal.component';
import {
    PatientsModalComponent
} from 'src/app/modals/patientsModal/patients-modal.component';
import { EvolutionModalComponent } from 'src/app/modals/evolutionModal/evolution-modal.component';
import { PatientFormModalComponent } from 'src/app/modals/patientFormModal/patient-form-modal.component';
import { FechaConsultaComponent } from 'src/app/modals/fechaConsulta/fechaConsulta.component';
import keyIcon from '@iconify/icons-fa-solid/key';
import chat from '@iconify/icons-ic/chat';
import baselineCheck from '@iconify/icons-ic/baseline-check';
import baselineLocalHospital from '@iconify/icons-ic/baseline-local-hospital';
moment.locale('es');

@Component({
    selector: 'app-control',
    templateUrl: './control.component.html',
    styleUrls: ['./control.component.scss'],
    animations: [
        stagger80ms,
        scaleIn400ms,
        fadeInRight400ms,
        fadeInUp400ms
    ]
})
export class ControlComponent implements OnInit, AfterViewInit, OnDestroy {
    icDelete = icDelete;
    icEdit = icEdit;
    icDone = icDone;
    icBlock = icBlock;
    icRemove = icRemove;
    icCall = icCall;
    icHistory = icHistory;
    icPhysic = icPhysic;
    icConclusion = icConclusion;
    icEvolution = icEvolution;
    icMultimedia = icMultimedia;
    icPopq = icPopq;
    icControl = icControl;
    icInfo = icInfo;
    icPatient = icPatient;
    baselineCheck = baselineCheck;
    icPrint = icPrint;
    icChat = icChat;
    chat = chat;
    keyIcon = keyIcon;
    baselineRemoveRedEye = baselineRemoveRedEye;
    baselineOpenInNew = baselineOpenInNew;
    baselineLocalHospital = baselineLocalHospital;
    tableData: any[] = [];
    loading = false;
    sending = false;
    id = "";
    displayedColumns: string[] = ['date_1', 'doctor', 'service',  'status', 'options'];
    currentRecord: any = null;
    currentPatient: Patient;
    filters = new FormGroup({
        search: new FormControl('', []),
        date: new FormControl('', []),
        date2: new FormControl('', []),
    });


    patient = new FormGroup({
        id: new FormControl('', []),
        identification: new FormControl('', []),
        name: new FormControl(null, []),
        civil_status: new FormControl('1', []),
        TipoDocumento: new FormControl('1', []),
        sex: new FormControl('Masculino', []),
        position: new FormControl('', []),
        birth_date: new FormControl('', []),
        phone: new FormControl('', []),
        address: new FormControl('', []),
        grupo_sanguineo: new FormControl('', []),
        eps: new FormControl('0', []),
        arl: new FormControl('0', []),
        pension: new FormControl('0', []),
        email: new FormControl('', []),
        partner_name: new FormControl('', []),
        partner_profession: new FormControl('', []),
        create_user: new FormControl(false, [])
    });

    obs = new FormGroup({
        id: new FormControl('', []),
        // date: new FormControl('', []),
        // rejuv: new FormControl('', []),
        // mona: new FormControl('', []),
        motive: new FormControl('', [Validators.required]),
        // details: new FormControl(null, []),
        tests: new FormControl('', []),
        behavior: new FormControl('', []),
        process: new FormControl('', []),
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
        surgical: new FormControl('', []),
        current_illness: new FormControl('', []),
        pathological: new FormControl('', []),
        notes: new FormControl('', []),
        diagnosis: new FormControl('', []),
        pharmacological: new FormControl('', []),
        physical_ta: new FormControl('', []),
        physical_fc: new FormControl('', []),
        weight: new FormControl('', []),
        height: new FormControl('', []),
        head: new FormControl('', []),
        neck: new FormControl('', []),
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

    });
    novedad: any = {};
    patient_id: any;
    patientsModalIsOpen = false;
    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private recordsService: RecordsService,
        // private credentialsService: CredentialsService,
        private router: Router,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        // private _lightbox: Lightbox,
        // private fb: FormBuilder,
        // private http: HttpClient
    ) {}

    setRecordFromCache() {
        let currentRecord = this.recordsService.getCurrentRecordFromCache();

        this.setCurrentRecord(currentRecord);
    }
  

    setCurrentRecord(record: any) {
        this.currentRecord = record;
        //this.loadControls();

        if (record.details) {

            if (record.details.record_fur) {
                // this.setAmenhorrea(record.details.record_fur);
            }
            // this.details.setValue(record.details);
            // this.details.controls.record_fur.setValue(moment(record.details.record_fur).toISOString());
        }

        if (record.physical) {
            // this.physical.setValue(record.physical);           
        }

        if (record.patient) {
            this.currentPatient = record.patient;

            if (this.currentPatient) {
                this.patient.setValue({
                    id: this.currentPatient.id ? this.currentPatient.id : '',
                    identification: this.currentPatient.identification ? this.currentPatient.identification : '',
                    name: this.currentPatient.name ? this.currentPatient.name : '',
                    civil_status: this.currentPatient.civil_status ? this.currentPatient.civil_status : '',
                    position: this.currentPatient.position ? this.currentPatient.position : '',
                    birth_date: this.currentPatient.birth_date ? this.currentPatient.birth_date : '',
                    phone: this.currentPatient.phone ? this.currentPatient.phone : '',
                    address: this.currentPatient.address ? this.currentPatient.address : '',
                    grupo_sanguineo: this.currentPatient.grupo_sanguineo ? this.currentPatient.grupo_sanguineo.toString() : '',
                    eps: this.currentPatient.eps ? this.currentPatient.eps.toString() : '',
                    arl: this.currentPatient.arl ? this.currentPatient.arl.toString() : '',
                    pension: this.currentPatient.pension ? this.currentPatient.pension.toString() : '',
                    email: this.currentPatient.email ? this.currentPatient.email : '',
                    partner_name: this.currentPatient.partner_name ? this.currentPatient.partner_name : '',
                    partner_profession: this.currentPatient.partner_profession ? this.currentPatient.partner_profession : '',
                    sex: this.currentPatient.sex ? this.currentPatient.sex : '',
                    TipoDocumento: this.currentPatient.TipoDocumento ? this.currentPatient.TipoDocumento.toString() : '',
                    create_user: '',
                });
            }
        }

        if (record.evolution) {}

        if (record.laboratory) {}

        if (record.birth) {}

        if (record.labor) {}
        if (record.popq) {

        }
        if (record.conclusion) {

            if (record.conclusion.diagnostic !== null) {
                this.filteredServerSideDiagnoses.next([record.conclusion.rel_diagnostic]);
            }

            if (record.conclusion.procedure_id !== null) {
                this.filteredServerSideProcedures.next([record.conclusion.rel_procedure]);
            }
        }
    }
    public filteredServerSideDiagnoses: ReplaySubject < any[] > = new ReplaySubject < any[] > (1);
    public filteredServerSideProcedures: ReplaySubject < any[] > = new ReplaySubject < any[] > (1);

    ngOnDestroy() {

    }
    ngAfterViewInit() {

    }
    getRecordControl() {
        this.loading = true;
        const patientId = this.id = this.route.snapshot.paramMap.get('recordPatient');
        const queryParams = `patient_id:"${patientId}"`;
        const queryProps =
            // tslint:disable-next-line:max-line-length
            'id, status, identification, user{id, name} popq{id, popq_Aa, popq_Ba, popq_C, popq_gh, popq_pb, popq_tvl, popq_Ap, popq_Bp, popq_D}, diagnoses{ id, diagnose{ id, cod_four, des_four,} },   procedures{ id, procedure{ id, code, description,} },  patient{id, name, identification, civil_status, position, sex, TipoDocumento, birth_date, phone, address, grupo_sanguineo, arl, pension,TipoDocumento, company, email, partner_name, arl, eps, pension, partner_profession, profile_url, chat_id}, details{id, motive, menarche, cycles, record_fur, record_g, record_p, record_v, record_a, record_pp, record_up, record_prs, record_fpp, amenorrhea}, physical{id,physical_ta, physical_fc, weight, height, head, neck, thorax, pregnancy, exams}, evolutions{id, date, details, rejuv, mona}, observations{id, description}, pregnancies{id,date,description}, coombs{id,date,description}, htos{id,date,description}, hbs{id,date,description}, cits{id,date,description}, vaccines{id,date,description}, citologies{id,date,description}, laboratory{id, patient_group, patient_rh, partner_group, partner_rh}, labor{id, date, time, labor_ta, labor_fcf, membranes, presentation, observations}, birth{id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations}, medicines{id, medicine{id,name,atc_code,active,administration,pos,cum}, dose, measure, frequency, duration, quantity, administration}, conclusion{id, surgical, pathological, notes, diagnosis, tests, behavior, process, pharmacological, family, allergies, diagnostic, diagnostic_type, toxicologist, occupational, external_cause, purpose, procedure_id, current_illness, authorization_number, rel_diagnostic{id,cod_four,des_four}, rel_procedure{id,code,description}}, multimedias{id,name,description,url,type,status,created_at}, created_at';

        this.apiService.getRecordControl(queryParams, queryProps).subscribe(
            (result: any) => {
                this.loading = false;
                this.tableData = result.data.recordControl;
                //  this.filteredtableData.next(result.data.recordControl.slice());
                //   console.log('novedades ', this.novedad)


                console.log(result);
                console.log('datos de control', this.tableData);
            },
            (error: any) => {
                this.loading = false;
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
    getRecord(id: any) {
        this.loading = true;
        const queryParams = `id: "${id}"`;
        const queryProps =
            // tslint:disable-next-line:max-line-length
            'id,identification, popq{id, popq_Aa, popq_Ba, popq_C, popq_gh, popq_pb, popq_tvl, popq_Ap, popq_Bp, popq_D}, diagnoses{ id, diagnose{ id, cod_four, des_four,} },   procedures{ id, procedure{ id, code, description,} },  patient{id, name, identification, civil_status, position, sex, TipoDocumento, birth_date, phone, address,  grupo_sanguineo, arl, pension, company, email, partner_name, arl, eps, pension, partner_profession, profile_url, chat_id}, details{id, motive, menarche, cycles, record_fur, record_g, record_p, record_v, record_a, record_pp, record_up, record_prs, record_fpp, amenorrhea}, physical{id,physical_ta, physical_fc, weight, height, head, neck, thorax, pregnancy, exams}, evolutions{id, date, details, rejuv, mona}, observations{id, description}, pregnancies{id,date,description}, coombs{id,date,description}, htos{id,date,description}, hbs{id,date,description}, cits{id,date,description}, vaccines{id,date,description}, citologies{id,date,description}, laboratory{id, patient_group, patient_rh, partner_group, partner_rh}, labor{id, date, time, labor_ta, labor_fcf, membranes, presentation, observations}, birth{id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations}, medicines{id, medicine{id,name,atc_code,active,administration,pos,cum}, dose, measure, frequency, duration, quantity, administration}, conclusion{id, surgical, pathological, notes, diagnosis, tests, behavior, process, pharmacological, family, allergies, diagnostic, diagnostic_type, toxicologist, occupational, external_cause, purpose, procedure_id, current_illness, authorization_number, rel_diagnostic{id,cod_four,des_four}, rel_procedure{id,code,description}}, multimedias{id,name,description,url,type,status,created_at}, created_at';

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
    selectRecord(currentRecord: any) {
        console.log(currentRecord);
        this.apiService.setRecord(currentRecord);
        this.router.navigate(['/app/records/view', currentRecord.identification, ]);
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
               
                // this.router.navigate(['/app/records/view', user.identification,]);
                if (result.created) {
                    localStorage.setItem('userCreated', 'true');
                }

                if (result) {
                    this.selectRecord(result);
                }
            });
        }
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
                this.router.navigate(['/app/control', this.currentRecord.patient.identification, this.currentRecord.identification]);
            }
        });
    }

    openDate(fecha: any): void {
        const dialogRef = this.dialog.open(FechaConsultaComponent, {
            width: '450px',
            height: '250px',
            maxHeight: '800px',
            data: {
                fecha
            }
        });

        dialogRef.afterClosed().subscribe(result => {
          
            if (result) {
                this.getRecordControl();
               
            }
        });
    }
    ageFromDate(date: string) {
        return moment().diff(moment(date), 'years');
    }
    toPrint(user: any = null) {
        const url = `/#/records/print/${user.identification}`;
        const win = window.open(url, '_blank');
        win.focus();
        // this.router.navigate(['/records/print', this.apiService.currentRecord.identification]);
    }
    openMedicalRecipe(user: any = null) {
        const win = window.open(`https://hcapi.clinicalsoftware.org/recipe/${user.identification}`, '_blank');
        win.focus();
    }
    openMedicalExamen(user: any = null) {
        const win = window.open(`https://hcapi.clinicalsoftware.org/examen/${user.identification}`, '_blank');
        // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
        win.focus();
    }
    openMedicalMedicamento(user: any = null) {
        const win = window.open(`https://hcapi.clinicalsoftware.org/medicamento/${user.identification}`, '_blank');
        // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
        win.focus();
    }
    planesTratamiento(){
        this.router.navigate(['/app/planTratamiento', this.currentRecord.patient.identification, this.currentRecord.identification]);
    }
    openEvoModal(evolution: any = null) {
        const dialogRef = this.dialog.open(EvolutionModalComponent, {
            width: '880px',
            height: '570px;',
            maxHeight: '800px',
            data: {
                evolution: evolution,
               
            }

        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) { return; }

            this.getRecord(this.currentRecord.identification);

            console.log(result);
        });
    }
    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('identification', );
        this.getRecordControl();
        let record$ = this.route.paramMap.pipe(switchMap((params: ParamMap) => of (params.get('recordId'))));
        this.patient_id = this.route.snapshot.paramMap.get('recordPatient');
        record$.subscribe(recordId => {
            this.getRecord(recordId);
            this.novedad;
            console.log('datos de detalle', this.getRecord);
            // this.getRecordMultimedia(recordId);


        });
    }

    savePatient() {
        this.sending = true;
        const data = this.patient.value;

        const id = data.id ? `id: ${this.currentPatient.id},` : '';
        const identification = data.identification != '' ? `identification: "${data.identification}",` : '';
        const name = data.name != '' ? `name: "${data.name}",` : '';
        const civil_status = data.civil_status != '' ? `civil_status: "${data.civil_status}",` : '';
        const TipoDocumento = data.TipoDocumento != '' ? `TipoDocumento: "${data.TipoDocumento}",` : '';
        const sex = data.sex != '' ? `sex: "${data.sex}",` : '';
        const position = data.position != '' ? `position: "${data.position}",` : '';
        const birth_date = data.birth_date != '' ? `birth_date: "${moment(data.birth_date).format('YYYY-MM-DD')}",` : '';
        const phone = data.phone != '' ? `phone: "${data.phone}",` : '';
        const grupo_sanguineo = data.grupo_sanguineo != '' ? `grupo_sanguineo: "${data.grupo_sanguineo}",` : '';
        const email = data.email != '' ? `email: "${data.email}",` : '';
        const address = data.address != '' ? `address: "${data.address}",` : '';
        const partner_name = data.partner_name != '' ? `partner_name: "${data.partner_name}",` : '';
        const partner_profession = data.partner_profession != '' ? `partner_profession: "${data.partner_profession}",` : '';
        const makeRecord = data.id ? `` : 'make_record: 1,';
        const arl = data.arl != '' ? `arl: ${data.arl},` : '';
        const eps = data.eps != '' ? `eps: ${data.eps},` : '';
        const pension = data.pension != '' ? `pension: ${data.pension},` : '';
        const create_user = data.create_user != '' ? `create_user: "${data.create_user}",` : '';

        console.log(create_user);

        const queryParams = `${id} ${identification} ${name} ${civil_status} ${position} ${TipoDocumento} ${sex} ${birth_date} ${phone} ${grupo_sanguineo} ${email} ${address} ${partner_name} ${partner_profession} ${makeRecord} ${eps} ${arl} ${pension} ${create_user}`;
        const queryProps =
            'id, name, identification, civil_status, position, sex, TipoDocumento, birth_date, phone, grupo_sanguineo, email, address, partner_name, partner_profession, eps, arl, pension, records{id, identification, motive}';

        this.apiService.savePatient(queryParams, queryProps).subscribe(
            (response: any) => {
                console.log(response);
                this.sending = false;
                this.snackBar.open('Guardado', null, {
                    duration: 4000
                });
                this.getRecord(this.patient_id);
                // this.close({ patient: response.data.savePatient, created: data.create_user == true });
            },
            error => {
                this.sending = false;
                // this.snackBar.open('Error.', null, {
                //   duration: 4000
                // });

                console.log(error);
            }
        );
    }

    save() {
        this.sending = true;
        const data = this.obs.value;
        console.log(data);
        const id = data.id ? `id: ${data.id},` : '';

        const process = data.process !== '' && data.process !== null ? `process: "${data.process}",` : `process: ".",`;
        const behavior = data.behavior !== '' && data.behavior !== null ? `behavior: "${data.behavior}",` : `behavior: ".",`;
        const tests = data.tests !== '' && data.tests !== null ? `tests: "${data.tests}",` : `tests: ".",`;
        const toxicologist = data.toxicologist !== '' && data.toxicologist !== null ? `toxicologist: "${data.toxicologist}",` : `toxicologist: ".",`;
        const occupational = data.occupational !== '' && data.occupational !== null ? `occupational: "${data.occupational}",` : `occupational: ".",`;
        const purpose = data.purpose !== '' && data.purpose !== null ? `purpose: "${data.purpose}",` : `purpose: ".",`;
        const procedure = data.procedure !== '' && data.procedure !== null ? `procedure: "${data.procedure}",` : `procedure: ".",`;
        const authorization_number = data.authorization_number !== '' && data.authorization_number !== null ? `authorization_number: "${data.authorization_number}",` : `authorization_number: ".",`;
        const pharmacological = data.pharmacological !== '' && data.pharmacological !== null ? `pharmacological: "${data.pharmacological}",` : `pharmacological: ".",`;
        const family = data.family !== '' && data.family !== null ? `family: "${data.family}",` : `family: ".",`;
        const allergies = data.allergies !== '' && data.allergies !== null ? `allergies: "${data.allergies}",` : `allergies: ".",`;
        const diagnostic = data.diagnostic !== '' && data.diagnostic !== null ? `diagnostic: "${data.diagnostic.id}",` : '';
        const motive = data.motive !== '' && data.motive !== null ? `motive: "${data.motive}",` : `motive: ".",`;
        const external_cause = data.external_cause !== '' && data.external_cause !== null ? `external_cause: "${data.external_cause}",` : `external_cause: ".",`;
        const surgical = data.surgical !== '' && data.surgical !== null ? `surgical: "${data.surgical}",` : `surgical: ".",`;
        const current_illness = data.current_illness !== '' && data.current_illness !== null ? `current_illness: "${data.current_illness}",` : `current_illness: ".",`;
        const pathological = data.pathological !== '' && data.pathological !== null ? `pathological: "${data.pathological}",` : `pathological: ".",`;
        const notes = data.notes !== '' && data.notes !== null ? `notes: "${data.notes}",` : `notes: ".",`;
        const diagnosis = data.diagnosis !== '' && data.diagnosis !== null ? `diagnosis: "${data.diagnosis}",` : `diagnosis: ".",`;
        const physical_ta = data.physical_ta !== '' && data.physical_ta !== null ? `physical_ta: "${data.physical_ta}",` : `physical_ta: ".",`;
        const physical_fc = data.physical_fc !== '' && data.physical_fc !== null ? `physical_fc: "${data.physical_fc}",` : `physical_fc: ".",`;
        const weight = data.weight !== '' && data.weight !== null ? `weight: "${data.weight}",` : `weight: ".",`;
        const height = data.height !== '' && data.height !== null ? `height: "${data.height}",` : `height: ".",`;
        const head = data.head !== '' && data.head !== null ? `head: "${data.head}",` : `head: ".",`;
        const neck = data.neck !== '' && data.neck !== null ? `neck: "${data.neck}",` : `neck: ".",`;
        const thorax = data.thorax !== '' && data.thorax !== null ? `thorax: "${data.thorax}",` : `thorax: ".",`;
        const pregnancy = data.pregnancy !== '' && data.pregnancy !== null ? `pregnancy: "${data.pregnancy}",` : `pregnancy: ".",`;
        const exams = data.exams !== '' && data.exams !== null ? `exams: "${data.exams}",` : `exams: ".",`;
        const sao = data.sao !== '' && data.sao !== null ? `sao: "${data.sao}",` : `sao: ".",`;
        const temperature = data.temperature !== '' && data.temperature !== null ? `temperature: "${data.temperature}",` : `temperature: ".",`;
        const tension = data.tension !== '' && data.tension !== null ? `tension: "${data.tension}",` : `tension: ".",`;
        const mental = data.mental !== '' && data.mental !== null ? `mental: "${data.mental}",` : `mental: ".",`;
        const skin = data.skin !== '' && data.skin !== null ? `skin: "${data.skin}",` : `skin: ".",`;
        const pulm = data.pulm !== '' && data.pulm !== null ? `pulm: "${data.pulm}",` : `pulm: ".",`;
        const abdomen = data.abdomen !== '' && data.abdomen !== null ? `abdomen: "${data.abdomen}",` : `abdomen: ".",`;
        const extremities = data.extremities !== '' && data.extremities !== null ? `extremities: "${data.extremities}",` : `extremities: ".",`;
        const neurol = data.neurol !== '' && data.neurol !== null ? `neurol: "${data.neurol}",` : `neurol: ".",`;
        //  const record = this.data.record_id != '' ? `record_id: "${this.data.record_id}",` : '';

        const queryParams = `${id} identification: "${this.id}", ${neurol} ${extremities} ${abdomen} ${pulm} ${skin}  ${mental} ${tension} ${temperature} ${sao} ${exams} ${pregnancy} ${thorax} ${neck} ${head} ${height} ${weight} ${physical_fc} ${physical_ta}  ${diagnosis} ${notes} ${pathological} ${current_illness}  ${surgical} ${external_cause} ${motive}   ${process} ${behavior} ${tests}  ${allergies} ${diagnostic} ${toxicologist} ${occupational} ${purpose} ${procedure} ${authorization_number} ${pharmacological} ${family}`;
        const queryProps = 'id ';

        this.apiService.saveNuevoControl(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close();

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

    close(): void {
        // close lightbox programmatically
        //this._lightbox.close();
    }

    openMedicine(medicine: any = null): void {
        const dialogRef = this.dialog.open(MedicineModalComponent, {
            width: '1204px',
            height: '464px',
            maxHeight: '800px',
            data: {
                medicine,
                // record_id: this.currentRecord.identification
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // this.getRecord(this.currentRecord.identification);
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
                // record_id: this.currentRecord.identification
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // this.getRecord(this.currentRecord.identification);
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

}