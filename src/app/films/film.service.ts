import { Film } from './film';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  private filmsUrl = 'api/films';
  private films: Film[];

  // Supprimer currentFilm: Film; pour qu'aucun component ou service puisse accéder à l'information en dehors de notre subject

  // ajout de subject
  private selctedFilmSource = new BehaviorSubject<Film|null>(null);

  // déclarer notre observable pour informer en cas de changement
  selctedFilmChange$ = this.selctedFilmSource.asObservable();

  constructor(private http: HttpClient) { }

  // fonction comme facade public afin de mettre à jour le film selectionner
  changeCurrentFilm(selectedFilm: Film | null): void {
    this.selctedFilmSource.next(selectedFilm);
  }

  getFilms(): Observable<Film[]> {
    if (this.films) {
      return of(this.films);
    }

    return this.http.get<Film[]>(this.filmsUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        tap(data => this.films = data),
        catchError(this.handleError)
      );
  }

  getFilm(id: number): Observable<Film> {
    if (id === 0) {
      return of(this.initializeFilm());
    }
    if (this.films) {
      const filmRetrieved = this.films.find(f => {
        return f.id === id;
      });
      if (filmRetrieved) { return of(filmRetrieved); }
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
    return this.http.post<Film>(this.filmsUrl, film, { headers })
      .pipe(
        tap(data => console.log('createFilm: ' + JSON.stringify(data))),
        tap(data => {
          this.films.push(data);
          this.changeCurrentFilm(data);
        }),
        catchError(this.handleError)
      );
  }

  deleteFilm(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.filmsUrl}/${id}`;
    return this.http.delete<Film>(url, { headers })
      .pipe(
        tap(data => console.log('deleteFilm: ' + id)),
        tap(data => {
          this.films.filter(function (f) {
            return f.id !== id;
          });
          this.changeCurrentFilm(null);
        }
        ),
        catchError(this.handleError)
      );
  }

  updateFilm(film: Film): Observable<Film> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.filmsUrl}/${film.id}`;
    return this.http.put<Film>(url, film, { headers })
      .pipe(
        tap(() => console.log('updateFilm: ' + film.id)),
        map(() => film),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeFilm(): Film {
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
