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
    selector: 'app-planTratamiento',
    templateUrl: './planTratamiento.component.html',
    styleUrls: ['./planTratamiento.component.scss'],
    animations: [
        stagger80ms,
        scaleIn400ms,
        fadeInRight400ms,
        fadeInUp400ms
    ]
})
export class PlanTratamientoComponent implements OnInit, AfterViewInit, OnDestroy {
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
    displayedColumns: string[] = ['service', 'doctor',  'date_1', 'valor', 'status', 'options'];
    currentRecord: any = null;
    currentPatient: Patient;
    filters = new FormGroup({
        search: new FormControl('', []),
        date: new FormControl('', []),
        date2: new FormControl('', []),
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
    ) { }

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
        }

        if (record.evolution) { }

        if (record.laboratory) { }

        if (record.birth) { }

        if (record.labor) { }
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
    public filteredServerSideDiagnoses: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public filteredServerSideProcedures: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    ngOnDestroy() {

    }
    ngAfterViewInit() {

    }
    selectRecordPatientGuard(record: any) {
        this.router.navigate(['/app/records/view', record.record_id]);
    }
    getRecordControl() {
        this.loading = true;
        const patientId = this.id = this.route.snapshot.paramMap.get('recordPatient');
        const queryParams = `patient_id:"${patientId}"`;
        const queryProps =
            // tslint:disable-next-line:max-line-length
            'id, user{id, name}, nombre, valor, status, user_id, record_id, patient_id, created_at';

        this.apiService.getPlanTratamiento(queryParams, queryProps).subscribe(
            (result: any) => {
                this.loading = false;
                this.tableData = result.data.getPlanTratamiento;
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
            'id,identification, popq{id, popq_Aa, popq_Ba, popq_C, popq_gh, popq_pb, popq_tvl, popq_Ap, popq_Bp, popq_D}, diagnoses{ id, diagnose{ id, cod_four, des_four,} },   procedures{ id, procedure{ id, code, description,} },  patient{id, name, identification, civil_status, position, sex, TipoDocumento, birth_date, phone, address, company, email, partner_name, arl, eps, pension, partner_profession, profile_url, chat_id}, details{id, motive, menarche, cycles, record_fur, record_g, record_p, record_v, record_a, record_pp, record_up, record_prs, record_fpp, amenorrhea}, physical{id,physical_ta, physical_fc, weight, height, head, neck, thorax, pregnancy, exams}, evolutions{id, date, details, rejuv, mona}, observations{id, description}, pregnancies{id,date,description}, coombs{id,date,description}, htos{id,date,description}, hbs{id,date,description}, cits{id,date,description}, vaccines{id,date,description}, citologies{id,date,description}, laboratory{id, patient_group, patient_rh, partner_group, partner_rh}, labor{id, date, time, labor_ta, labor_fcf, membranes, presentation, observations}, birth{id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations}, medicines{id, medicine{id,name,atc_code,active,administration,pos,cum}, dose, measure, frequency, duration, quantity, administration}, conclusion{id, surgical, pathological, notes, diagnosis, tests, behavior, process, pharmacological, family, allergies, diagnostic, diagnostic_type, toxicologist, occupational, external_cause, purpose, procedure_id, current_illness, authorization_number, rel_diagnostic{id,cod_four,des_four}, rel_procedure{id,code,description}}, multimedias{id,name,description,url,type,status,created_at}, created_at';

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
        this.router.navigate(['/app/records/view', currentRecord.identification,]);
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
        const win = window.open(`http://hcapi.clinicalsoftware.org/examen/${user.identification}`, '_blank');
        // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
        win.focus();
    }
    openMedicalMedicamento(user: any = null) {
        const win = window.open(`http://hcapi.clinicalsoftware.org/medicamento/${user.identification}`, '_blank');
        // this.router.navigate(['/app/control', this.currentPatient.identification, this.currentRecord.identification,]);
        win.focus();
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
        this.id = this.route.snapshot.paramMap.get('identification',);
        this.getRecordControl();
        let record$ = this.route.paramMap.pipe(switchMap((params: ParamMap) => of(params.get('recordId'))));
        this.patient_id = this.route.snapshot.paramMap.get('recordPatient');
        record$.subscribe(recordId => {
            this.getRecord(recordId);
            this.novedad;
            console.log('datos de detalle', this.getRecord);
            // this.getRecordMultimedia(recordId);


        });
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