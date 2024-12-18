import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SystemComponent} from "./system.component";
import {AppPageComponent} from "./app-page/app-page.component";

const routes: Routes = [
  {path: '', component: SystemComponent, children: [
      {path: '', component: AppPageComponent},
    ]},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SystemRoutingModule {}
