import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card'; // Import the MatCardModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import {HttpClientModule } from '@angular/common/http'
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { DialogComponent } from './dialog/dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginPageComponent } from './login-page/login-page.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

import {MatDialogModule} from '@angular/material/dialog';
import { AdminDBComponent } from './adminDashboard/admin-db.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';

import { GetusersComponent } from './getusers/getusers.component';
import { DocanalyticsComponent } from './docanalytics/docanalytics.component';
import { ActionrendererComponent } from './actionrenderer/actionrenderer.component';
import { DeleteusersComponent } from './deleteusers/deleteusers.component';
import { ViewuserdialogComponent } from './viewuserdialog/viewuserdialog.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { HeaderComponent } from './header/header.component';
import { FolderComponent } from './folder/folder.component';

import { MaincontentComponent } from './maincontent/maincontent.component';
import { FilelistComponent } from './filelist/filelist.component';
import { DownloadbuttonComponent } from './downloadbutton/downloadbutton.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { AdmindocanalysisComponent } from './admindocanalysis/admindocanalysis.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginPageComponent,
    AdminDBComponent,
    EmployeeDashboardComponent,    
    GetusersComponent,
          DocanalyticsComponent,
          ActionrendererComponent,
          DeleteusersComponent,
          ViewuserdialogComponent,
          SideNavComponent,
          HeaderComponent,
          FolderComponent,
             MaincontentComponent,
                  FilelistComponent,
                  DownloadbuttonComponent,
                  EditprofileComponent,
                  AdmindocanalysisComponent,
   
    // DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    FormsModule,
 HttpClientModule,
 BrowserAnimationsModule,
 MatDialogModule,
 MatButtonModule,
 MatSnackBarModule,
 MatToolbarModule,
MatIconModule,
MatDialogModule,
AgGridModule,
MatMenuModule,

  ],  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
