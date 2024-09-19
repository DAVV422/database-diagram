import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DiagramaModule } from './modules/diagrama/diagrama.module';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { GojsAngularModule } from 'gojs-angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DiagramaModule,
    GojsAngularModule,
    HttpClientModule,
    AppRoutingModule,        
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
