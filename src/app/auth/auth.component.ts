import {Component} from '@angular/core';
import {AuthRoutingModule} from "./auth-routing.module";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'auth',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {}
