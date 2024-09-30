import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { IUser, IUserCreate } from '../interfaces';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl: string = environment.baseUrl + '/users';

  constructor(
    private http: HttpClient
  ) { }

  getUser(id: string): Observable<IUser | null> {
    return this.http.get<IUser>(`${this.baseUrl}/${id}`).
      pipe(
        catchError(err => of(null))
      );
  }

  createUser(user: IUserCreate): Observable<IUser> {
    return this.http.post<IUser>(`${this.baseUrl}`, user);
  }

  updateUser(userId: string,data: any): Observable<IUser> {
    return this.http.patch<IUser>(`${this.baseUrl}/${userId}`, data);
  }

  deleteUser(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/${id}`).
      pipe(
        map(() => true),
        catchError(err => of(false)),
      );
  }
}
