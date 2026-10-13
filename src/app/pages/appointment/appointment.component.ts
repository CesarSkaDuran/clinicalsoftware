import { Component, OnInit, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
// import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { Router } from '@angular/router';
import * as moment from 'moment';

import icMore from '@iconify/icons-ic/twotone-more-vert';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icRemove from '@iconify/icons-ic/twotone-delete';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { Record } from 'src/app/models/record';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { AppointmentModalComponent } from 'src/app/modals/appointmentModal/appointment-modal.component';
import { PageEvent } from '@angular/material/paginator';
import { CalendarOptions, EventApi, FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})
export class AppointmentComponent implements OnInit, AfterViewInit {
  currentEvents: EventApi[] = [];
  rawEvents: any[] = [];

  searchText = '';
  loadingRecords = false;

  icMore = icMore;
  icEdit = icEdit;
  icRemove = icRemove;
  isClicked = false;

  patientsModalIsOpen = false;

  resultsLength = 0;

  calendarOptions: CalendarOptions = {
    locale: 'es',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    contentHeight: 'auto',
    nowIndicator: true,
    slotMinTime: '06:00:00',
    initialView: 'dayGridMonth',
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    eventOverlap: false,
    eventTimeFormat: {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista'
    },
    eventsSet: this.handleEvents.bind(this),
    dateClick: this.dateClick.bind(this),
    eventClick: this.eventClick.bind(this)
  }

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  public keyUp = new Subject<any>();
  // shortcuts: ShortcutInput[] = [];
  @ViewChild('search', { static: true }) searchEl: ElementRef;
  sending: boolean;
  doctores: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private apiService: ApiService,
    private _snackBar: MatSnackBar
  ) {
    const codeSearchSubscription = this.keyUp
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(700),
        distinctUntilChanged(),
        flatMap(search => of(search).pipe(delay(400)))
      )
      .subscribe(result => {
        this.loadRecords();
      });
  }

  ngOnInit() {
    this.loadRecords();
    this.drRemision()
  }

  ngAfterViewInit() {
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  dateClick(event) {
    if (this.isClicked) {
      this.openAppointmentModal({date: event.date});
      this.isClicked = false;
    } else {
      this.isClicked = true;
    }
    setTimeout(() => {
      this.isClicked = false;
    }, 250);
  }

  eventClick(event) {
    let match = this.rawEvents.filter((item) => {
      return item.id == event.event.id;
    });

    console.log(match);

    if (match.length > 0) {
      this.openAppointmentModal(match[0]);
    }

  }
  filters = new FormGroup({
    search: new FormControl('', []),
    doctor: new FormControl('', []),
    date2: new FormControl('', []),

  });

  searchKeyUp($event: KeyboardEvent): void {
    // console.log($event);
    if ($event.code === 'KeyN' && $event.shiftKey) {
      this.filters.controls.search.setValue('');
      return;
    }

    this.keyUp.next($event);
  }
  remisiones: any[] = [];
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
  
  setValorSeleccionado(index) {
    this.doctores = index;
    this.filters.controls.search.setValue(index);
    
  }

  loadRecords() {
    console.log('loading records...');

    this.loadingRecords = true;
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : `search: " ",`;
    const queryParams = `${searchText}`;
    const queryProps =
      'id, name, doctorRemision{id, nombre, especializacion}, company, value, date, time, end_time, phone_confirmation, email_confirmation, reason, payment_type, status, doctor{name}, patient{identification, records{id,identification, patient{id, name, identification, civil_status, position, birth_date, address, phone, company, profile_url, partner_name, partner_profession, chat_id}, details{id, motive}, conclusion{id, diagnosis}, created_at}}';

    this.apiService.getAppointments(queryParams, queryProps).subscribe(
      (response: any) => {
        console.log(response)
        let responseData = response.data.appointments.map((appointment) => {
          return {
            id: appointment.id,
            date: moment(appointment.date + ' ' + appointment.time).format('YYYY-MM-DDTHH:mm'),
            end: appointment.end_time != null ? moment(appointment.date + ' ' + appointment.end_time).format('YYYY-MM-DDTHH:mm') : null,
            title: appointment.name,
            value: appointment.value,
            status: appointment.status,
            backgroundColor: this.statusColor(appointment.status),
            eventDisplay: 'block'
          };
        });

        this.rawEvents = response.data.appointments;
        this.currentEvents = responseData;
        this.calendarOptions.events = responseData;
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

  openAppointmentModal(appointment: any = null) {
    const dialogRef = this.dialog.open(AppointmentModalComponent, {
      width: '680px',
      height: '520px',
      maxHeight: '850px',
      data: {
        appointment
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;

      this.loadRecords();
    });
  }

  changeDateTimeFormat(date: string) {
    return moment(date).format('DD/MM/YYYY');
  }

  replaceSpace(str: string) {
    return str.replace(/<br>/g, '\n');
  }

  statusColor(status: number) {
    switch (status) {
      case 1:
        return '#1562c7';
      case 2:
        return '#e48a04';
      case 3:
        return '#1bdd1b';
      case 4:
        return '#c41515';
      default:
        break;
    }
  }

  delete(appointment: any) {

    const r = confirm('¿Eliminar Ingreso?');
    if (r === true) {
      this.loadingRecords = true;

      const id = appointment ? `id: ${appointment.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id, name, company, date, value, time';

      this.apiService.saveAppointment(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loadingRecords = false;

          this.loadRecords();

          this._snackBar.open('Eliminado', null, {
            duration: 4000
          });
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
  }
}
