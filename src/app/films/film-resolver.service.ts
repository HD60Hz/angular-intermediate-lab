import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { FilmResolved } from './film';
import { FilmService } from './film.service';

@Injectable({
  providedIn: 'root'
})
export class FilmResolver implements Resolve<FilmResolved> {

  constructor(private filmService: FilmService) { }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<FilmResolved> {
    const id = route.paramMap.get('id');
    if (isNaN(+id)) {
      const message = `id du film c'est pas numéro : ${id}`;
      console.error(message);
      return of({ film: null, error: message });
    }

    return this.filmService.getFilm(+id)
      .pipe(
        map(film => ({ film: film })),
        catchError(error => {
          const message = `error: ${error}`;
          console.error(message);
          return of({ film: null, error: message });
        })
      );
  }

}
