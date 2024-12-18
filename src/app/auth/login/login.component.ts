import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../shared/services/users.service";
import {User} from "../../shared/models/user.model";
import {Message} from "../../shared/models/message.model";
import {AuthService} from "../../shared/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  message: Message;

  constructor(private fb: FormBuilder, private usersService: UsersService, private authService: AuthService,
              private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.message = new Message('', '');
  }

  onSubmit() {
    const formData = this.form.value;

    this.usersService.getUserByEmail(formData.email).subscribe((user: User) => {
      if (user) {
        if (user.password === formData.password) {
          window.localStorage.setItem('user', JSON.stringify(user));
          this.authService.login();
          this.router.navigate(['/system'], {});
        } else {
          this.showMessage({text: "Введённые данные некорректны", type:"danger"});
        }
      } else {
        this.showMessage({text: "Введённые данные некорректны", type: "danger"});
      }
    });
  }

  showMessage(message: Message) {
    this.message = message;

    window.setTimeout(() => {
      this.message.text = '';
    }, 5000);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params["nowCanLogin"]) {
        this.showMessage({text: 'Теперь вы можете авторизоваться!', type: 'success'});
      }
    })
  }
}
