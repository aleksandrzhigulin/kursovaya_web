import {Component} from '@angular/core';

import {SystemRoutingModule} from "./system-routing.module";
import {RouterOutlet} from "@angular/router";
import {MafinSidebarComponent} from "./shared/mafin-sidebar/mafin-sidebar.component";

@Component({
  selector: 'system',
  standalone: true,
  imports: [
    RouterOutlet,
    MafinSidebarComponent
  ],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss'
})
export class SystemComponent {}
