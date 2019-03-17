import { ActivatedRoute } from '@angular/router';
import { FilmService } from './film.service';
import { Component, OnInit } from '@angular/core';
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

  listFilter = '';

  filteredFilms: Film[] = [];
  films: Film[] = [];

  constructor(private filmService: FilmService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    const filterBy = this.route.snapshot.queryParamMap.get('filterBy');
    this.listFilter = filterBy ? filterBy: '' ;
    this.showImage = JSON.parse(this.route.snapshot.queryParamMap.get('showImage'));

    this.filmService.getFilms().subscribe(
      films => {
        this.films = films;
        this.filteredFilms = this.performFilter(this.listFilter);
      },
      error => this.errorMessage = <any>error
    );
  }

  filterFilm(term: string): void{
    this.listFilter = term;
    this.filteredFilms = this.performFilter(this.listFilter);
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
