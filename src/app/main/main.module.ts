import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MainRoutingModule } from './main-routing.module';
import { ChartComponent } from './components/chart/chart.component';

@NgModule({
  declarations: [
    MainPageComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }