import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcedimientosPacienteComponent } from './procedimientosPaciente.component';

const routes: Routes = [{ path: '', component: ProcedimientosPacienteComponent, data: { title: 'Administration' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcedimientosPacienteRoutingModule {}
