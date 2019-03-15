import { FilmService } from './../film.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Film, FilmResolved } from '../film';

@Component({
  templateUrl: './edit-film-acteurs.component.html'
})
export class EditFilmActeursComponent implements OnInit {
  errorMessage: string;
  newActeurs = '';
  film: Film;

  constructor(private route: ActivatedRoute, private filmService: FilmService) { }

  ngOnInit(): void {
    this.route.parent.data.subscribe(data => {
      const filmResolved: FilmResolved = data['film'];
      this.errorMessage = filmResolved.error;
      this.film = filmResolved.film;
    });
  }

  addActeurs(): void {
    if (!this.newActeurs) {
      this.errorMessage = `Ajouter les noms d'acteurs séparer de virgule et appuyer sur ajouter`;
    } else {
      const acteurArray = this.newActeurs.split(',');
      this.film.acteurs = this.film.acteurs ? this.film.acteurs.concat(acteurArray) : acteurArray;
      this.newActeurs = '';
      this.errorMessage = '';
    }
  }

  // Remove the acteur from the array of acteurs.
  removeActeur(idx: number): void {
    this.film.acteurs.splice(idx, 1);
  }
}
