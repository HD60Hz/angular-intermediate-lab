import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './film-shell.component.html'
})
export class FilmShellComponent implements OnInit {
    pageTitle: string = 'Films';
    monthCount: number;

    constructor() { }

    ngOnInit() {
    }

}
