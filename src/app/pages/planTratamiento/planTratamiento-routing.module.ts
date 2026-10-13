import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanTratamientoComponent } from './planTratamiento.component';

const routes: Routes = [
    {
        path: '',
        component: PlanTratamientoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlanTratamientoRoutingModule { }
