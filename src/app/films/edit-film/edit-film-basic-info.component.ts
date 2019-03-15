import { FilmService } from './../film.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Film, FilmResolved } from '../film';

@Component({
  templateUrl: './edit-film-basic-info.component.html'
})
export class EditFilmBasicInfoComponent implements OnInit {
  @ViewChild(NgForm) filmForm: NgForm;

  errorMessage: string;
  film: Film;

  constructor(private route: ActivatedRoute, private filmService: FilmService) { }

  ngOnInit(): void {
    // TODO UNSUBSCRIBE
    this.route.parent.data.subscribe(data => {
      if (this.filmForm){
        this.filmForm.reset();
      }
      const filmResolved: FilmResolved = data['film'];
      this.errorMessage = filmResolved.error;
      this.film = filmResolved.film;
    });
  }

}
