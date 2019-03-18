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
Et voilà notre filtre re marche de nouveau 



