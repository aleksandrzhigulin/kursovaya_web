import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationsComponent } from './registrations/registrations.component';
import {AuthComponent} from "./auth.component";

const routes: Routes = [
  {
    path: '', component: AuthComponent,
    children: [
      { path: 'register', component: RegistrationsComponent },
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: './login', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // Используем forChild для вложенных маршрутов
  exports: [RouterModule]
})
export class AuthRoutingModule {}
