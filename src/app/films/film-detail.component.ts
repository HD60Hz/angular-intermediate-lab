import { FilmResolver } from './film-resolver.service';
import { Component, OnInit } from '@angular/core';

import { Film, FilmResolved } from './film';
import { FilmService } from './film.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent implements OnInit {
  pageTitle = 'Film Detail';
  film: Film;
  errorMessage: string;

  constructor(private filmService: FilmService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const filmResolved: FilmResolved = data['film'];
      this.errorMessage = filmResolved.error;
      this.onFilmRetrieved(filmResolved.film);
    });
  }

  getFilm(id: number) {
    this.filmService.getFilm(id).subscribe(
      film => this.onFilmRetrieved(film),
      error => this.errorMessage = <any>error);
  }

  onFilmRetrieved(film: Film): void {
    this.film = film;

    if (this.film) {
      this.pageTitle = `Détail du film: ${this.film.filmName}`;
    } else {
      this.pageTitle = 'Aucun film trouvé';
    }
  }
}
