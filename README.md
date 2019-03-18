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

