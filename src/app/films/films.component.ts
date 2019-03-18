import { ActivatedRoute } from '@angular/router';
import { FilmService } from './film.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Film } from './film';


@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
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
    this.filteredFilms = this.listFilter ? this.performFilter(this.listFilter) : this.films;
  }


  constructor(private filmService: FilmService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const filterBy = this.route.snapshot.queryParamMap.get('filterBy');
    this._listFilter = filterBy ? filterBy: 'Sc' ;
    this.showImage = JSON.parse(this.route.snapshot.queryParamMap.get('showImage'));

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
  }

}
