import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { AuthenticationGuard } from './core';
import { HomeComponent } from './pages/home/home.component';

const childrenRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent
    // loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'records',
    loadChildren: () => import('./pages/records/records.module').then(m => m.RecordsModule)
  },
  {
    path: 'appointment',
    loadChildren: () => import('./pages/appointment/appointment.module').then(m => m.AppointmentModule)
  },
  {
    path: 'administration',
    loadChildren: () => import('./pages/administration/administration.module').then(m => m.AdministrationModule)
  },
  {
    path: 'cierre',
    loadChildren: () => import('./pages/informes/cierre/administration.module').then(m => m.AdministrationModule)
  },
  {
    path: 'gastos',
    loadChildren: () => import('./pages/gastos/gastos.module').then(m => m.GastosModule)
  },
  {
    path: 'rips-sin-factura',
    loadChildren: () => import('./pages/rips-sin-factura/rips-sin-factura.module').then(m => m.RipsSinFacturaModule)
  },
  {
    path: 'telemedicine',
    loadChildren: () => import('./pages/telemedicine/telemedicine.module').then(m => m.TelemedicineModule)
  },
  {
    path: 'control/:recordPatient/:recordId',
    loadChildren: () => import('./pages/control/control.module').then(m => m.ControlModule)
  },
  {
    path: 'planTratamiento/:recordPatient/:recordId',
    loadChildren: () => import('./pages/planTratamiento/planTratamiento.module').then(m => m.PlanTratamientoModule)
  },
  {
    path: 'records/view/:recordId',
    loadChildren: () => import('./pages/userRecord/user-record.module').then(m => m.UserRecordModule)
  },
  {
    path: 'procedimientosPaciente',
    loadChildren: () => import('./pages/procedimientosPaciente/procedimientosPaciente.module').then(m => m.ProcedimientosPacienteModule)
  },
];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'records/print/:recordId',
    loadChildren: () => import('./pages/printRecord/print-record.module').then(m => m.PrintRecordModule)
  },
  {
    path: 'app',
    component: ShellComponent,
    children: childrenRoutes,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
