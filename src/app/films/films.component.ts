import { FilmParamsService } from './film-params.service';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from './film.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Film } from './film';


@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css'],
})
export class FilmsComponent implements OnInit {

  pageTitle = 'Films';
  imageWidth = 50;
  imageMargin = 2;
  showImage = false;
  errorMessage = '';

  private _listFilter = '';

  filteredFilms: Film[] = [];
  films: Film[] = [];


  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filmParamsService.listFilter = this._listFilter;
    this.filteredFilms = this.listFilter ? this.performFilter(this.listFilter) : this.films;
  }


  constructor(private filmService: FilmService, private route: ActivatedRoute, private filmParamsService: FilmParamsService) {}

  ngOnInit(): void {
    const filterBy = this.filmParamsService.listFilter;
    this._listFilter = filterBy ? filterBy : '' ;
    this.showImage = this.filmParamsService.showImage === true;

    this.filmService.getFilms().subscribe(
      films => {
        this.films = films;
        this.filteredFilms = this.performFilter(this.listFilter);
      },
      error => this.errorMessage = <any>error
    );
  }

  onInputHasBenUpdated(term: string): void{
    this.listFilter = term;
  }

  performFilter(filterBy: string): Film[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.films.filter((film: Film) =>
      film.filmName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
    this.filmParamsService.showImage = this.showImage;
  }

}
