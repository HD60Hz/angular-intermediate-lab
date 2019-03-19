import { Component, OnInit } from '@angular/core';
import { Film } from '../film';
import { FilmService } from '../film.service';

@Component({
    templateUrl: './film-shell.component.html'
})
export class FilmShellComponent implements OnInit {
    pageTitle =  'Films';
    monthCount: number;

    constructor(private filmService: FilmService) { }

    ngOnInit() {

    }

}
