import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTasksComponent } from './list-tasks/list-tasks.component';
import { CommonModule } from '@angular/common';
import { AddTasksComponent } from './add-tasks/add-tasks.component';
import { EditTasksComponent } from './edit-tasks/edit-tasks.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { LogoutComponent } from './logout/logout.component';


export const routes: Routes = [
  // {path: '', component: ListTasksComponent, pathMatch: 'full'},
  {path: '', component: LoginComponent, pathMatch: 'full'},
  {path: 'add-task', component: AddTasksComponent},
  {path: 'edit/:id', component: EditTasksComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'logout', component: LogoutComponent }
];

@NgModule({
  imports: [CommonModule,
            RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})

export class AppRoutingModule { }
