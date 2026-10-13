import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { RipsSinFacturaRoutingModule } from './rips-sin-factura-routing.module';
import { RipsSinFacturaComponent } from './rips-sin-factura.component';

@NgModule({
  declarations: [RipsSinFacturaComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    PageLayoutModule,
    RipsSinFacturaRoutingModule
  ]
})
export class RipsSinFacturaModule {}
