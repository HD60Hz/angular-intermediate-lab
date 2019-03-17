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




