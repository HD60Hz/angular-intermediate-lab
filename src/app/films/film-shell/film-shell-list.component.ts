import { Component, OnInit } from '@angular/core';

import { Film } from '../film';
import { FilmService } from '../film.service';

@Component({
  selector: 'app-film-shell-list',
  templateUrl: './film-shell-list.component.html'
})
export class FilmShellListComponent implements OnInit {
  pageTitle: string = 'Films';
  errorMessage: string;
  films: Film[];

  constructor(private filmService: FilmService) { }

  ngOnInit(): void {
    this.filmService.getFilms().subscribe(
      (films: Film[]) => {
        this.films = films;
      },
      (error: any) => this.errorMessage = <any>error
    );
  }

  changeCurrentFilm(film: Film): void{
    this.filmService.changeCurrentFilm(film);
  }

}
