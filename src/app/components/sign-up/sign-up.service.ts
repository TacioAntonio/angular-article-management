import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../shared/contants';
import { IUser } from '../../shared/interfaces/iuser';

@Injectable()
export class SignUpService {
  private readonly API_URL = API_URL;

  constructor(private readonly http: HttpClient) {}

  createUser(body: IUser) {
    return this.http.post(`${this.API_URL}/create-user`, body);
  }
}