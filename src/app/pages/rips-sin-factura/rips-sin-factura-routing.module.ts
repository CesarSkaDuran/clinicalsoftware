import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RipsSinFacturaComponent } from './rips-sin-factura.component';

const routes: Routes = [{ path: '', component: RipsSinFacturaComponent, data: { title: 'RIPS sin factura' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RipsSinFacturaRoutingModule {}
