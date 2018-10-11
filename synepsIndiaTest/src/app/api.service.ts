import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const apiUrl = 'http://localhost:3001/api/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  headerData: EventEmitter<any> = new EventEmitter();
  token: any;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }
  login(data): Observable<any> {
    const url = apiUrl + 'login';
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  signUp(data): Observable<any> {
    const url = apiUrl + 'signUp';
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  verifyAccount(data): Observable<any> {
    const url = apiUrl + 'verifyAccount';
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  allProductList(): Observable<any> {
    const url = apiUrl + 'getAllProduct';
    return this.http.get(url, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  getMyProductList(data): Observable<any> {
    const url = apiUrl + 'getMyProductList';
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  addMyProduct(data): Observable<any> {
    const url = apiUrl + 'addMyProduct';
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  public get loggedIn(): boolean {
    return (localStorage.getItem('token') !== null);
  }

  isAuth() {
    try {
      if (localStorage.getItem('token')) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  }
 
  isAuthenticated() {
    this.token = window.localStorage.getItem('token');
    return this.token != null;
  }
}
