import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';
import { ShellModule } from './shell/shell.module';
import { CoreModule } from './core';
import { AdministrationModule } from './pages/administration/administration.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PatientsModalComponent } from './modals/patientsModal/patients-modal.component';
import { PatientFormModalComponent } from './modals/patientFormModal/patient-form-modal.component';
import { PregnanciesModalComponent } from './modals/pregnanciesModal/pregnancies-modal.component';
import { ControlModalComponent } from './modals/controlModal/control-modal.component';
import { CitologiesModalComponent } from './modals/citologiesModal/citologies-modal.component';
import { CoombsModalComponent } from './modals/coombsModal/coombs-modal.component';
import { htoModalComponent } from './modals/htoModal/hto-modal.component';
import { HbModalComponent } from './modals/hbModal/hb-modal.component';
import { CitModalComponent } from './modals/citModal/cit-modal.component';
import { VaccinesModalComponent } from './modals/vaccinesModal/vaccines-modal.component';
import { PhotoModalComponent } from './modals/photoModal/photo-modal.component';
import { ObsModalComponent } from './modals/obsModal/obs-modal.component';
import { IncomeModalComponent } from './modals/incomeModal/income-modal.component';
import { AppointmentModalComponent } from './modals/appointmentModal/appointment-modal.component';
import { EvolutionModalComponent } from './modals/evolutionModal/evolution-modal.component';
import { MultimediaModalComponent } from './modals/multimediaModal/multimedia-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { IconModule } from '@visurel/iconify-angular';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { AppointmentModule } from './pages/appointment/appointment.module';
import { RecordsModule } from './pages/records/records.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VideoModalComponent } from './modals/videoModal/video-modal.component';
import { HomeModule } from './pages/home/home.module';
import { environment } from 'src/environments/environment';
import { NgxAgoraModule } from 'ngx-agora';
import { MedicineModalComponent } from './modals/medicineModal/medicine-modal.compnent';
import { NewUserModalComponent } from './modals/newUserModal/new-user-modal.component';
import { ProcedureModalComponent } from './modals/procedureModal/procedure-modal.component';
import { CorresponsalModalComponent } from './modals/corresponsalModal/corresponsalModal.component';
import { CuentaDoctorModalComponent } from './modals/cuentaDoctorModal/cuentaDoctorModal.component';
import { NewHistoryModalComponent } from './modals/newHistoryModal/newHistoryModal.component';
import { pagosModalComponent } from './modals/pagosModal/pagosModal.component';
import { addProcedureModalComponent } from './modals/addprocedureModal/addProcedure-modal.component';
import { diagnosticModalComponent } from './modals/diagnosticModal/diagnostic-modal.component';
import { ControlModule } from './pages/control/control.module';
import { ExamenesComponent } from './modals/examenes/examenes.component';
import { FechaConsultaComponent } from './modals/fechaConsulta/fechaConsulta.component';
import { DienteComponent } from './modals/Diente/diente.component';
import { DienteInferiorComponent } from './modals/Diente/dienteInferior.component';
import { ProcedimientoComponent } from './modals/procedimientoModal/procedimiento.component';
import { DateModalComponent } from './modals/dateModal/dateModal.component';
import { RemisionComponent } from './modals/remisiones/remisiones.component';
import { WebcamModule } from 'ngx-webcam';
import { NuevoProcedimiento } from './modals/nuevoProcedimiento/nuevoProcedimiento-modal.component';
import { DetallePagosModalComponent } from './modals/detallePagos/detallePagos.component';
//import { NewProcedureModalComponent } from './modals/newprocedureModal/Newprocedure-modal.component';
import { MatTableModule } from '@angular/material/table';
import { TerceroModalComponent } from './modals/terceroModal/tercero-modal.component';
import { CurrencyPipe } from '@angular/common';
import { GastoModalComponent } from './modals/gasto/gasto-modal.component';
import { ConsentimientoPacienteModalComponent } from './modals/consentimientoPaciente/consentimientoPaciente-modal.component';
import { ConsentimientoModalComponent } from './modals/consentimiento/consentimiento-modal.component';
import { MatCardModule } from '@angular/material/card';
FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
])

@NgModule({
  declarations: [
    AppComponent,
    PatientsModalComponent,
    PatientFormModalComponent,
    PregnanciesModalComponent,
    CitologiesModalComponent,
    ControlModalComponent,
    CoombsModalComponent,
    htoModalComponent,
    HbModalComponent,
    CitModalComponent,
    VaccinesModalComponent,
    ObsModalComponent,
    EvolutionModalComponent,
    IncomeModalComponent,
    PhotoModalComponent,
    AppointmentModalComponent,
    MultimediaModalComponent,
    MedicineModalComponent,
    NewUserModalComponent,
    ProcedureModalComponent,
    VideoModalComponent,
    CorresponsalModalComponent,
    CuentaDoctorModalComponent,
    NewHistoryModalComponent,
    pagosModalComponent,
    addProcedureModalComponent,
    diagnosticModalComponent,
    ExamenesComponent,
    FechaConsultaComponent,
    DienteComponent,
    DienteInferiorComponent,
    ProcedimientoComponent,
    DateModalComponent,
    RemisionComponent,
    NuevoProcedimiento,
    DetallePagosModalComponent,
    TerceroModalComponent,
    GastoModalComponent,
    ConsentimientoPacienteModalComponent,
    ConsentimientoModalComponent

  ],
  imports: [
    BrowserModule,
    CoreModule,
    ShellModule,
    RecordsModule,
    AdministrationModule,
    AppointmentModule,
    HomeModule,
    
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    FullCalendarModule,
    // Vex
    VexModule,
    CustomLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    IconModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxAgoraModule.forRoot({ AppID: environment.agora.appId }),
    AppRoutingModule,
    WebcamModule,
    MatTableModule
  ],
  entryComponents: [
    PatientsModalComponent,
    PatientFormModalComponent,
    PregnanciesModalComponent,
    ControlModalComponent,
    CitologiesModalComponent,
    CoombsModalComponent,
    htoModalComponent,
    HbModalComponent,
    CitModalComponent,
    VaccinesModalComponent,
    PhotoModalComponent,
    ObsModalComponent,
    IncomeModalComponent,
    AppointmentModalComponent,
    EvolutionModalComponent,
    MultimediaModalComponent,
    MedicineModalComponent,
    NewUserModalComponent,
    ProcedureModalComponent,
    VideoModalComponent,
    CorresponsalModalComponent,
    CuentaDoctorModalComponent,
    NewHistoryModalComponent,
    pagosModalComponent,
    addProcedureModalComponent,
    diagnosticModalComponent,
    ExamenesComponent,
    FechaConsultaComponent,
    DienteComponent,
    DienteInferiorComponent,
    ProcedimientoComponent,
    DateModalComponent,
    RemisionComponent,
    NuevoProcedimiento,
    DetallePagosModalComponent,
    TerceroModalComponent,
    GastoModalComponent,
    ConsentimientoPacienteModalComponent,
    ConsentimientoModalComponent

  ],
  providers: [
    CurrencyPipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-in' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
