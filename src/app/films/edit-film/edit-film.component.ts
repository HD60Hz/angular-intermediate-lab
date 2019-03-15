import { ActivatedRoute, Router } from '@angular/router';
import { FilmService } from './../film.service';
import { Film, FilmResolved } from './../film';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/messages/message.service';

@Component({
  selector: 'app-edit-film',
  templateUrl: './edit-film.component.html',
  styleUrls: ['./edit-film.component.css']
})
export class EditFilmComponent implements OnInit {
  pageTitle = 'Modification de film';
  errorMessage: string;
  private originalFilm: Film;
  private currentFilm: Film;
  private dataIsValid: { [key: string]: boolean } = {};

  get isDirty(): boolean {
    return JSON.stringify(this.originalFilm) !==
      JSON.stringify(this.currentFilm);
  }

  get film(): Film {
    return this.currentFilm;
  }

  set film(value: Film) {
    this.currentFilm = value;
    this.originalFilm = { ...value };
  }

  constructor(private filmService: FilmService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const filmResolved: FilmResolved = data.film;
      this.errorMessage = filmResolved.error;
      this.onFilmRetrieved(filmResolved.film);
    });
  }

  getFilm(id: number): void {
    this.filmService.getFilm(id)
      .subscribe(
        (film: Film) => this.onFilmRetrieved(film),
        (error: any) => this.errorMessage = error as any
      );
  }

  onFilmRetrieved(film: Film): void {
    this.film = film;

    if (!this.currentFilm) {
      this.pageTitle = 'Aucun film';
    } else {
      if (this.film.id === 0) {
        this.pageTitle = 'Ajouter un Film';
      } else {
        this.pageTitle = `Modifier le Film: ${this.film.filmName}`;
      }
    }
  }

  deleteFilm(): void {
    if (this.film.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete(`${this.film.filmName} was deleted`);
    } else {
      if (confirm(`Confirmez vous la suppression le film : ${this.film.filmName}?`)) {
        this.filmService.deleteFilm(this.film.id)
          .subscribe(
            () => this.onSaveComplete(`${this.film.filmName} a été supprimé, j'espère que vous savez ce que vous faites`),
            (error: any) => this.errorMessage = error as any
          );
      }
    }
  }

  saveFilm(): void {
    if (this.isValid()) {
      if (this.film.id === 0) {
        this.filmService.createFilm(this.film)
          .subscribe(
            () => this.onSaveComplete(`The new ${this.film.filmName} was saved`),
            (error: any) => this.errorMessage = error as any
          );
      } else {
        this.filmService.updateFilm(this.film)
          .subscribe(
            () => this.onSaveComplete(`The updated ${this.film.filmName} was saved`),
            (error: any) => this.errorMessage = error as any
          );
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }

    this.router.navigate(['/films']);
    // Navigate back to the film list
  }

  isValid(path?: string): boolean {
    this.validate();
    if (path) {
      return this.dataIsValid[path];
    }
    return this.dataIsValid && Object.keys(this.dataIsValid).every(d => this.dataIsValid[d] === true);
  }

  validate(): void {
    this.dataIsValid = {};

    // tabs info
    if (this.film.filmName && this.film.filmCode && this.film.filmCode.length !== 4) {
      this.dataIsValid.info = true;
    } else {
      this.dataIsValid.info = false;
    }
    // tabs acteurs
    if (this.film.acteurs && this.film.acteurs.length > 0) {
      this.dataIsValid.acteurs = true;
    } else {
      this.dataIsValid.acteurs = false;
    }
  }
}
