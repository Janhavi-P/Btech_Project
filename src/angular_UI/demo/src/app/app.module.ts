import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card'; // Import the MatCardModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import {HttpClientModule } from '@angular/common/http'
import { LoginComponent } from './login/login.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    FormsModule,
 HttpClientModule,
  ],  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
