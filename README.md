Angular component communication
===============================

# Component-template #

* Interpolation exemple dans 'app.component.*'
```html
<a class="navbar-brand">{{title}}</a>
```
```typeScript
  title = 'A-team';
```
* Property Binding exemple dans 'a-team.component.*'
```html
<img src="./assets/images/logo.jpg" [style.width.%]='imageWidth' class="img-responsive center-block"
          style="max-height:300px;padding-bottom:50px" />
```
```typeScript
  imageWidth: number = 100;
```
* Event Binding 'films.component.*'
```html
<button class="btn btn-outline-primary btn-sm" (click)="toggleImage()">
            {{showImage ? "Cacher" : "Afficher"}} Image
          </button>
```
```typeScript
  toggleImage(): void {
    this.showImage = !this.showImage;
  }
```
* Two-way Binding ''
```html
 <input type="text" [(ngModel)]="listFilter" />
```
```typeScript
  listFilter: string;
```

Le filtre ne fonctionne plus parce qu'on doit catcher l'event de chanement de valeur la chaine listFilter pour mettre à jour la liste des film filtré

```html
          <input type="text" [ngModel]="listFilter" (ngModelChange)="filterFilm($event)"/>
```
```typeScript
  filterFilm(term: string): void{
    this.listFilter = term;
    this.filteredFilms = this.performFilter(this.listFilter);
  }
```
* Pattern getter et setter
Pour définir une propriété il y a deux moyens :

1. Déclaration classique :
```typeScript
  listFilter: string;
```
2. par getter et setter
```typeScript
  private _listFilter: string;

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
  }
```

Chaque fois la valeur est modifié on appelle le setter, oui c'est ce qu'il nous faut, on va  appelé la fonction qui met à jour la liste des films filtré

2. par getter et setter
```typeScript
  private _listFilter: string;

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredFilms = this.listFilter ? this.performFilter(this.listFilter) : this.films;
  }
```
```html
 <input type="text" [(ngModel)]="listFilter" />
```

L'utilisation de getter/setter ou de propriété ça dépend du besoin, même si je trouve que le pattern getter et setter est plus propre

* ViewChild et ViewChildren
1. ViewChild : 
pour récupérer un élément ou une directive à partir de la template 

A l'aide du symbole '#' on peut donner à l'élément dans la template une référence

```html
          <input type="text" [(ngModel)]="listFilter" #filterElement/>
```
Dans le component on va le déclarer en utilisant le decorateur @ViewChild

```typeScript

 @ViewChild('filterElement') inputFilter;

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredFilms = this.listFilter ? this.performFilter(this.listFilter) : this.films;
  }


  constructor(private filmService: FilmService, private route: ActivatedRoute) {
    console.log('input de filtre :', this.inputFilter);
  }
  ```
Oups, 'Undefined', c'est le component qui est construit et initialisé puis la template, c'est pourquoi il n'a pas trouvé la référence, pour remédier à ça on va utiliser lifeCycle hooks de Angular qui nous fournit 

```typeScript
export class FilmsComponent implements OnInit, AfterViewInit {
// .......................
  ngAfterViewInit(): void{
    console.log('input de filtre :', this.inputFilter);
  }

```
On sait maintenant que sont type est 'ElementRef', on va typer notre élément

C'est un nativeElement, on peut utiliser ses propriété html ou ses fonctions comme focus()

```typeScript
  @ViewChild('filterElement') inputFilter: ElementRef;
//......................................

  ngAfterViewInit(): void{
    console.log('input de filtre :', this.inputFilter);
    this.inputFilter.nativeElement.focus();
  }
```

L'accès au Dom directement est fortement déconseillé : 
- ça crée un couplage fort avec le navigateur 
- On est plus vulnérable aux attaques xss
......

Presque de la même façon on peut selectionner plusieurs éléments 

2. ViewChildren

```typeScript
@ViewChildren('divElementVar')
divs: QueryList<ElementRef>;
```
# Communication parent to child #

Pour avoir une communication entre component parent et component enfant, la template du parent doit contenir la template de la fille.

On va commencer à le faire en créant un component pour gérer que le filtre 

On utilisant angular/cli on va génerer un component dans le module shared comme ça on peut le réutiliser dans toute l'application 

```bash
ng g c shared/criteria
```
Si on regarde de prés notre shared.module.ts 
```typeScript
@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [
    StarComponent,
    CriteriaComponent
  ],
  exports: [
    StarComponent,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
```
On voit bien qu'il l'a ajouté dans les déclarations, c'est pas suffisant pour qu'on puisse l'utiliser, il faut le partager on le mettant dans 'exports'

```typeScript
@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [
    StarComponent,
    CriteriaComponent
  ],
  exports: [
    StarComponent,
    CommonModule,
    FormsModule,
    CriteriaComponent
  ]
})
export class SharedModule { }
```

On va utiliser l'html qu'on a déjà dans notre page films

'criteria.component.html'
```html
<div class="col-md-12">Filtrer par titre: <input type="text" [(ngModel)]="listFilter" #filterElement /></div>
```

on va appeler notre component dans le html de film 

```html
      <div class="row">
        <app-criteria class="col-md-8 row"></app-criteria>
        <div class="col-md-4 text-right">
          <button class="btn btn-outline-primary btn-sm" (click)="toggleImage()">
            {{showImage ? "Cacher" : "Afficher"}} Image
          </button>
        </div>
      </div>
```

Pour l'instant notre component criteria ne fait rien, mais on va lui passer une valeur par defaut on utilisant le systeme de propriete

```html
      <div class="row">
        <app-criteria class="col-md-8 row" [listFilter]="listFilter"></app-criteria>
        <div class="col-md-4 text-right">
          <button class="btn btn-outline-primary btn-sm" (click)="toggleImage()">
            {{showImage ? "Cacher" : "Afficher"}} Image
          </button>
        </div>
      </div>
```

à l'aide du décorateur @Input() on peut récupérer la valeur de listFilter

'criteria.component.ts'
```typeScript
  private _listFilter = '';
// On a utiliser le pattern de getter et setter il y a une 2e solution c'est le lifecycle hooks : ...
// ngOnChanges(changes: SimpleChanges) {
// }
  @Input()
  set listFilter(value: string) {
    this._listFilter = value;
  }

  get listFilter(): string {
    return this._listFilter;
  }
```

dans le typeScript on va initialiser notre term de recherche par 'Sc'
```typeScript
  private _listFilter = '';
    //..........................................
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredFilms = this.listFilter ? this.performFilter(this.listFilter) : this.films;
  }

  ngOnInit(): void {
    const filterBy = this.route.snapshot.queryParamMap.get('filterBy');
    this._listFilter = filterBy ? filterBy: 'Sc' ;
    this.showImage = JSON.parse(this.route.snapshot.queryParamMap.get('showImage'));
    //..........................................
```

On a bien réussie à passer une information du parent component au child component

Maintenant avec la référence sur la template on va essayer à accéder à la valeur de l'input depuis le parent 

```html
<div class="row">
  <!-- réference sur l'html -->
  <app-criteria class="col-md-8 row" [listFilter]="listFilter" #filterCriteria></app-criteria>
  <div class="col-md-4 text-right">
    <button class="btn btn-outline-primary btn-sm" (click)="toggleImage()">
      {{showImage ? "Cacher" : "Afficher"}} Image
    </button>
  </div>
</div>
<div class="row" *ngIf="listFilter">
  <div class="col-md-4">
    <h4> filtré par : {{filterCriteria.listFilter}}</h4>
  </div>
</div>
```
Le filtre ne marche plus mais on va le réparer ensemble juste après (y) 

# Communication child to component #

Comme vous l'avez constaté on a besoin parfois de faire la communication dans l'autre sens ça veut dire dans le sens du child vers le parent 

On va commencer par réparer notre filtre en utilisant le déorateur @Output()

* Comment ça marche :

1. Le component child à chaque modification de l'input va émettre un évenement avec du data comme payload 

'CriteriaComponent'
```typeScript
// déclaration de 
  @Output() valueModified: EventEmitter<string> = new EventEmitter<string>();
  private _listFilter = '';
  @Input()
  set listFilter(value: string) {
    this._listFilter = value;
    // émet un événement avec du data 
    this.valueModified.emit(value);
  }
  get listFilter(): string {
    return this._listFilter;
  }
```
2. Le component parent va le catcher dans la template 
'FilmsComponent.html'
```html
<app-criteria class="col-md-8 row" [listFilter]="listFilter" (valueModified)='onInputHasBenUpdated($event)'
        #filterCriteria>
```
3. Le component parent a faire un traitement avec du data récupérer
'FilmsComponent'
```typeScript
  onInputHasBenUpdated(term: string): void{
    this.listFilter = term;
  }
```
Et voilà notre filtre est sauvé :) 

# Communication par service #

A la création de service, il faut l'enregistrer comme un provider avec Angular Injector, ensuite on peut l'injecter dans les components.

Les services par défaut dans Angular sont singletons, ce qui veut dire que tous les component auront accés aux même données.


Parmis les utilisations de service on a : 
- service de log
- Encapsulation de fonction d'accès aux données 
- partage de data
- calcul et vérification de rg 
- ..... 

* Service comme un stock de propriété : 
Pour garder l'affichage de l'image et du filtre on a utilisé dans notre module de routage la queryParamsHandling="preserve", maintenant on va le faire avec les services.

Nous allons nettoyer ce qu'on a fait dans le routage 

'FilmsComponent.html'
```html
<!-- supprimer le  [queryParams]="{filterBy : listFilter, showImage: showImage}" -->
<a [routerLink]="['/films',film.id]">
                {{ film.filmName }}
              </a>
```          
'FilmsComponent'
```typeScript

  ngOnInit(): void {
    // delete this
    // const filterBy = this.route.snapshot.queryParamMap.get('filterBy');
    // this._listFilter = filterBy ? filterBy: '' ;
    // this.showImage = JSON.parse(this.route.snapshot.queryParamMap.get('showImage'));
```
'FilmDetailComponent.html'
```html
<!-- supprimer le   queryParamsHandling="preserve" -->
<button class="btn btn-outline-secondary mr-3" style="width:160px" [routerLink]="['/films']">
```

Maintenant on va génerer un service avec angular/cli

```bash
ng g s films/film-params
```
Par défaut Angular/cli ajoute sur le service décorateur @Injectable({providedIn: 'root'}) on peut l'enlever par contre il faut l'ajouter dans le provider de film.module par exemple  ou dans le component à l'aide du systeme de providers.

'film-params.service.ts'
```typeScript
@Injectable()
export class FilmParamsService {
```
film.module.ts
```typeScript
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    FilmsComponent,
    FilmDetailComponent,
    EditFilmComponent,
    EditFilmBasicInfoComponent,
    EditFilmActeursComponent
  ],
  providers: [FilmParamsService]
})
export class FilmModule { }
```
Maintenant le service est accesible

On va ajouter les prorietés qu'on veut garder dans le service 

```typeScript
import { Injectable } from '@angular/core';
@Injectable()
export class FilmParamsService {
  showImage: boolean;
  listFilter: string;
  constructor() { }
}
```
Oui c'est tout ce qu'il faut faire c'est un service de stockage de proriétés :) 

maintenant dans le FilmsComponent on va utiliser notre service

```typeScript
  set listFilter(value: string) {
    this._listFilter = value;
    // ici
    this.filmParamsService.listFilter = this._listFilter;
    this.filteredFilms = this.listFilter ? this.performFilter(this.listFilter) : this.films;
  }
  
  // ici
  constructor(private filmService: FilmService, private route: ActivatedRoute, private filmParamsService: FilmParamsService) {}
  
  ngOnInit(): void {
  // ici
    const filterBy = this.filmParamsService.listFilter;
    this._listFilter = filterBy ? filterBy : '' ;
    this.showImage = this.filmParamsService.showImage === true;

//......................
  toggleImage(): void {
    this.showImage = !this.showImage;
    // ici
    this.filmParamsService.showImage = this.showImage;
  }

```

et bingo ça fonctionne comme sur des roulettes

Avants de passer à autres choses il faut bien comprendre le cycle de vie de service :

- Déclaration de service dans app.module, il sera accessible par tous les components de l'applications  

- Déclaration dans le component par exemple celui de FilmsComponent
```typeScript
@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css'],
  providers: [FilmParamsService]
})
export class FilmsComponent implements OnInit {
```
Le service sera détruit quand le component sera détruit et il sera accessible par tous les child components et les child route component 

si on l'ajoute une deuxième fois dans le FilmDetailComponent, on aura deux instance de filmParamsService

- Déclaration dans le module d'une feature par exemple film.module
il sera accessible par tous les components de l'application mais si on utilise le lazy loading, il va être charger seulement que le module est chargé 

Parfois on a besoin de plus qu'un service de stockage de propriétés

* Gestion de state par service

Parfois on a besoin de récupérer des entités et de les mettre dans une state, dans le but de minimiser les aller retour au back end.

Comment le faire :
- Ajouter une list qui représente le state 
- A la récupération de la liste on va retourner la state 
- A la consultation de détail : on va retourner l'élément concerné à partir de la liste
- A la création : on va ajouter l'élément dans la state
- A la suppression : On supprime l'élément dans la liste 
- Ajouter du code si on a besoin d'expirer la validité du state 

Il n'y a pas mieux qu'un exemple pratique :

Nous avons déjà un service aves le fonctions basique pour gérer les entités

'film.service.ts'
```typeScript
import { Film } from './film';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private filmsUrl = 'api/films';

  constructor(private http: HttpClient) { }

  getFilms(): Observable<Film[]> {
    return this.http.get<Film[]>(this.filmsUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getFilm(id: number): Observable<Film> {
    if (id === 0) {
      return of(this.initializeFilm());
    }
    const url = `${this.filmsUrl}/${id}`;
    return this.http.get<Film>(url)
      .pipe(
        tap(data => console.log('getFilm: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createFilm(film: Film): Observable<Film> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    film.id = null;
    return this.http.post<Film>(this.filmsUrl, film, { headers: headers })
      .pipe(
        tap(data => console.log('createFilm: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteFilm(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.filmsUrl}/${id}`;
    return this.http.delete<Film>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteFilm: ' + id)),
        catchError(this.handleError)
      );
  }

  updateFilm(film: Film): Observable<Film> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.filmsUrl}/${film.id}`;
    return this.http.put<Film>(url, film, { headers: headers })
      .pipe(
        tap(() => console.log('updateFilm: ' + film.id)),
        map(() => film),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeFilm(): Film {
    return {
      id: 0,
      filmName: null,
      filmCode: null,
      category: null,
      acteurs: [],
      releaseDate: null,
      price: null,
      description: null,
      starRating: null,
      imageUrl: null
    };
  }
}
```
Nous utilisons in-memory-web-api pour un fake backend

Nous allons ajouter la liste de film comme state dans le service 

```typeScript
export class FilmService {
  private filmsUrl = 'api/films';
  // ici
  private films: Film[];
  constructor(private http: HttpClient) { }
```
On va adapter tous les méthodes pour profiter au max de notre state 

```typeScript
import { Film } from './film';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilmService {
  
  private filmsUrl = 'api/films';
  private films: Film[];

  constructor(private http: HttpClient) { }

  getFilms(): Observable<Film[]> {
    return this.http.get<Film[]>(this.filmsUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        tap(data => this.films = data),
        catchError(this.handleError)
      );
  }

  getFilm(id: number): Observable<Film> {
    if (id === 0) {
      return of(this.initializeFilm());
    }
    if (this.films) {
      const filmRetrieved = this.films.find(f => {
        return f.id === id;
      });
      if (filmRetrieved) { return of(filmRetrieved); }
    }
    const url = `${this.filmsUrl}/${id}`;
    return this.http.get<Film>(url)
      .pipe(
        tap(data => console.log('getFilm: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createFilm(film: Film): Observable<Film> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    film.id = null;
    return this.http.post<Film>(this.filmsUrl, film, { headers })
      .pipe(
        tap(data => console.log('createFilm: ' + JSON.stringify(data))),
        tap(data => this.films.push(data)),
        catchError(this.handleError)
      );
  }

  deleteFilm(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.filmsUrl}/${id}`;
    return this.http.delete<Film>(url, { headers })
      .pipe(
        tap(data => console.log('deleteFilm: ' + id)),
        tap(data =>
          this.films.filter(function(f) {
            return f.id !== id;
          })
        ),
        catchError(this.handleError)
      );
  }

  updateFilm(film: Film): Observable<Film> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.filmsUrl}/${film.id}`;
    return this.http.put<Film>(url, film, { headers })
      .pipe(
        tap(() => console.log('updateFilm: ' + film.id)),
        map(() => film),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeFilm(): Film {
    return {
      id: 0,
      filmName: null,
      filmCode: null,
      category: null,
      acteurs: [],
      releaseDate: null,
      price: null,
      description: null,
      starRating: null,
      imageUrl: null
    };
  }
}

```

Pour parler de la synchronisation de state nous avons besoin d'afficher la liste et le détail de film côte à côte 

modifier le film.module.ts
```typeScript
import { FilmShellListComponent } from './film-shell/film-shell-list.component';
import { FilmShellDetailComponent } from './film-shell/film-shell-detail.component';
import { FilmShellComponent } from './film-shell/film-shell.component';
import { FilmParamsService } from './film-params.service';
import { EditFilmActeursComponent } from './edit-film/edit-film-acteurs.component';
import { EditFilmBasicInfoComponent } from './edit-film/edit-film-basic-info.component';
import { FilmDetailComponent } from './film-detail.component';
import { RouterModule } from '@angular/router';
import { EditFilmComponent } from './edit-film/edit-film.component';
import { FilmsComponent } from './films.component';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { FilmResolver } from './film-resolver.service';

const ROUTES = [
  { path: 'films', component: FilmShellComponent },
  {
    path: 'films/:id',
    component: FilmDetailComponent,
    resolve: { film: FilmResolver }
  },
  {
    path: 'films/:id/edit',
    component: EditFilmComponent,
    resolve: { film: FilmResolver },
    children: [
      {
        path: '', redirectTo: 'info', pathMatch: 'full'
      },
      {
        path: 'info', component: EditFilmBasicInfoComponent
      },
      {
        path: 'acteurs', component: EditFilmActeursComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    FilmsComponent,
    FilmShellComponent,
    FilmShellDetailComponent,
    FilmShellListComponent,
    FilmDetailComponent,
    EditFilmComponent,
    EditFilmBasicInfoComponent,
    EditFilmActeursComponent
  ],
  providers: [FilmParamsService]
})
export class FilmModule { }
```

maintenant qu'on a les deux components il faut qu'on utilise le service pour enregistrer le currentFilm
```typeScript
export class FilmService {

  private filmsUrl = 'api/films';
  private films: Film[];
  currentFilm: Film;
```
Dans le component de list on doit ajouter une fonction si l'utilisateur choisit un film 
```html
<button class="btn btn-outline-primary btn-sm" (click)="changeCurrentFilm(film)">
            {{ film.filmName }}
          </button>
```
```typeScript

  changeCurrentFilm(film: Film){
    this.filmService.currentFilm=film;
  }

```

Dans le component de détail on va utiliser le getter pour mettre à jours le film à l'aide de change detection de Angular
```typeScript
    get film(): Film | null {
        return this.filmService.currentFilm;
    }
```

on va adapter notre service en cas de suppression ou d'ajout
```typeScript
  createFilm(film: Film): Observable<Film> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    film.id = null;
    return this.http.post<Film>(this.filmsUrl, film, { headers })
      .pipe(
        tap(data => console.log('createFilm: ' + JSON.stringify(data))),
        tap(data => {
          this.films.push(data);
          // ici
          this.currentFilm = data;
        }),
        catchError(this.handleError)
      );
  }

  deleteFilm(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.filmsUrl}/${id}`;
    return this.http.delete<Film>(url, { headers })
      .pipe(
        tap(data => console.log('deleteFilm: ' + id)),
        tap(data => {
          this.films.filter(function (f) {
            return f.id !== id;
          });
          // ici
          this.currentFilm = null;
        }
        ),
        catchError(this.handleError)
      );
  }
```
