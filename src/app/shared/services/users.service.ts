import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {User} from "../models/user.model";

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User[]>(`http://localhost:3000/users?email=${email}`).pipe(
      map(users => users[0])
    );
  }

  createNewUser(user: User): Observable<User> {
    return this.http.post<User>(`http://localhost:3000/users`, user).pipe()
  }

}
