import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {Message} from "../../shared/models/message.model";
import {UsersService} from "../../shared/services/users.service";
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/models/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registrations',
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.scss']
})
export class RegistrationsComponent {
  form: FormGroup;
  message: Message;

  constructor(private fb: FormBuilder, private usersService: UsersService, private authService: AuthService,
              private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email], this.forbiddenEmails.bind(this)],
      password: ['', [Validators.required, Validators.minLength(6),
        this.passwordContainsSpecialChars, this.passwordContainsUppercase, this.passwordContainsSpecialChars, this.passwordNoTripleLetters]],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      agree: [false, Validators.requiredTrue],
    }, {validators: this.passwordsMatchValidator});

    this.message = new Message('', '');
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const {email, password, name} = this.form.value;
    const user = new User(name, email, password);

    this.usersService.createNewUser(user).subscribe((user: User) => {
      console.log(user);
      this.router.navigate(['/auth/login'], {
        queryParams: {nowCanLogin: true}
      });
    });
  }

  showMessage(text: string, type: string = 'danger') {
    this.message = new Message(type, text);

    window.setTimeout(() => {
      this.message.text = '';
    }, 5000);
  }

  forbiddenEmails(control: FormControl): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.usersService.getUserByEmail(control.value).subscribe((user: User) => {
        if (user) {
          resolve({forbiddenEmail: true});
        } else {
          resolve(null);
        }
      });
    });
  }

  passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {passwordMismatch: true};
  }

  passwordContainsSpecialChars(control: FormControl): { [key: string]: any } | null {
    const regex = /[@!?#_\-]/;
    return regex.test(control.value) ? null : {noSpecialChars: true};
  }

  passwordContainsUppercase(control: FormControl): { [key: string]: any } | null {
    const regex = /[A-Z]/;
    return regex.test(control.value) ? null : {noUppercase: true};
  }

  passwordNoTripleLetters(control: FormControl): { [key: string]: any } | null {
    const regex = /(.)\1\1/;
    return regex.test(control.value) ? {hasTripleLetters: true} : null;
  }
}
