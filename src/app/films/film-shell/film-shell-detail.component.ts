import { Component, OnInit } from '@angular/core';
import { FilmService } from '../film.service';
import { Film } from '../film';

@Component({
    selector: 'app-film-shell-detail',
    templateUrl: './film-shell-detail.component.html'
})
export class FilmShellDetailComponent implements OnInit {

  pageTitle: string = 'Film Detail';

  constructor(private filmService: FilmService) { }

  ngOnInit() {

  }
}
