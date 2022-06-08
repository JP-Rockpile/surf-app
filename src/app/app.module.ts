import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';


import { AppComponent } from './app.component';
import { ReportComponent } from './report/report.component';
import { PreferencesComponent } from './preferences/preferences.component';

@NgModule({
  declarations: [
    AppComponent,
    ReportComponent,
    PreferencesComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule,
    MatTabsModule, 
    BrowserAnimationsModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
