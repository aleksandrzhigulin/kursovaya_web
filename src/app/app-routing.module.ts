import {NgModule} from '@angular/core';

import {Router, RouterModule, Routes} from '@angular/router';
import {SystemComponent} from "./system/system.component";
import {HttpClientModule} from "@angular/common/http";
import {InfoPageComponent} from "./info-page/info-page.component";

export const routes: Routes = [
  {path: 'auth', loadChildren: () => import("./auth/auth.module").then(m  => m.AuthModule)},
  {path: '', component: InfoPageComponent},
  {path: 'system', loadChildren: () => import("./system/system.module").then(m  => m.SystemModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule],
  providers: [HttpClientModule]
})

export class AppRoutingModule { }
