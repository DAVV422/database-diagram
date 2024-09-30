import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, HttpClientModule],  
})
export class DashboardModule {}
