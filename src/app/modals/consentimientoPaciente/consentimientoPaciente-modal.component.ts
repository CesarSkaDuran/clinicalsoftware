import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';
import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import icEdit from '@iconify/icons-ic/twotone-edit';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import icAdd from '@iconify/icons-ic/twotone-add';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icAssignment from '@iconify/icons-ic/twotone-assignment-ind';
import { RecordsService } from 'src/app/pages/records/records.service';
import { MedicineModalComponent } from '../medicineModal/medicine-modal.compnent';
import { filter, tap, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { ProcedureModalComponent } from '../procedureModal/procedure-modal.component';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { ConsentimientoModalComponent } from '../consentimiento/consentimiento-modal.component';

moment.locale('es');

@Component({
    selector: 'app-consentimientoPaciente-modal',
    templateUrl: './consentimientoPaciente-modal.component.html',

    animations: [
        stagger80ms,
        scaleIn400ms,
        fadeInRight400ms,
        fadeInUp400ms
    ]
})
export class ConsentimientoPacienteModalComponent implements OnInit, AfterViewInit, OnDestroy {
    medFilterCtrl: FormControl = new FormControl();
    public filteredServerSideMedicines: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public searchingMedicines = false;
    sending = false;
    selected: any = null;
    currentRecord: any = null;
    icAdd = icAdd;
    icDelete = icDelete;
    icAssignment = icAssignment;
    controlsData: any[] = [];
    obs = new FormGroup({
        id: new FormControl('', []),
        date: new FormControl('', []),
        nombre: new FormControl('', []),
        doctor_id: new FormControl('', []),
        obs: new FormControl(null, []),
        // tests: new FormControl('', []),
        // behavior: new FormControl('', []),
        // process: new FormControl('', []),

    });

    icEdit = icEdit;
    evoId: number;
    diagFilterCtrl: FormControl = new FormControl();
    public filteredServerSideProcedures: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    items: any[] = [];
    public filteredServerSideDiagnoses: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    protected _onDestroy = new Subject<void>();
    public searchingProcedures = false;

    procFilterCtrl: FormControl = new FormControl();
    loadingControls: boolean;
    loading: boolean;
    public searchingDiagnoses = false;
    tableData: any []=[];
    showOnlyName= false;
    editing= false;
    consentimiento: any[] = [];
    doctores: any[] = [];
    constructor(
        public dialogRef: MatDialogRef<ConsentimientoPacienteModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        private recordsService: RecordsService,
        private dialog: MatDialog,
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }
    setRecordFromCache() {
        let currentRecord = this.recordsService.getCurrentRecordFromCache();

        this.setCurrentRecord(currentRecord);
    }
    loadRecords() {
        this.tableData.push(this.data.evolution.identification);
    }
    doctorSelect: any;
    setStrSpaces(string: string) {
    return string.replace(/<br>/g, '\n');
  }
    setValorSeleccionado(index) {
        // this.doctorSelect = index;
        this.obs.controls.obs.setValue(index);
    }

    setDoctorSeleccionado(index){
        this.doctorSelect = index;
    }
   
    setCurrentRecord(record: any) {
        this.currentRecord = record;
        this.loadControls();
        if (record.obs) {
            this.obs.setValue({
                id: record.id,
                date: this.data.appointment.date ? this.data.appointment.date : new Date(),
                // surgical: record.obs.surgical ? record.obs.surgical.replace(/<br>/g, '\n') : '',
                // pathological: record.obs.pathological ? record.obs.pathological.replace(/<br>/g, '\n') : '',
                // notes: record.obs.notes ? record.obs.notes.replace(/<br>/g, '\n') : '',
                obs: record.obs.obs ? record.obs.obs.replace(/<br>/g, '\n') : '',
                // tests: record.obs.tests ? record.obs.tests.replace(/<br>/g, '\n') : '',
                // behavior: record.obs.behavior ? record.obs.behavior.replace(/<br>/g, '\n') : '',
                nombre: record.obs.nombre ? record.obs.nombre : '',
            });

            if (record.obs.diagnostic !== null) {
                this.filteredServerSideDiagnoses.next([record.obs.rel_diagnostic]);
            }

            if (record.obs.procedure_id !== null) {
                this.filteredServerSideProcedures.next([record.obs.rel_procedure]);
            }
        }
      
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

    ngOnInit() {
        this.loadRecords();
        console.log('datos de evolution' ,this.tableData)
        // if (this.data.evolution) {
        //     console.log(this.data.evolution);
        //     this.obs.setValue({
        //         id: this.data.evolution.id,
        //         date: moment(this.data.evolution.date).format('YYYY-MM-DD'),

        //         details: this.data.evolution.details.replace(/<br>/g, '\n'),
        //         process: this.data.evolution.process ? this.data.evolution.process : '',
        //     });
        //     this.evoId = this.data.evolution.id;
        // } else {
        //     this.obs.controls.date.setValue(new Date());
        // }
        // if (this.data.appointment.id) {
        //     this.showOnlyName = true;
        //     this.editing = true;
        // }
        this.getDrRemision()
        this.getConsentimiento()
        this.diagFilterCtrl.valueChanges.pipe(
            filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length <= 1),
            tap(() => this.searchingDiagnoses = true),
            takeUntil(this._onDestroy),
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(term => this.apiService.getConsentimiento(`search: "${term}"`, 'id, nombre, obs, doctor_id'))
        ).subscribe((results: any) => {
            console.log(results);
            this.searchingDiagnoses = false;
            this.filteredServerSideDiagnoses.next(results.data.getConsentimiento);
        }, error => {
            this.searchingDiagnoses = false;
        });
        this.procFilterCtrl.valueChanges.pipe(
            filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 3),
            tap(() => this.searchingProcedures = true),
            takeUntil(this._onDestroy),
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(term => this.apiService.getDrRemision(`search: "${term}"`, 'id,nombre,especializacion'))
        ).subscribe((results: any) => {
            console.log(results);
            this.searchingProcedures = false;
            this.filteredServerSideProcedures.next(results.data.getDrRemision);
        }, error => {
            this.searchingProcedures = false;
        });
        if (this.data.medicine && this.data.medicine.medicine !== null) {
            this.filteredServerSideMedicines.next([this.data.medicine.medicine]);
        }
        this.medFilterCtrl.valueChanges.pipe(
            filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 3),
            tap(() => this.searchingMedicines = true),
            takeUntil(this._onDestroy),
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(term => this.apiService.getMedicines(`search: "${term}"`, 'id,name,atc_code,active,administration,pos,cum'))
        ).subscribe((results: any) => {
            console.log(results);
            this.searchingMedicines = false;
            this.filteredServerSideMedicines.next(results.data.medicines);
        }, error => {
            this.searchingMedicines = false;
        });
    }
    openMedicalRecipe() {
        const win = window.open(`https://hcapi.clinicalsoftware.org/recipe/${this.data.record.identification}`, '_blank');
        win.focus();
    }
    
    ngAfterViewInit() { }
    
    dataObs:any;
    
    save() {
        this.sending = true;
        const data = this.obs.value;
        this.dataObs = data.obs;
        console.log(data);

        //const id = this.data.evolution ? `id: ${data.id},` : '';
        const obs = `obs: "${this.dataObs}",`;
        const date = data.date != '' ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : '';
        const nombre = data.nombre && data.nombre != '' ? `nombre: "${data.nombre}",` : 'nombre:".",';
        
        // const recordID = this.data.record.identification !== '' ? this.data.record.identification : '' ? this.tableData : this.data.evolution.identification;
      //  const record = this.data.record_id != '' ? `record_id: "${this.data.record_id}",` : '';
        const queryParams = `record_id: "${this.tableData}", doctor_id: ${data.doctor_id},  ${nombre}, ${date}, ${obs} `;
        const queryProps = 'record_id ';

        this.apiService.saveConsentimientoPaciente(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close(response.data.saveConsentimientoPaciente);

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
    saveDetails() {
        this.sending = true;
        const data = this.obs.value;
        console.log(data);

        const id = this.data.evolution ? `id: ${data.id},` : '';
        const details = `details: "${data.details}",`;
        const date = data.date != '' ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : '';
        const rejuv = data.rejuv && data.rejuv != '' ? `rejuv: "${data.rejuv == true}",` : 'rejuv:".",';
        const mona = data.mona && data.mona != '' ? `mona: "${data.mona}",` : 'mona: ".",';
        const process = data.process !== '' && data.process !== null ? `process: "${data.process}",` : `process: ".",`;
        const behavior = data.behavior !== '' && data.behavior !== null ? `behavior: "${data.behavior}",` : `behavior: ".",`;
        const tests = data.tests !== '' && data.tests !== null ? `tests: "${data.tests}",` : `tests: ".",`;
        // const recordID = this.data.record.identification !== '' ? this.data.record.identification : '' ? this.tableData : this.data.evolution.identification;
        // const recordID = this.tableData;


        //  const record = this.data.record_id != '' ? `record_id: "${this.data.record_id}",` : '';
        const queryParams = `${id} ${date} ${details} ${rejuv} ${mona} ${process} ${behavior} ${tests}  `;
        const queryProps = 'id ';

        this.apiService.saveEvolution(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close(response.data.saveEvolution);

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
    openModal(): void {
        const dialogRef = this.dialog.open(ConsentimientoModalComponent, {
            width: '580px',
            height: '456px',
            maxHeight: '800px',
            data: {
              
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getRecord(this.currentRecord.identification);
                this.getConsentimiento()
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
    getConsentimiento() {
        this.loading = true;
        const queryParams = `search: " "`;
        const queryProps = 'id, nombre, obs, doctor_id'

        this.apiService.getConsentimiento(queryParams, queryProps).subscribe(
            (result: any) => {
                this.loading = false;
               
                this.consentimiento = result.data.getConsentimiento;
                //   console.log('novedades ', this.novedad)
                // this.setCurrentRecord(result.data.record);

                const userCreated = localStorage.getItem('userCreated');

                console.log(result);
            },
            (error: any) => {
                this.loading = false;
                console.log(error);
            }
        );
    }
    getDrRemision() {
        this.loading = true;
        const queryParams = `search: " "`;
        const queryProps = 'id,nombre,especializacion'

        this.apiService.getDrRemision(queryParams, queryProps).subscribe(
            (result: any) => {
                this.loading = false;

                this.doctores = result.data.getDrRemision;
                //   console.log('novedades ', this.novedad)
                // this.setCurrentRecord(result.data.record);

                const userCreated = localStorage.getItem('userCreated');

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
            'id,identification, popq{id, popq_Aa, popq_Ba, popq_C, popq_gh, popq_pb, popq_tvl, popq_Ap, popq_Bp, popq_D}, patient{id, name, identification, civil_status, position, birth_date, phone, address, company, email, partner_name, arl, eps, pension, partner_profession, profile_url, chat_id}, details{id, motive, menarche, cycles, record_fur, record_g, record_p, record_v, record_a, record_pp, record_up, record_prs, record_fpp, amenorrhea}, physical{id,physical_ta, physical_fc, weight, height, head, neck, thorax, pregnancy, exams}, evolutions{id, date, details, rejuv, mona}, observations{id, description}, pregnancies{id,date,description}, coombs{id,date,description}, htos{id,date,description}, hbs{id,date,description}, cits{id,date,description}, vaccines{id,date,description}, citologies{id,date,description}, laboratory{id, patient_group, patient_rh, partner_group, partner_rh}, labor{id, date, time, labor_ta, labor_fcf, membranes, presentation, observations}, birth{id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations}, medicines{id, medicine{id,name,atc_code,active,administration,pos,cum}, dose, measure, frequency, duration, quantity, administration}, conclusion{id, surgical, pathological, notes, diagnosis, tests, behavior, process, pharmacological, family, allergies, diagnostic, diagnostic_type, toxicologist, occupational, external_cause, purpose, procedure_id, authorization_number, rel_diagnostic{id,cod_four,des_four}, rel_procedure{id,code,description}}, multimedias{id,name,description,url,type,status,created_at}, created_at';

        this.apiService.getRecord(queryParams, queryProps).subscribe(
            (result: any) => {
                this.loading = false;
                this.apiService.setRecord(result.data.record);
                //this.novedad = result.data.record;
                //   console.log('novedades ', this.novedad)
                this.setCurrentRecord(result.data.record);

                const userCreated = localStorage.getItem('userCreated');

                console.log(result);
            },
            (error: any) => {
                this.loading = false;
                console.log(error);
            }
        );
    }
    delete() {
        this.sending = true;
        const data = this.obs.value;

        if (!data.id) {
            console.log('no puede eliminar');
            return;
        }

        const id = `id: ${data.id},`;
        const queryParams = `${id}  record_id: "${this.data.record.identification}", delete: 1,`;
        const queryProps = 'id';

        this.apiService.saveEvolution(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close(response.data.saveEvolution);

                this.snackBar.open('Eliminado', null, {
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

    ngOnDestroy(): void { }
}
