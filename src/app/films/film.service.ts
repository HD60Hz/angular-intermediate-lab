import { Film } from './film';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private filmsUrl = 'api/films';

  constructor(private http: HttpClient) { }

  getFilms(): Observable<Film[]> {
    return this.http.get<Film[]>(this.filmsUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getFilm(id: number): Observable<Film> {
    if (id === 0) {
      return of(this.initializeFilm());
    }
    const url = `${this.filmsUrl}/${id}`;
    return this.http.get<Film>(url)
      .pipe(
        tap(data => console.log('getFilm: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createFilm(film: Film): Observable<Film> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    film.id = null;
    return this.http.post<Film>(this.filmsUrl, film, { headers: headers })
      .pipe(
        tap(data => console.log('createFilm: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteFilm(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.filmsUrl}/${id}`;
    return this.http.delete<Film>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteFilm: ' + id)),
        catchError(this.handleError)
      );
  }

  updateFilm(film: Film): Observable<Film> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.filmsUrl}/${film.id}`;
    return this.http.put<Film>(url, film, { headers: headers })
      .pipe(
        tap(() => console.log('updateFilm: ' + film.id)),
        // Return the film on an update
        map(() => film),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeFilm(): Film {
    // Return an initialized object
    return {
      id: 0,
      filmName: null,
      filmCode: null,
      category: null,
      acteurs: [],
      releaseDate: null,
      price: null,
      description: null,
      starRating: null,
      imageUrl: null
    };
  }
}
