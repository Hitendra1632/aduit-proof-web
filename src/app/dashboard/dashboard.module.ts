import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { DetailsComponent } from './details/details.component';
import { SharedModule } from '../common/shared/shared.module';


@NgModule({
  declarations: [DashboardComponent, DetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
