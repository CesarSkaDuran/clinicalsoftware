import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, timeout } from 'rxjs/operators';
import { Lightbox } from 'ngx-lightbox';
import { of, timer } from 'rxjs';

import * as moment from 'moment';
import * as autosize from 'autosize';

import icDelete from '@iconify/icons-ic/twotone-delete';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDone from '@iconify/icons-ic/twotone-done';
import icBlock from '@iconify/icons-ic/twotone-block';
import icRemove from '@iconify/icons-ic/twotone-remove';
import icPerson from '@iconify/icons-ic/twotone-person';
import icAssign from '@iconify/icons-ic/twotone-assignment';
import { HttpClient } from '@angular/common/http';
import { RecordsService } from '../records/records.service';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { CredentialsService } from 'src/app/core';
import { ApiService } from 'src/app/core/api/api.service';
import { SplashScreenService } from 'src/@vex/services/splash-screen.service';
import baselineRemoveRedEye from '@iconify/icons-ic/baseline-remove-red-eye';
import { EvolutionModalComponent } from 'src/app/modals/evolutionModal/evolution-modal.component';
import { MatDialog } from '@angular/material/dialog';
import baselineCall from '@iconify/icons-ic/baseline-call';
import baselineLocationOn from '@iconify/icons-ic/baseline-location-on';
@Component({
  selector: 'app-print-record',
  templateUrl: './print-record.component.html',
  styleUrls: ['./print-record.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})
export class PrintRecordComponent implements OnInit {
  displayedControlColumns: string[] = ['week', 'weight', 'ta', 'pam', 'au', 'pression', 'fcf', 'edema', 'options'];
  controlsData: any[] = [];

  icDelete = icDelete;
  icEdit = icEdit;
  icDone = icDone;
  icBlock = icBlock;
  icRemove = icRemove;
  icPerson = icPerson;
  icAssign = icAssign;
  baselineRemoveRedEye = baselineRemoveRedEye;
  searchText = '';
  resultsLength = 0;
  loadingControls = false;
  currentRecord: any = null;
  loading = false;
  baselineLocationOn=baselineLocationOn;
  baselineCall = baselineCall;
  orderBy = 'created_at';
  order = 'asc';
  limit = 50;
  offset = 0;
  spaceRegex = /<br *\/?>/gi;
  odontograma: any[] = [];
  displayedColumns: string[] = ['fecha', 'arcadia', 'pieza', 'caras', 'status', 'comentario'];
  dataSource: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private recordsService: RecordsService,
    private credentialsService: CredentialsService,
    private apiService: ApiService,
    private _lightbox: Lightbox,
    private splashScreen: SplashScreenService,
    private http: HttpClient,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    // set cached record if exist
    this.getDientes();
    this.getOdontograma();
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
    this.setRecordFromCache();

    const record$ = this.route.paramMap.pipe(switchMap((params: ParamMap) => of(params.get('recordId'))));

    record$.subscribe(recordId => {
      this.getRecord(recordId);
      // this.getRecordMultimedia(recordId);
    });

    document.body.classList.add('overflow-auto');

    // this.openPregnanciesModal();
  }

  setRecordFromCache() {
    const currentRecord = this.recordsService.getCurrentRecordFromCache();

    this.setCurrentRecord(currentRecord);
  }

  setCurrentRecord(record: any) {
    this.currentRecord = record;
    console.log(record);
    this.loadControls();
  }

  getRecord(id: any) {
    this.loading = true;
    const queryParams = `id: "${id}"`;
    const queryProps =
      // tslint:disable-next-line:max-line-length
      // 'id, user{id, name doctor{id, name,	specialization, image, university, details}}identification, popq{id, popq_Aa, popq_Ba, popq_C, popq_gh, popq_pb, popq_tvl, popq_Ap, popq_Bp, popq_D}, diagnoses{ id, diagnose{ id, cod_four, des_four,} },   procedures{ id, procedure{ id, code, description,} },  patient{id, name, identification, civil_status, position, sex, TipoDocumento, birth_date, phone, address, company, email, partner_name, arl, eps, pension, partner_profession, profile_url, chat_id}, details{id, motive, menarche, cycles, record_fur, record_g, record_p, record_v, record_a, record_pp, record_up, record_prs, record_fpp, amenorrhea}, physical{id,physical_ta, physical_fc, weight, height, head, neck, thorax, pregnancy, exams}, evolutions{id, date, details, rejuv, mona, tests, behavior, process}, observations{id, description}, pregnancies{id,date,description}, coombs{id,date,description}, htos{id,date,description}, hbs{id,date,description}, cits{id,date,description}, vaccines{id,date,description}, citologies{id,date,description}, laboratory{id, patient_group, patient_rh, partner_group, partner_rh}, labor{id, date, time, labor_ta, labor_fcf, membranes, presentation, observations}, birth{id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations}, medicines{id, medicine{id,name,atc_code,active,administration,pos,cum}, dose, measure, frequency, duration, quantity, administration}, conclusion{id, surgical, pathological, notes, diagnosis, tests, behavior, process, pharmacological, family, allergies, diagnostic, diagnostic_type, toxicologist, occupational, external_cause, purpose, procedure_id, current_illness, authorization_number, rel_diagnostic{id,cod_four,des_four}, rel_procedure{id,code,description}}, multimedias{id,name,description,url,type,status,created_at}, examen{id, record_id, obs, ecografias, resonancias, tac, code, otros, orina, quimica_sanguinea, material_fecal, varios, hematologia}, created_at';
      'id, user{id, name doctor{id, name,	specialization, image, address, phone, details}}identification, popq{id, popq_Aa, popq_Ba, popq_C, popq_gh, popq_pb, popq_tvl, popq_Ap, popq_Bp, popq_D}, diagnoses{ id, diagnose{ id, cod_four, des_four,} },   procedures{ id, procedure{ id, code, description,} },  patient{id, name, identification, civil_status, position, sex, TipoDocumento, birth_date, phone, address, company, email, partner_name, arl, eps, pension, partner_profession, profile_url, chat_id}, details{id, motive, menarche, cycles, record_fur, record_g, record_p, record_v, record_a, record_pp, record_up, record_prs, record_fpp, amenorrhea}, physical{id,physical_ta, physical_fc, weight, height, head, neck, thorax, pregnancy, exams}, evolutions{id, date, details, rejuv, mona, tests, behavior, process}, observations{id, description}, pregnancies{id,date,description}, coombs{id,date,description}, htos{id,date,description}, hbs{id,date,description}, cits{id,date,description}, vaccines{id,date,description}, citologies{id,date,description}, laboratory{id, patient_group, patient_rh, partner_group, partner_rh}, labor{id, date, time, labor_ta, labor_fcf, membranes, presentation, observations}, birth{id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations}, medicines{id, medicine{id,name,atc_code,active,administration,pos,cum}, dose, measure, frequency, duration, quantity, administration}, conclusion{id, surgical, pathological, notes, diagnosis, tests, behavior, process, pharmacological, family, allergies, diagnostic, diagnostic_type, toxicologist, occupational, external_cause, purpose, procedure_id, current_illness, authorization_number, rel_diagnostic{id,cod_four,des_four}, rel_procedure{id,code,description}}, multimedias{id,name,description,url,type,status,created_at}, examen{id, record_id, obs, ecografias, resonancias, tac, code, otros, orina, quimica_sanguinea, material_fecal, varios, hematologia}, created_at';
    this.apiService.getRecord(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.apiService.setRecord(result.data.record);
        this.setCurrentRecord(result.data.record);

        // this.getRecordMultimedia(id);
        this.splashScreen.hide();

        setTimeout(() => {
          autosize(document.querySelectorAll('textarea'));
        }, 1500);

        console.log(result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
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
        console.log(error);
      }
    );
  }

  setDaysUntilBirth(date: any) {

  }

  setStrSpaces(string: string) {
    return string.replace(/<br>/g, '\n');
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  civilToString(civil_status: any) {
    if (civil_status === 1) {return 'Soltero/a'; }
    if (civil_status === 2) {return 'Casado/a'; }
    if (civil_status === 3) {return 'Unión Libre'; }
    if (civil_status === 4) {return 'Divorciado/a'; }
    if (civil_status === 5) {return 'Viudo/a'; }

    return 'Otro';
  }

  print() {
    window.print();
  }

  ageFromDate(date: string) {
    if (date === '') {
      return '';
    }

    return moment().diff(moment(date), 'years');
  }
  diente18: any;
  diente17: any;
  diente16: any;
  diente15: any;
  diente14: any;
  diente13: any;
  diente12: any;
  diente11: any;

  getDiente18() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 18, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente18 = result.data.getDienteIndidual;
        // console.log('novedades', this.novedad)

        console.log('diente 18', this.diente18);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente17() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 17, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente17 = result.data.getDienteIndidual;
        // console.log('novedades', this.novedad)

        console.log('diente 17', this.diente17);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente16() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 16, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente16 = result.data.getDienteIndidual;
        console.log('diente 16', this.diente16);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente15() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 15, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente15 = result.data.getDienteIndidual;
        console.log('diente 15', this.diente15);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente14() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 14, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente14 = result.data.getDienteIndidual;
        console.log('diente 14', this.diente14);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente13() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 13, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente13 = result.data.getDienteIndidual;
        console.log('diente 13', this.diente13);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente12() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 12, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente12 = result.data.getDienteIndidual;
        console.log('diente 12', this.diente12);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente11() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 11, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente11 = result.data.getDienteIndidual;
        console.log('diente 11', this.diente11);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  diente28: any;
  diente27: any;
  diente26: any;
  diente25: any;
  diente24: any;
  diente23: any;
  diente22: any;
  diente21: any;

  getDiente28() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 28, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente28 = result.data.getDienteIndidual;
        // console.log('novedades', this.novedad)

        console.log('diente 28', this.diente28);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente27() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 27, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente27 = result.data.getDienteIndidual;
        // console.log('novedades', this.novedad)

        console.log('diente 27', this.diente27);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente26() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 26, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente26 = result.data.getDienteIndidual;
        console.log('diente 26', this.diente26);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente25() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 25, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente25 = result.data.getDienteIndidual;
        console.log('diente 25', this.diente25);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente24() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 24, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente24 = result.data.getDienteIndidual;
        console.log('diente 24', this.diente24);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente23() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 23, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente23 = result.data.getDienteIndidual;
        console.log('diente 23', this.diente23);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente22() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 22, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente22 = result.data.getDienteIndidual;
        console.log('diente 22', this.diente22);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente21() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 21, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente21 = result.data.getDienteIndidual;
        console.log('diente 21', this.diente21);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  diente48: any;
  diente47: any;
  diente46: any;
  diente45: any;
  diente44: any;
  diente43: any;
  diente42: any;
  diente41: any;

  getDiente48() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 48, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente48 = result.data.getDienteIndidual;
        // console.log('novedades', this.novedad)

        console.log('diente 48', this.diente48);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente47() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 47, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente47 = result.data.getDienteIndidual;
        // console.log('novedades', this.novedad)

        console.log('diente 47', this.diente47);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente46() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 46, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente46 = result.data.getDienteIndidual;
        console.log('diente 46', this.diente46);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente45() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 45, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente45 = result.data.getDienteIndidual;
        console.log('diente 45', this.diente45);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente44() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 44, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente44 = result.data.getDienteIndidual;
        console.log('diente 44', this.diente44);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente43() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 43, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente43 = result.data.getDienteIndidual;
        console.log('diente 43', this.diente43);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente42() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 42, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente42 = result.data.getDienteIndidual;
        console.log('diente 42', this.diente42);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente41() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 41, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente41 = result.data.getDienteIndidual;
        console.log('diente 41', this.diente41);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  diente38: any;
  diente37: any;
  diente36: any;
  diente35: any;
  diente34: any;
  diente33: any;
  diente32: any;
  diente31: any;

  getDiente38() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 38, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente38 = result.data.getDienteIndidual;
        // console.log('novedades', this.novedad)

        console.log('diente 38', this.diente38);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente37() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 37, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente37 = result.data.getDienteIndidual;
        // console.log('novedades', this.novedad)

        console.log('diente 37', this.diente37);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente36() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 36, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente36 = result.data.getDienteIndidual;
        console.log('diente 36', this.diente36);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente35() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 35, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente35 = result.data.getDienteIndidual;
        console.log('diente 35', this.diente35);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente34() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 34, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente34 = result.data.getDienteIndidual;
        console.log('diente 34', this.diente34);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente33() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 33, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente33 = result.data.getDienteIndidual;
        console.log('diente 33', this.diente33);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente32() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 32, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente32 = result.data.getDienteIndidual;
        console.log('diente 32', this.diente32);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  getDiente31() {
    this.loading = true;
    const status = 1;
    const queryParams = `diente_id: 31, record_id:"${this.route.snapshot.paramMap.get('recordId')}"`;
    const queryProps = 'id, diente_id, status, exodoncia,  created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, obs ';

    this.apiService.getDienteIndidual(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.diente31 = result.data.getDienteIndidual;
        console.log('diente 31', this.diente31);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

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
        else  if (element.diente_id === 17) { this.diente17 = element; }
        else  if (element.diente_id === 16) { this.diente16 = element; }
        else  if (element.diente_id === 15) { this.diente15 = element; }
        else  if (element.diente_id === 14) { this.diente14 = element; }
        else  if (element.diente_id === 13) { this.diente13 = element; }
        else  if (element.diente_id === 12) { this.diente12 = element; }
        else  if (element.diente_id === 11) { this.diente11 = element; }

        else  if (element.diente_id === 28) { this.diente28 = element; }
        else  if (element.diente_id === 27) { this.diente27 = element; }
        else  if (element.diente_id === 26) { this.diente26 = element; }
        else  if (element.diente_id === 25) { this.diente25 = element; }
        else  if (element.diente_id === 24) { this.diente24 = element; }
        else  if (element.diente_id === 23) { this.diente23 = element; }
        else  if (element.diente_id === 22) { this.diente22 = element; }
        else  if (element.diente_id === 21) { this.diente21 = element; }

          //dientes niños

        else  if (element.diente_id === 55) { this.diente55 = element; }
        else  if (element.diente_id === 54) { this.diente54 = element; }
        else  if (element.diente_id === 53) { this.diente53 = element; }
        else  if (element.diente_id === 52) { this.diente52 = element; }
        else  if (element.diente_id === 51) { this.diente51 = element; }

        else  if (element.diente_id === 65) { this.diente65 = element; }
        else  if (element.diente_id === 64) { this.diente64 = element; }
        else  if (element.diente_id === 63) { this.diente63 = element; }
        else  if (element.diente_id === 62) { this.diente62 = element; }
        else  if (element.diente_id === 61) { this.diente61 = element; }

        else  if (element.diente_id === 65) { this.diente65 = element; }
        else  if (element.diente_id === 64) { this.diente64 = element; }
        else  if (element.diente_id === 63) { this.diente63 = element; }
        else  if (element.diente_id === 62) { this.diente62 = element; }
        else  if (element.diente_id === 61) { this.diente61 = element; }

        else  if (element.diente_id === 75) { this.diente75 = element; }
        else  if (element.diente_id === 74) { this.diente74 = element; }
        else  if (element.diente_id === 73) { this.diente73 = element; }
        else  if (element.diente_id === 72) { this.diente72 = element; }
        else  if (element.diente_id === 71) { this.diente71 = element; }

          //fin

        else  if (element.diente_id === 38) { this.diente38 = element; }
        else  if (element.diente_id === 37) { this.diente37 = element; }
        else  if (element.diente_id === 36) { this.diente36 = element; }
        else  if (element.diente_id === 35) { this.diente35 = element; }
        else  if (element.diente_id === 34) { this.diente34 = element; }
        else  if (element.diente_id === 33) { this.diente33 = element; }
        else  if (element.diente_id === 32) { this.diente32 = element; }
        else  if (element.diente_id === 31) { this.diente31 = element; }

        else  if (element.diente_id === 48) { this.diente48 = element; }
        else  if (element.diente_id === 47) { this.diente47 = element; }
        else  if (element.diente_id === 46) { this.diente46 = element; }
        else  if (element.diente_id === 45) { this.diente45 = element; }
        else  if (element.diente_id === 44) { this.diente44 = element; }
        else  if (element.diente_id === 43) { this.diente43 = element; }
        else  if (element.diente_id === 42) { this.diente42 = element; }
        else  if (element.diente_id === 41) { this.diente41 = element; }

        });


        console.log('result.data.getDienteIndidual', result.data.getDienteIndidual)

        console.log('diente 18', this.diente18);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
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


  getOdontograma() {
    this.loading = true;
    const status = 1;
    const queryParams = `record_id:"${this.route.snapshot.paramMap.get('recordId')}" limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}"`;

    const queryProps = 'id, diente_id, plan_status, status, exodoncia, created_at, corona, corona_provisional, endodoncia, ausente, restauracion, implante, perno_munon, otros, protesis_removible, amalgama, sellante, diente_sano, caries, infeccion_pulpar, fractura, movilidad, residuo_radical, erosion, desgaste, cuello, pieza_completa, Mezial, distal, oclusal, palatina, lingual, vestibular, cervical, obs ';

    this.apiService.getOdontograma(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.odontograma = result.data.getOdontograma;
        console.log('odontograma',result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
}
