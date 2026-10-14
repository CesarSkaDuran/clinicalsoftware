import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { switchMap, catchError, tap } from 'rxjs/operators';
import ApiHelpers from './api-helpers';
import { Patient } from 'src/app/models/patient';
import { Record } from 'src/app/models/record';

const prefix = '/graphql';

const routes = {
  recordsPagination: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{recordsPagination(${context.params}){${context.properties}}}`,
  patientPagination: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{patientPagination(${context.params}){${context.properties}}}`,
  examenes: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{examenes(${context.params}){${context.properties}}}`,
  doctors: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{doctors{${context.properties}}}`,
  patients: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{patients(${context.params}){${context.properties}}}`,
  savePatient: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{savePatient(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  getRecord: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{record(${context.params}){${context.properties}}}`,
  getRecordControl: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{recordControl(${context.params}){${context.properties}}}`,
  getRecordDetails: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{recordDetails{${context.properties}}}`,
  getMultimedias: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{multimedias(${context.params}){${context.properties}}}`,
  saveRecord: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveRecord(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  makeRecord: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{makeRecord(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  savePhysical: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{savePhysical(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  savePregnancy: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{savePregnancy(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveCitology: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveCitology(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveControl: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveControl(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  getControls: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{controls(${context.params}){${context.properties}}}`,
  saveLaboratory: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveLaboratory(${context.params}){${context.properties}}}`,
  saveLabor: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveLabor(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveBirth: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveBirth(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveConclusion: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveConclusion(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveCoomb: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveCoomb(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveHto: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveHto(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveHb: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveHb(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveCit: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveCit(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveVaccine: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveVaccine(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveEvolution: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveEvolution(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveObs: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveObs(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  savePopq: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{savePopq(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  patientProfile: () => `/v1/actions/patientProfile`,
  recordImage: () => `/v1/actions/recordMultimedia`,
  incomesPagination: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{incomesPagination(${context.params}){${context.properties}}}`,
  saveIncome: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveIncome(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  appointmentsPagination: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{appointmentsPagination(${context.params}){${context.properties}}}`,
  appointments: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{appointments(${context.params}){${context.properties}}}`,
  appointmentMonth: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{appointmentMonth(${context.params}){${context.properties}}}`,
  patientCreationData: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{patientCreationData(${context.params}){${context.properties}}}`,
  saveAppointment: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveAppointment(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  createAppointment: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{createDoctorAppointment(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveMultimedia: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveMultimedia(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  getDiagnoses: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{diagnoses(${context.params}){${context.properties}}}`,
  getProcedures: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{procedures(${context.params}){${context.properties}}}`,
  getProceduresAll: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{proceduresAll(${context.params}){${context.properties}}}`,
  getMedicines: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{medicines(${context.params}){${context.properties}}}`,
  saveMedicine: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveRecordMedicine(${encodeURIComponent(context.params)}){${context.properties}}}`,
  saveRecordProcedure: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveRecordProcedure(${encodeURIComponent(context.params)}){${context.properties}}}`,
  saveRecordDiagnoses: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveRecordDiagnoses(${encodeURIComponent(context.params)}){${context.properties}}}`,
  deleteAppointment: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{deleteAppointment(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveProcedure: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveProcedure(${encodeURIComponent(context.params)}){${context.properties}}}`,
  SaveExamenes: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{SaveExamenes(${encodeURIComponent(context.params)}){${context.properties}}}`,
  saveNuevoControl: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveNuevoControl(${encodeURIComponent(context.params)}){${context.properties}}}`,
  saveFechaConsulta: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveFechaConsulta(${encodeURIComponent(context.params)}){${context.properties}}}`,
  saveOdontograma: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveOdontograma(${encodeURIComponent(context.params)}){${context.properties}}}`,
  getOdontograma: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getOdontograma(${context.params}){${context.properties}}}`,
  getCategoria: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getCategoria(${context.params}){${context.properties}}}`,
  getProcedimientoDental: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getProcedimientoDental(${context.params}){${context.properties}}}`,
  saveProcedimientopaciente: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveProcedimientoPaciente(${encodeURIComponent(context.params)}){${context.properties}}}`,
  getProcedimientoPaciente: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getProcedimientoPaciente(${context.params}){${context.properties}}}`,
  savePlanTratamiento: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{savePlanTratamiento(${encodeURIComponent(context.params)}){${context.properties}}}`,
  getPlanTratamiento: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getPlanTratamiento(${context.params}){${context.properties}}}`,
  getDienteIndidual: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getDienteIndidual(${context.params}){${context.properties}}}`,
  getDrRemision: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getDrRemision(${context.params}){${context.properties}}}`,
  getConsentimiento: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getConsentimiento(${context.params}){${context.properties}}}`,
  saveResumen: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveResumen(${encodeURIComponent(context.params)}){${context.properties}}}`,
  saveNuevoProcedimiento: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveNuevoProcedimiento(${encodeURIComponent(context.params)}){${context.properties}}}`,
  getGastoPagination: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getGastoPagination(${context.params}){${context.properties}}}`,
  getCuentaCobroPagination: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getCuentaCobroPagination(${context.params}){${context.properties}}}`,
  getCuentaCobro: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getCuentaCobro(${context.params}){${context.properties}}}`,
  getBanco: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getBanco(${context.params}){${context.properties}}}`,
  getDetalleCobro: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getDetalleCobro(${context.params}){${context.properties}}}`,
  saveCuentaCobro: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveCuentaCobro(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveTercero: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveTercero(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveTemporal: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveTemporal(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  getTercero: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getTercero(${context.params}){${context.properties}}}`,
  getTemporal: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getTemporal(${context.params}){${context.properties}}}`,
  getGasto: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getGasto(${context.params}){${context.properties}}}`,
  saveGasto: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveGasto(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveConsentimiento: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveConsentimiento(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveConsentimientoPaciente: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveConsentimientoPaciente(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  getConsentimientoPaciente: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getConsentimientoPaciente(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  getProcedimientoDentalPagination: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{getProcedimientoDentalPagination(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
};

export interface GraphQLQueryContext {
  params: string;
  properties: string;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class ApiService {
  dashboardData: any = null;
  apiHelpers: ApiHelpers;
  currentCompany: any;
  currentPatient: any;
  currentRecord: any;

  private companySelected = new Subject<any>();
  companySelected$ = this.companySelected.asObservable();

  constructor(private httpClient: HttpClient) {
    this.apiHelpers = new ApiHelpers();
  }

  makeQuery(routeFunction: any, params: string, properties: string) {
    return this.httpClient.get(routeFunction({params: params, properties: properties})).pipe(
      tap(responseJson => this.apiHelpers.handleQueryError(responseJson)),
      catchError(errorResponse => {
        throw new Error(errorResponse);
      })
    );
  }

  selectCompany(company: any) {
    this.currentCompany = company;
    this.companySelected.next(company);
  }

  public setPatient(patient: Patient) {
    this.currentPatient = patient;

    this.currentPatientWasSelected(patient);
  }

  public setRecord(record: Record) {
    this.currentRecord = record;

    if (record) {
      this.setPatient(record.patient);
      this.cacheCurrentRecord(record.patient);
      this.cacheLastRecord(record);
    } else {
      this.setPatient(null);
      this.deleteCurrentRecordFormCache();
    }
  }

  private currentPatientWasSelected(currentPatient: Patient) {
    console.log('next');
    this.currentPatient = currentPatient;
    this.companySelected.next(currentPatient);
  }

  private cacheCurrentRecord(patient: Patient) {
    localStorage.setItem('currentRecord', JSON.stringify(patient));
  }

  private cacheLastRecord(record: Record) {
    localStorage.setItem('lastRecord', JSON.stringify(record));
  }

  private deleteCurrentRecordFormCache() {
    localStorage.removeItem('currentRecord');
  }

  getCurrentRecordFromCache() {
    return JSON.parse(localStorage.getItem('currentRecord'));
  }

  getLastRecordFromCache() {
    return JSON.parse(localStorage.getItem('lastRecord'));
  }

  //
  //

  getRecordsPagination(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.recordsPagination, params, properties);
  }
  getPatientsPagination(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.patientPagination, params, properties);
  }
  getExamenes(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.examenes, params, properties);
  }
  getRecordControl(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getRecordControl, params, properties);
  }
  getRecord(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getRecord, params, properties);
  }
  getRecordDetails(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getRecordDetails, params, properties);
  }
  getPatients(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.patients, params, properties);
  }
  getDoctors(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.doctors, params, properties);
  }

  savePatient(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.savePatient, params, properties);
  }

  saveRecord(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveRecord, params, properties);
  }

  makeRecord(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.makeRecord, params, properties);
  }

  savePhysical(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.savePhysical, params, properties);
  }

  savePregnancy(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.savePregnancy, params, properties);
  }

  saveCitology(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveCitology, params, properties);
  }

  saveControl(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveControl, params, properties);
  }

  getControls(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getControls, params, properties);
  }

  saveLaboratory(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveLaboratory, params, properties);
  }

  saveLabor(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveLabor, params, properties);
  }

  saveBirth(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveBirth, params, properties);
  }
  deleteAppointment(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.deleteAppointment, params, properties);
  }
  getAppointmentPagination(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.appointmentsPagination, params, properties);
  }
  saveConclusion(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveConclusion, params, properties);
  }

  saveCoomb(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveCoomb, params, properties);
  }

  saveHto(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveHto, params, properties);
  }

  saveHb(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveHb, params, properties);
  }

  saveCit(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveCit, params, properties);
  }

  saveVaccine(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveVaccine, params, properties);
  }

  saveEvolution(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveEvolution, params, properties);
  }

  saveObs(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveObs, params, properties);
  }

  savePopq(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.savePopq, params, properties);
  }

  savePatientProfileImage(file: any, $patientId: string) {
    const formData = new FormData();

    formData.append('image', file);
    formData.append('patient_id', $patientId);

    return this.httpClient.post(routes.patientProfile(), formData).pipe(
      switchMap((response: any) => {
        const data = response;

        return of(data);
      }),
      catchError(error => {
        throw new Error('Error');
      })
    );
  }

  saveRecordImage(file: any, $recordId: string) {
    const formData = new FormData();

    formData.append('image', file);
    formData.append('record_id', $recordId);

    return this.httpClient.post(routes.recordImage(), formData).pipe(
      switchMap((response: any) => {
        const data = response;

        return of(data);
      }),
      catchError(error => {
        throw new Error('Error');
      })
    );
  }

  getIncomes(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.incomesPagination, params, properties);
  }

  getAppointmentsPagination(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.appointmentsPagination, params, properties);
  }

  saveIncome(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveIncome, params, properties);
  }

  getAppointments(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.appointments, params, properties);
  }
  
  getAppointmentMonth(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.appointmentMonth, params, properties);
  }

  saveAppointment(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveAppointment, params, properties);
  }

  createAppointment(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.createAppointment, params, properties);
  }

  runDailyNotifications(): Observable<object> {
    return this.httpClient.post('/v1/notifications/daily-run', {});
  }

  getBirthdaysToday(): Observable<object> {
    return this.httpClient.get('/v1/notifications/birthdays-today');
  }

  getDashboardSummary(month?: string): Observable<object> {
    return this.httpClient.get('/v1/dashboard/summary', { params: month ? { month } : {} });
  }

  sendBirthdayNotification(patientId: number): Observable<object> {
    return this.httpClient.post(`/v1/notifications/birthday/${patientId}`, {});
  }

  saveMultimedia(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveMultimedia, params, properties);
  }

  getRecordFromLocal(params: string, properties: string): Observable<object> {
    // http://localhost/hc_server/public
    return this.httpClient.get('https://hcapi.clinicalsoftware.org' + routes.getRecord({ params: params, properties: properties })).pipe(
      tap(responseJson => this.apiHelpers.handleQueryError(responseJson)),
      catchError(errorResponse => {
        throw new Error(errorResponse);
      })
    );
  }

  getMultimediasFromLocal(params: string, properties: string): Observable<object> {
    // http://localhost/hc_server/public
    return this.httpClient.get('https://hcapi.clinicalsoftware.org' + routes.getMultimedias({ params: params, properties: properties })).pipe(
      tap(responseJson => this.apiHelpers.handleQueryError(responseJson)),
      catchError(errorResponse => {
        throw new Error(errorResponse);
      })
    );
  }

  saveLocalMultimedia(params: string, properties: string): Observable<object> {
    // http://localhost/hc_server/public
    return this.httpClient.get('https://hcapi.clinicalsoftware.org' + routes.saveMultimedia({ params: params, properties: properties })).pipe(
      tap(responseJson => this.apiHelpers.handleQueryError(responseJson)),
      catchError(errorResponse => {
        throw new Error(errorResponse);
      })
    );
  }

  getPatientCreationData(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.patientCreationData, params, properties);
  }

  getDiagnoses(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getDiagnoses, params, properties);
  }

  getProcedures(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getProcedures, params, properties);
  }
  getProceduresAll(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getProceduresAll, params, properties);
  }
  getMedicines(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getMedicines, params, properties);
  }
  getOdontograma(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getOdontograma, params, properties);
  }
  getCategoria(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getCategoria, params, properties);
  }
  getProcedimientoDental(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getProcedimientoDental, params, properties);
  }
  getProcedimientoPaciente(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getProcedimientoPaciente, params, properties);
  }
  getPlanTratamiento(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getPlanTratamiento, params, properties);
  }
  getDienteIndidual(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getDienteIndidual, params, properties);
  }
  getDrRemision(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getDrRemision, params, properties);
  }
  getConsentimiento(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getConsentimiento, params, properties);
  }
  saveMedicine(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveMedicine, params, properties);
  }
  saveRecordProcedure(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveRecordProcedure, params, properties);
  }
  saveRecordDiagnoses(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveRecordDiagnoses, params, properties);
  }
  saveProcedure(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveProcedure, params, properties);
  }
  SaveExamenes(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.SaveExamenes, params, properties);
  }
  saveNuevoControl(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveNuevoControl, params, properties);
  }
  saveFechaConsulta(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveFechaConsulta, params, properties);
  }
  saveOdontograma(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveOdontograma, params, properties);
  }
  saveProcedimientopaciente(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveProcedimientopaciente, params, properties);
  }
  savePlanTratamiento(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.savePlanTratamiento, params, properties);
  }
  saveResumen(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveResumen, params, properties);
  }
  saveNuevoProcedimiento(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveNuevoProcedimiento, params, properties);
  }
  getCuentaCobroPagination(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getCuentaCobroPagination, params, properties);
  }
  getGasto(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getGasto, params, properties);
  }
  saveGasto(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveGasto, params, properties);
  }
  saveConsentimiento(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveConsentimiento, params, properties);
  }
  saveConsentimientoPaciente(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveConsentimientoPaciente, params, properties);
  }
  getConsentimientoPaciente(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getConsentimientoPaciente, params, properties);
  }
  getProcedimientoDentalPagination(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getProcedimientoDentalPagination, params, properties);
  }
  getGastoPagination(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getGastoPagination, params, properties);
  }
  getCuentaCobro(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getCuentaCobro, params, properties);
  }
  getBanco(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getBanco, params, properties);
  }
  getDetalleCobro(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getDetalleCobro, params, properties);
  }
  saveCuentaCobro(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveCuentaCobro, params, properties);
  }
  saveTercero(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveTercero, params, properties);
  }
  saveTemporal(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveTemporal, params, properties);
  }
  getTercero(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getTercero, params, properties);
  }
  getTemporal(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getTemporal, params, properties);
  }
}
