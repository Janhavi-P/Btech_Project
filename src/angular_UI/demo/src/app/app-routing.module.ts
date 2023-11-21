import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AdminDBComponent } from './adminDashboard/admin-db.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { GetusersComponent } from './getusers/getusers.component';
import { MaincontentComponent } from './maincontent/maincontent.component';
import { FilelistComponent } from './filelist/filelist.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { AdmindocanalysisComponent } from './admindocanalysis/admindocanalysis.component';
import { DocanalyticsComponent } from './docanalytics/docanalytics.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'create-account', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route to redirect to login
  {path:'admin-dashboard',component:AdminDBComponent },
  {path:'employee-dashboard',component:EmployeeDashboardComponent},
  {path:'getusers',component:GetusersComponent},
  { path: 'main', component: MaincontentComponent},
  { path: 'file-list', component: FilelistComponent},
  { path: 'edit-profile/:id', component: EditprofileComponent},
  { path: 'viewanalysis', component: DocanalyticsComponent},
  { path: 'goback', component: EmployeeDashboardComponent},
  { path: 'logout', component: LoginPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
