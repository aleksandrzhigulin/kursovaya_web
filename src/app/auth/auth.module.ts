import {NgModule} from '@angular/core';
import {LoginComponent} from "./login/login.component";
import {RegistrationsComponent} from "./registrations/registrations.component";
import {AuthComponent} from "./auth.component";
import {CommonModule} from "@angular/common";
import {AuthRoutingModule} from "./auth-routing.module";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationsComponent,
  ],
  imports: [
    CommonModule,
    AuthComponent,
    AuthRoutingModule,
    SharedModule,
  ]
})
export class AuthModule {}
