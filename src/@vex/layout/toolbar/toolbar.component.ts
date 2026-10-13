import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import icBookmarks from '@iconify/icons-ic/twotone-bookmarks';
import icMenu from '@iconify/icons-ic/twotone-menu';
import { ConfigService } from '../../services/config.service';
import { map } from 'rxjs/operators';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icAssignmentTurnedIn from '@iconify/icons-ic/twotone-assignment-turned-in';
import icAcCircle from '@iconify/icons-feather/user';
import icDescription from '@iconify/icons-ic/twotone-description';
import icAssignment from '@iconify/icons-feather/file-plus';
import icReceipt from '@iconify/icons-ic/twotone-receipt';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icFace from '@iconify/icons-ic/twotone-face';
import icCalendar from '@iconify/icons-ic/twotone-restore';
import icNotification from '@iconify/icons-feather/bell';
import icHistory from '@iconify/icons-feather/plus-square';
import icAppointment from '@iconify/icons-ic/twotone-event-available';
import icHome from '@iconify/icons-feather/home';
import roundHome from '@iconify/icons-ic/round-home';
import { NavigationService } from '../../services/navigation.service';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { PopoverService } from '../../components/popover/popover.service';
import roundPermContactCalendar from '@iconify/icons-ic/round-perm-contact-calendar';
import moment from 'moment';
import { ApiService } from 'src/app/core/api/api.service';
import { RecordsService } from 'src/app/pages/records/records.service';
import { Router } from '@angular/router';
import { AppointmentModalComponent } from 'src/app/modals/appointmentModal/appointment-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { PatientsModalComponent } from 'src/app/modals/patientsModal/patients-modal.component';

@Component({
  selector: 'vex-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() mobileQuery: boolean;

  @Input()
  @HostBinding('class.shadow-b')
  hasShadow: boolean;

  navigationItems = this.navigationService.items;

  isHorizontalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'horizontal'));
  isVerticalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'vertical'));
  isNavbarInToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'in-toolbar'));
  isNavbarBelowToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'below-toolbar'));

  icBookmarks = icBookmarks;
  icMenu = icMenu;
  icPersonAdd = icPersonAdd;
  icAssignmentTurnedIn = icAssignmentTurnedIn;
  icDescription = icDescription;
  icAssignment = icAssignment;
  icReceipt = icReceipt;
  icDoneAll = icDoneAll;
  icArrowDropDown = icArrowDropDown;
  icAcCircle = icAcCircle;
  icFace = icFace;
  icCalendar = icCalendar;
  icNotification = icNotification;
  icHistory = icHistory;
  icHome = icHome;
  roundHome = roundHome;
  icAppointment = icAppointment;
  roundPermContactCalendar = roundPermContactCalendar;
  time: string;
  ampm: string;
  date: any = moment();
  mes: string = '';
  patientsModalIsOpen = false;

  constructor(private layoutService: LayoutService,
              private configService: ConfigService,
              private apiService: ApiService,
              private router: Router,
              private recordsService: RecordsService,
              private navigationService: NavigationService,
              private dialog: MatDialog,
              private popoverService: PopoverService) { }

  ngOnInit() {
    // this.startTime();
    this.mesActual();
  }
  mesActual() {
    var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var d = new Date();
    this.mes = monthNames[d.getMonth()];
    console.log(this.mes);
  }

  openQuickpanel() {
    this.layoutService.openQuickpanel();
  }

  openSidenav() {
    this.layoutService.openSidenav();
  }

  startTime = () => {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    this.ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    m = this.checkTime(m);
    s = this.checkTime(s);
    this.time = h + ':' + m + ':' + s;

    const t = setTimeout(this.startTime, 500);
  }

  checkTime(i: any) {
    if (i < 10) { i = '0' + i };  // add zero in front of numbers < 10
    return i;
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
    });
  }

  home() {
    this.router.navigate(['/app/home']);
  }

  calendar(){
    this.router.navigate(['/app/appointment']);
  }

  selectRecord() {
    try {
      if (this.recordsService.getLastRecordFromCache()) {
        let record = this.recordsService.getLastRecordFromCache();
        this.recordsService.setRecord(record);
        this.router.navigate(['/app/records/view', record.identification]);
      }
    } catch (error) {
      console.log(error);
      alert('No se ha seleccionado un paciente recientemente');
    }
  }
    openPatientsModal() {
    if (!this.patientsModalIsOpen) {
      const dialogRef = this.dialog.open(PatientsModalComponent, {
        width: '460px',
        height: '562px',
        maxHeight: '800px'
      });

      this.patientsModalIsOpen = true;

      dialogRef.afterClosed().subscribe((result: any) => {
        console.log('patients modal closed');
        this.patientsModalIsOpen = false;

        if (result.created) {
          localStorage.setItem('userCreated', 'true');
        }

      });
    }
  }

}
