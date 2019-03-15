Angular routing step-01
=======================

- - - - 

# Mettre en place le routage #

    * Définir le base path (Optionnel)
    * Import le router 
    * Configurer la route 
    * Mettre en place dans la template 
    * Activate route
    
## définir le base path ##
`ng build --base-href /ateam/`
## importer Angular Routing ##
```javascript 
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(FilmData, { delay: 1000 }),
    RouterModule.forRoot([]),
  ],...
```


### Ajouter la configuration de routes  ###
Ajouter la configuration de routes dans la déclaration de notre RouterModule
```javascript    
      RouterModule.forRoot([
      { path: 'welcome', component: ATeamComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ]),
```

#### Mettre en place les directives dans les templates ####
Ajouter les directives routerLink dans le app.component.html
```html
    <li class="nav-item">
      <a class="nav-link" [routerLink]="['/welcome']">Accueil</a>
    </li>
    <li class="nav-item">
      <a class="nav-link">Films</a>
    </li>
```
Angular routing step-02
=======================

#### Mettre en place le routage à une fonctionalité ####
Importer le routerModule et configurer la route
```javascript
   @NgModule({
    imports: [
      SharedModule,
      RouterModule.forChild([
      {path: 'films', component: FilmsComponent}
      ])
    ],
    declarations: [
      FilmsComponent,
      EditFilmComponent
    ]
  })
```
Activer le routage 
```html
    <li class="nav-item">
      <a class="nav-link" [routerLink]="['/welcome']">Accueil</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" [routerLink]="['/films']">Films</a>
    </li>
```
####Strategie de nommage de path des routes ####

####Activer une route depuis le code ####

####implémenter les fonctionalité se connecter et se déconnecter ####
Répeter les mêmes étapes que "mettre en place le routage à une fonctionnalité pour ajouter le routage à la page login" dans User.module.ts

injecter le Router dans le constructeur 
```javascript
constructor(private authService: AuthService, private router: Router) { }
```

activer la route depuis le code pour rediriger l'utilsateur vers la page de login 
```javascript
this.router.navigate(['/films']);
```

Maintenant il faut définir le logout, allez dans le app.component.ts et créer le lougout() :
```javascript
  logOut(): void {
    this.authService.logout();
    this.router.navigateByUrl('/welcome');
  }
  ```
Pourquoi définir des routes dans chaque module ?

ordre d'imports est-il intéressant ?


###Mieux organiser le code ###
créer un fichier app-routing.module.ts à côté de app.module.ts avec la déclaration de nos routes 
```javascript
import { PageNotFoundComponent } from './page-not-found.component';
import { ATeamComponent } from './a-team/a-team.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes = [
  { path: 'welcome', component: ATeamComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports : [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```
Remplacer la déclaration de nos routes dans app.module.ts par un simple imports de AppRoutingModule
```javascript
imports: [
    SharedModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(FilmData, { delay: 1000 }),
    AppRoutingModule,
    FilmModule,
    UserModule,
    MessageModule,
    BrowserModule
  ],
```
essayer est-ce que l'application marche toujours  ? 

C'est normal il faut respecter l'ordre pour que les routes fils soient reconnue
```javascript
imports: [
    BrowserModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(FilmData, { delay: 1000 }),
    SharedModule,
    FilmModule,
    UserModule,
    MessageModule,
    AppRoutingModule
  ],
```

Angular routing step-03 routage avec paramétres
===============================================

- - - - 

###Contenu du step ###
 - Required Parameters
 - Optional parameters
 - Query parameters

###Required Parameters ###

Dans le fichier app.module.ts ajouter les routes pour afficher le détail et la modification
Faite attention à la nommenctlature, nous les avons regroupés par 'films' ...

```Javascript 
const ROUTES = [
  { path: 'films', component: FilmsComponent },
  { path: 'films/:id', component: FilmDetailComponent },
  { path: 'films/:id/edit', component: EditFilmComponent },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    FilmsComponent,
    FilmDetailComponent,
    EditFilmComponent
  ]
})
export class FilmModule { }
```
Maintenant on va activer les routes dans le html :

```html
<a [routerLink]="['/films',film.id]">
  {{ film.filmName }}
</a>
.......................
<button class="btn btn-outline-primary btn-sm" [routerLink]="['/films',film.id,'edit']">
  Modifier
</button>
```

Puisque c'est une petite application on se mettre d'accord que l'url de modification avec l'id 0 est pour la création (c'est pas propre je sais :))

```html
<li class="nav-item">
  <a class="nav-link" [routerLink]="['/films/', 0, 'edit']">Ajouter un film</a>
</li>
```

On atterrit sur les pages détail et modification mais on n'a pas encore fait le traitement nécessaire pour aficher le film .

* Manipuler les URLS

Service ActivatedRoute  :
 - Url segments
 - Route parameters
 - Query parameters
 - Resolver data
 - ............

D'abors il faut utiliser le service ActivatedRoute dans le component pour qu'on puisse récupérer l'id du film et le choisir dans le tableau

```javascript
constructor(private route: ActivatedRoute) { }
```

Deux façon de récupérer l'id 

 - Snapshot : Récupérer l'id une seule fois
 ```javascript 
 const id = this.route.snapshot.paramMap.get('id');
 ```
 - Observable : mettre un watch pour observer l'id à chaque changement 
 ```javascript 
this.route.paramMap.subscribe(
  params => {
    const id = params.get('id');
  }
);
 ```

* Approche Snapshot
 

 Dans le component de détail du film On va essayer de mettre un console.log dans le constructeur pour afficher l'id.

 ```javascript : 
    constructor(private filmService: FilmService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Le plus c'est pour le caster en number
    const id = +this.route.snapshot.paramMap.get('id');
    console.log('id du film : ', id);
  }

  ```
Normalement on doit avoir dans la console le film choisit.

On utilise le id comme parametre pour récupérer le film : 


 ```javascript : 
    constructor(private filmService: FilmService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Le + c'est pour le caster en number
    const id = +this.route.snapshot.paramMap.get('id');
     this.getFilm(id);
  }
  ```
rafrachissez la page et bingo ça marche on a le détail du film 

on va implémenter la redirection des bouton retour et modifier dans le détail 

```html 
<button class="btn btn-outline-secondary mr-3" style="width:160px" [routerLink]="['/films']">
  <i class="fa fa-chevron-left"></i> Retour
</button>
<button class="btn btn-outline-primary" style="width:160px" [routerLink]="['/films',film.id,'edit']">
  Modifier
</button>
```

On fait la même chose pour la page de modification
Tester l'ajout de film...
Bien sûr que ça marche aussi ;-) 

* Récupérer l'id avec l'approche observable

remplacer la déclaration avec snapshot par le code suivants  


```javascript
    // TODO UNSUBSCRIBE
    this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getFilm(id);
      }
    );
```
Ajouter la redirection à la fin de l'enregistrement 

```javascript
  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }
    this.router.navigate(['/films']);
    // Navigate back to the film list
  }
```

###Optional parameters####
  on va pas le faire sur l'application mais voilà à quoi ça ressemble :

```html
<a  [routerLink]="['/films', {name: filmName, code: filmCode,
  startDate: availabilityStart, endDate: availabilityEnd}]">
```

Pour la lecture des paramètres optionnel on procéde comme ça : 
```javascript
import { ActivatedRoute } from '@angular/router';
.....
constructor(private route: ActivatedRoute) {
console.log(this.route.snapshot.paramMap.get('name'));
console.log(this.route.snapshot.paramMap.get('code'));
}
```
###Query Parameters###

Pour utiliser les query params on va faire l'excercice en gardant les valeur d'input text de filtre et l'affichage d'image dans les query params 

modifier la redirection vers le détail 

```html
 <a [routerLink]="['/films',film.id]"
      [queryParams]="{filterBy : listFilter, showImage: showImage}"
  >
```

faisant le test on voit que les valeur sont dans l'url qu'on arrive sur le détail mais une fois on appui sur le retour on les perds pour les garder on va modifier le redirection de retour sur le détail :

```html
<button class="btn btn-outline-secondary mr-3" style="width:160px" [routerLink]="['/films']"  queryParamsHandling="preserve">
  <i class="fa fa-chevron-left"></i> Retour
</button>
```
queryParamsHandling prend comme valeur 'preserve', 'merge', etc.

* Accéder aux query params 

Pour utiliser les infos qu'on a gardé dans l'url avec queryParamsHandling, on doit lire les queryParams, allez courage on est presque pour terminer le step :) 

Dans le ngOnInit du component films on va récupérer les valeurs en utilisant le queryParamMap 

```javascript
this._listFilter = this.route.snapshot.queryParamMap.get('filterBy');
this.showImage = JSON.parse(this.route.snapshot.queryParamMap.get('showImage'))
```

Angular routing step-04 Prefetching Data Using Route Resolvers
==============================================================

- - - - 

Les avantages : 
  - éviter d'afficher une page vide avant le chargement de données
  - Réutilisation de code
  - Gestion d'erreur meilleur


###Contenu du step ###

  - Providing Data with a Route
  - Using a Route Resolver
  - Building a Route Resolver Service
  - Adding a Resolver to a Route
  - Configuration
  - Reading Resolver Data - Snapshot
  - Reading Resolver Data - Observable

###Building a Route Resolver Service###

On va commencer par créer un film resolver pour récupérer le film avant l'affichage du film

"film-resolver.service.ts"
```javascript
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FilmResolved } from './film';
import { FilmService } from './film.service';
@Injectable({
  providedIn: 'root'
})
export class FilmResolver implements Resolve<FilmResolved> {
  constructor(private filmService: FilmService) { }
  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<FilmResolved> {
    const id = route.paramMap.get('id');
    if (isNaN(+id)) {
      const message = `id du film c'est pas un id valid : ${id}`;
      console.error(message);
      return of({ film: null, error: message });
    }

    return this.filmService.getFilm(+id)
      .pipe(
        map(film => ({ film: film })),
        catchError(error => {
          const message = `error: ${error}`;
          console.error(message);
          return of({ film: null, error: message });
        })
      );
  }

}
```

###Adding a Resolver to a Route###

On modifie le routage pour utiliser le resolver qu'on a crée 

```javascript
const ROUTES = [
  { path: 'films', component: FilmsComponent },
  {
    path: 'films/:id',
    component: FilmDetailComponent,
    resolve: { ResolvedData: FilmResolver }
  },
  {
    path: 'films/:id/edit',
    component: EditFilmComponent,
    resolve: {ResolvedData: FilmResolver}
  },
];
```

###Reading resolver data: snapshot ###

  Dans les fichiers film-detail.component.ts et edit-film.component.ts changez la façon dont on récupére le film : 

```javascript
  constructor(private filmService: FilmService, private route: ActivatedRoute) {
    const filmResolved: FilmResolved = this.route.snapshot.data['film'];
    this.errorMessage = filmResolved.error;
    this.onFilmRetrieved(filmResolved.film);
  }

  ngOnInit(): void {}
```

testez...

Essayez de tester avec un id qui n'existe pas, vous allez voir notre message d'erreur initialisé par le resolver

Tous les components partage la même référence d'objet "film" et vous avez remarquez qu'il n'y a plus de chargement partiel (y) enjoy-it :)

Il y a un problème, vous l'avez vu, non ? si on appui sur ajouter un film la méthode onInit ne va pas s'excuter une deuxième fois qu'on est déjà sur la page edit film

alors pour remédier à ce problème on va utiliser les observables :


Angular routing step-05 child route
===============================================

- - - - 

Parmis les cas d'utilisation de child step on trouve :
  - Tabbed pages
  - Master/detail layouts
  - Embedded templates
  - Feature modules
  - Lazy loading

###Contenu du step ###
  - Using Child Routes
  - Configuring Child Routes
  - Placing the Child View
  - Activating Child Routes
  - Obtaining Data for Child Routes
  - Validating Across Child Routes

###Configuring Child Routes ###

On commence par configurer les routes dans le films.module.ts

```javascript
const ROUTES = [
  { path: 'films', component: FilmsComponent },
  { path: 'films/:id', component: FilmDetailComponent },
  {
    path: 'films/:id/edit',
    component: EditFilmComponent,
    children: [
      {
        path: '', redirectTo: 'info', pathMatch: 'full'
      },
      {
        path: 'info', component: FilmEditBasicInfoComponent
      },
      {
        path: 'acteurs', component: FilmEditActeursComponent
      }
    ]
  },
];

.................

declarations: [
    FilmsComponent,
    FilmDetailComponent,
    EditFilmComponent,
    FilmEditBasicInfoComponent,
    FilmEditActeursComponent
  ]

```

###Placing the Child View ###

Modifier le html de modification pour avoir deux tabs infos et acteurs 

```html
<div class="card-body">
  <div class="wizard">
      <a [routerLink]="['info']">
        infos
      </a>
      <a [routerLink]="['acteurs']">
        acteurs
      </a>
  </div>
<router-outlet></router-outlet>
</div>
```

###Activating Child Routes ###
Il existe deux façon d'activer les routes :

modifier les url dans les tabs de la page modification de film 
  - Absolute path : 
```html 
    <a [routerLink]="['/films', film.id, 'edit', 'info']">Info</a> 
```
  - Relative path
```html 
    <a [routerLink]="['info']">Info</a> 
```
le html de edit film il va ressembler à ça 
```html
<div class="card-body">
    <div class="wizard">
      <a [routerLink]="['info']">
        infos
      </a>
      <a [routerLink]="['acteurs']">
        acteurs
      </a>
    </div>
    <router-outlet></router-outlet>
    <div class="col-md-12">
      <button class="btn btn-primary mr-3" style="width:120px" type="button"
        [title]="'Enregistrer vos données'"
        (click)="saveFilm()">
        Enregistrer
      </button>
      <button class="btn btn-outline-secondary mr-3" style="width:100px" type="button"
        title="Annuler les modifications">
        Annuler
      </button>
      <button class="btn btn-outline-warning" style="width:100px" type="button" title="Supprimer ce film"
        (click)="deleteFilm()">
        Supprimer
      </button>
    </div>
  </div>
```
###Obtaining Data for a Child Route ###

Maintenat on essayer de récupérer le vrai objet film: il y a moyens :

  - Film Data Service
```javascript 
this.filmService.getFilm(id)
.subscribe(film => this.film = film);
```
  - Child Route Resolver : Récuperer le film avant de charger le child route 
```javascript 
this.film = this.route.snapshot.data['film'];
```
  - Parent Route Resolver: le component parent utilise le même objet film 
```javascript 
this.film = this.route.parent.snapshot.data['film'];
```

Pour commencer on va modifier le EditFilmBasicInfoComponent pour récupérer l'objet film 

```javascript
  ngOnInit(): void {
    this.route.parent.data.subscribe(data => {
      const filmResolved: FilmResolved = data['film'];
      this.errorMessage = filmResolved.error;
      this.film = filmResolved.film;
    });
  }

```
Faites la même chose pour l'onglet acteurs

Nous avons pas encore finit, la validation des champs n'est pas bien fait surtout si on passe de la modification à la création on a toujours les erreurs de modification affiché 

On va utiliser le filmForm pour initialiser l'objet chaque fois qu'on a un nouveau objet film 
```javascript
  ngOnInit(): void {
    // TODO UNSUBSCRIBE
    this.route.parent.data.subscribe(data => {
      ////////////////////////////////
      if (this.filmForm){
        this.filmForm.reset();
      }
      ////////////////////////////////
      const filmResolved: FilmResolved = data['film'];
      this.errorMessage = filmResolved.error;
      this.film = filmResolved.film;
    });
  }

```

Maintenant on va essayer d'enregistrer sans saisir le code de film, Oups, ça a passé, on devrait désactiver si le formulaire n'est pas vide, oui je sais les boutons sont dans l'élement parent. 

Pour cela on va ajouter des fonctions de validation dans le component edit-film.component.ts

```javascript

  isValid(path?: string): boolean {
    this.validate();

    // dans le cas où on veut faire la validation seulement pour un onglet 
    if (path) {
      return this.dataIsValid[path];
    }
    //Dans le cas où il y a +++ tabs
    return this.dataIsValid && Object.keys(this.dataIsValid).every(d => this.dataIsValid[d] === true);
  }

  validate(): void {
    this.dataIsValid = {};

    // tabs info
    if (this.film.filmName && this.film.filmCode && this.film.filmCode.length != 4) {
      this.dataIsValid['info'] = true;
    } else {
      this.dataIsValid['info'] = false;
    }
    // tabs acteurs
    if (this.film.acteurs && this.film.acteurs.length > 0) {
      this.dataIsValid['acteurs'] = true;
    } else {
      this.dataIsValid['acteurs'] = false;
    }
  }
```
et dans le html on va désactiver le bouton tant que le form n'est pas valid 

```html
<button class="btn btn-primary mr-3" style="width:120px" type="button"
  [title]="'Enregistrer vos données'"
  [disabled]="!isValid()"
  (click)="saveFilm()">
  Enregistrer
</button>
```      








Angular routing step-01
=======================

# Programme #
Routing Basics
Routing to Features
Route Parameters
Prefetching Data Using Route Resolvers
Child Routes
Route Guards

# Prérequis #

Connaissances :
* JavaScript
* HTML
* CSS
* Angular: Component, Service, module

Outils :
* VSCode : 
https://code.visualstudio.com/ 
* Node Package Manager : 
  https://nodejs.org/fr/download/
* npm : 
 ```bash 
        npm install -g npm@latest
 ```
* ANGULAR/CLI: 
```bash 
        npm install -g @angular/cli 
```
* Récupérer le projet lab02
```bash
git clone https://gitlab.boost.open.global/open/squads/squad-new-dev/multi-skilling/angular/lab02.git
cd lab02
git fetch --all
git checkout routing/step-00
```
# Mettre en place le routage #
  
### définir le base path ###

```bash 
ng build --base-href /ateam/
```
### importer Angular Routing ###
```javascript 
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(FilmData, { delay: 1000 }),
    RouterModule.forRoot([
      { path: 'welcome', component: ATeamComponent },
      { path: 'home', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ]),
  ],...
```

### Mettre en place les directives dans les templates ###
Ajouter la directive pour afficher la page de la route 
app.component.html
```html
<div class="container">
  <router-outlet></router-outlet>
</div>
```


Ajouter les directives routerLink dans le app.component.html
```html
    <li class="nav-item">
      <a class="nav-link" [routerLink]="['/welcome']">Accueil</a>
    </li>
    <li class="nav-item">
      <a class="nav-link">Films</a>
    </li>
```

Angular routing step-02
=======================

#### Mettre en place le routage à une fonctionalité ####
Importer le routerModule et configurer la route
```javascript
   @NgModule({
    imports: [
      SharedModule,
      RouterModule.forChild([
      {path: 'films', component: FilmsComponent}
      ])
    ],
    declarations: [
      FilmsComponent,
      EditFilmComponent
    ]
  })
```
Activer le routage 
```html
    <li class="nav-item">
      <a class="nav-link" [routerLink]="['/welcome']">Accueil</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" [routerLink]="['/films']">Films</a>
    </li>
```

### Html5 style url vs hash-based url ###

HTML 5 Style (…/welcome)
Hash-based (…/#/welcome)

Par défaut Angular utilise le style des urls de html5 pour le changer il faut le ajouter RouterModule.forRoot([...], { useHash: true }) dans le 'app.module.ts'

### Strategie de nommage de path des routes ###
Vu qu'on est des développeur l'approche la plus spontanné qu'on va avoir c'est ça :

La liste des films : films
Consulter le détail du film : film/:id
Modifier les information d'un film : filmEdit/:id

Ce n'est pas la bonne approche à suivre il faut penser à regrouper par 'films' pour faciliter le traitement après 

La liste des films : films
Consulter le détail du film : films/:id
Modifier les information d'un film : films/:id/edit

### implémenter les fonctionalité se connecter et se déconnecter ###
Répeter les mêmes étapes que "mettre en place le routage à une fonctionnalité" pour ajouter le routage à la page login dans User.module.ts

injecter le Router dans le constructeur 
```javascript
constructor(private authService: AuthService, private router: Router) { }
```

activer la route depuis le code pour rediriger l'utilsateur vers la page de login 
```javascript
this.router.navigate(['/films']);
```

Maintenant il faut définir le logout, allez dans le app.component.ts et créer le lougout() :
```javascript
  logOut(): void {
    this.authService.logout();
    this.router.navigateByUrl('/welcome');
  }
  ```
Pourquoi définir des routes dans chaque module ?

ordre d'imports est-il intéressant ?


###Mieux organiser le code ###
créer un fichier app-routing.module.ts à côté de app.module.ts avec la déclaration de nos routes 
```javascript
import { PageNotFoundComponent } from './page-not-found.component';
import { ATeamComponent } from './a-team/a-team.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes = [
  { path: 'welcome', component: ATeamComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports : [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```
Remplacer la déclaration de nos routes dans app.module.ts par un simple imports de AppRoutingModule
```javascript
imports: [
    SharedModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(FilmData, { delay: 1000 }),
    AppRoutingModule,
    FilmModule,
    UserModule,
    MessageModule,
    BrowserModule
  ],
```
essayer est-ce que l'application marche toujours  ? 

C'est normal il faut respecter l'ordre pour que les routes fils soient reconnue
```javascript
imports: [
    BrowserModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(FilmData, { delay: 1000 }),
    SharedModule,
    FilmModule,
    UserModule,
    MessageModule,
    AppRoutingModule
  ],
```

Angular routing step-03 routage avec paramétres
===============================================

- - - - 

###Contenu du step ###
 - Required Parameters
 - Optional parameters
 - Query parameters

###Required Parameters ###

Dans le fichier app.module.ts ajouter les routes pour afficher le détail et la modification
Faite attention à la nommenctlature, nous les avons regroupés par 'films' ...

```Javascript 
const ROUTES = [
  { path: 'films', component: FilmsComponent },
  { path: 'films/:id', component: FilmDetailComponent },
  { path: 'films/:id/edit', component: EditFilmComponent },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    FilmsComponent,
    FilmDetailComponent,
    EditFilmComponent
  ]
})
export class FilmModule { }
```
Maintenant on va activer les routes dans le html :

```html
<a [routerLink]="['/films',film.id]">
  {{ film.filmName }}
</a>
.......................
<button class="btn btn-outline-primary btn-sm" [routerLink]="['/films',film.id,'edit']">
  Modifier
</button>
```

Puisque c'est une petite application on se mettre d'accord que l'url de modification avec l'id 0 est pour la création (c'est pas propre je sais :))

```html
<li class="nav-item">
  <a class="nav-link" [routerLink]="['/films/', 0, 'edit']">Ajouter un film</a>
</li>
```

On atterrit sur les pages détail et modification mais on n'a pas encore fait le traitement nécessaire pour aficher le film .

* Manipuler les URLS

Service ActivatedRoute  :
 - Url segments
 - Route parameters
 - Query parameters
 - Resolver data
 - ............

D'abors il faut utiliser le service ActivatedRoute dans le component pour qu'on puisse récupérer l'id du film et le choisir dans le tableau

```javascript
constructor(private route: ActivatedRoute) { }
```

Deux façon de récupérer l'id 

 - Snapshot : Récupérer l'id une seule fois
 ```javascript 
 const id = this.route.snapshot.paramMap.get('id');
 ```
 - Observable : mettre un watch pour observer l'id à chaque changement 
 ```javascript 
this.route.paramMap.subscribe(
  params => {
    const id = params.get('id');
  }
);
 ```

* Approche Snapshot
 

 Dans le component de détail du film On va essayer de mettre un console.log dans le constructeur pour afficher l'id.

 ```javascript : 
    constructor(private filmService: FilmService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Le plus c'est pour le caster en number
    const id = +this.route.snapshot.paramMap.get('id');
    console.log('id du film : ', id);
  }

  ```
Normalement on doit avoir dans la console le film choisit.

On utilise le id comme parametre pour récupérer le film : 


 ```javascript : 
    constructor(private filmService: FilmService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Le + c'est pour le caster en number
    const id = +this.route.snapshot.paramMap.get('id');
     this.getFilm(id);
  }
  ```
rafrachissez la page et bingo ça marche on a le détail du film 

on va implémenter la redirection des bouton retour et modifier dans le détail 

```html 
<button class="btn btn-outline-secondary mr-3" style="width:160px" [routerLink]="['/films']">
  <i class="fa fa-chevron-left"></i> Retour
</button>
<button class="btn btn-outline-primary" style="width:160px" [routerLink]="['/films',film.id,'edit']">
  Modifier
</button>
```

On fait la même chose pour la page de modification
Tester l'ajout de film...
Bien sûr que ça marche aussi ;-) 

* Récupérer l'id avec l'approche observable

remplacer la déclaration avec snapshot par le code suivants  


```javascript
    // TODO UNSUBSCRIBE
    this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getFilm(id);
      }
    );
```
Ajouter la redirection à la fin de l'enregistrement 

```javascript
  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }
    this.router.navigate(['/films']);
    // Navigate back to the film list
  }
```

###Optional parameters####
  on va pas le faire sur l'application mais voilà à quoi ça ressemble :

```html
<a  [routerLink]="['/films', {name: filmName, code: filmCode,
  startDate: availabilityStart, endDate: availabilityEnd}]">
```

Pour la lecture des paramètres optionnel on procéde comme ça : 
```javascript
import { ActivatedRoute } from '@angular/router';
.....
constructor(private route: ActivatedRoute) {
console.log(this.route.snapshot.paramMap.get('name'));
console.log(this.route.snapshot.paramMap.get('code'));
}
```
###Query Parameters###

Pour utiliser les query params on va faire l'excercice en gardant les valeur d'input text de filtre et l'affichage d'image dans les query params 

modifier la redirection vers le détail 

```html
 <a [routerLink]="['/films',film.id]"
      [queryParams]="{filterBy : listFilter, showImage: showImage}"
  >
```

faisant le test on voit que les valeur sont dans l'url qu'on arrive sur le détail mais une fois on appui sur le retour on les perds pour les garder on va modifier le redirection de retour sur le détail :

```html
<button class="btn btn-outline-secondary mr-3" style="width:160px" [routerLink]="['/films']"  queryParamsHandling="preserve">
  <i class="fa fa-chevron-left"></i> Retour
</button>
```
queryParamsHandling prend comme valeur 'preserve', 'merge', etc.

* Accéder aux query params 

Pour utiliser les infos qu'on a gardé dans l'url avec queryParamsHandling, on doit lire les queryParams, allez courage on est presque pour terminer le step :) 

Dans le ngOnInit du component films on va récupérer les valeurs en utilisant le queryParamMap 

```javascript
this._listFilter = this.route.snapshot.queryParamMap.get('filterBy');
this.showImage = JSON.parse(this.route.snapshot.queryParamMap.get('showImage'))
```

Angular routing step-04 Prefetching Data Using Route Resolvers
==============================================================

- - - - 

Les avantages : 
  - éviter d'afficher une page vide avant le chargement de données
  - Réutilisation de code
  - Gestion d'erreur meilleur


###Contenu du step ###

  - Providing Data with a Route
  - Using a Route Resolver
  - Building a Route Resolver Service
  - Adding a Resolver to a Route
  - Configuration
  - Reading Resolver Data - Snapshot
  - Reading Resolver Data - Observable

###Building a Route Resolver Service###

On va commencer par créer un film resolver pour récupérer le film avant l'affichage du film

"film-resolver.service.ts"
```javascript
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FilmResolved } from './film';
import { FilmService } from './film.service';
@Injectable({
  providedIn: 'root'
})
export class FilmResolver implements Resolve<FilmResolved> {
  constructor(private filmService: FilmService) { }
  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<FilmResolved> {
    const id = route.paramMap.get('id');
    if (isNaN(+id)) {
      const message = `id du film c'est pas un id valid : ${id}`;
      console.error(message);
      return of({ film: null, error: message });
    }

    return this.filmService.getFilm(+id)
      .pipe(
        map(film => ({ film: film })),
        catchError(error => {
          const message = `error: ${error}`;
          console.error(message);
          return of({ film: null, error: message });
        })
      );
  }

}
```

###Adding a Resolver to a Route###

On modifie le routage pour utiliser le resolver qu'on a crée 

```javascript
const ROUTES = [
  { path: 'films', component: FilmsComponent },
  {
    path: 'films/:id',
    component: FilmDetailComponent,
    resolve: { ResolvedData: FilmResolver }
  },
  {
    path: 'films/:id/edit',
    component: EditFilmComponent,
    resolve: {ResolvedData: FilmResolver}
  },
];
```

###Reading resolver data: snapshot ###

  Dans les fichiers film-detail.component.ts et edit-film.component.ts changez la façon dont on récupére le film : 

```javascript
  constructor(private filmService: FilmService, private route: ActivatedRoute) {
    const filmResolved: FilmResolved = this.route.snapshot.data['film'];
    this.errorMessage = filmResolved.error;
    this.onFilmRetrieved(filmResolved.film);
  }

  ngOnInit(): void {}
```

testez...

Essayez de tester avec un id qui n'existe pas, vous allez voir notre message d'erreur initialisé par le resolver

Tous les components partage la même référence d'objet "film" et vous avez remarquez qu'il n'y a plus de chargement partiel (y) enjoy-it :)

Il y a un problème, vous l'avez vu, non ? si on appui sur ajouter un film la méthode onInit ne va pas s'excuter une deuxième fois qu'on est déjà sur la page edit film

alors pour remédier à ce problème on va utiliser les observables :


Angular routing step-05 child route
===============================================

- - - - 

Parmis les cas d'utilisation de child step on trouve :
  - Tabbed pages
  - Master/detail layouts
  - Embedded templates
  - Feature modules
  - Lazy loading

###Contenu du step ###
  - Using Child Routes
  - Configuring Child Routes
  - Placing the Child View
  - Activating Child Routes
  - Obtaining Data for Child Routes
  - Validating Across Child Routes

###Configuring Child Routes ###

On commence par configurer les routes dans le films.module.ts

```javascript
const ROUTES = [
  { path: 'films', component: FilmsComponent },
  { path: 'films/:id', component: FilmDetailComponent },
  {
    path: 'films/:id/edit',
    component: EditFilmComponent,
    children: [
      {
        path: '', redirectTo: 'info', pathMatch: 'full'
      },
      {
        path: 'info', component: FilmEditBasicInfoComponent
      },
      {
        path: 'acteurs', component: FilmEditActeursComponent
      }
    ]
  },
];

.................

declarations: [
    FilmsComponent,
    FilmDetailComponent,
    EditFilmComponent,
    FilmEditBasicInfoComponent,
    FilmEditActeursComponent
  ]

```

###Placing the Child View ###

Modifier le html de modification pour avoir deux tabs infos et acteurs 

```html
<div class="card-body">
  <div class="wizard">
      <a [routerLink]="['info']">
        infos
      </a>
      <a [routerLink]="['acteurs']">
        acteurs
      </a>
  </div>
<router-outlet></router-outlet>
</div>
```

###Activating Child Routes ###
Il existe deux façon d'activer les routes :

modifier les url dans les tabs de la page modification de film 
  - Absolute path : 
```html 
    <a [routerLink]="['/films', film.id, 'edit', 'info']">Info</a> 
```
  - Relative path
```html 
    <a [routerLink]="['info']">Info</a> 
```
le html de edit film il va ressembler à ça 
```html
<div class="card-body">
    <div class="wizard">
      <a [routerLink]="['info']">
        infos
      </a>
      <a [routerLink]="['acteurs']">
        acteurs
      </a>
    </div>
    <router-outlet></router-outlet>
    <div class="col-md-12">
      <button class="btn btn-primary mr-3" style="width:120px" type="button"
        [title]="'Enregistrer vos données'"
        (click)="saveFilm()">
        Enregistrer
      </button>
      <button class="btn btn-outline-secondary mr-3" style="width:100px" type="button"
        title="Annuler les modifications">
        Annuler
      </button>
      <button class="btn btn-outline-warning" style="width:100px" type="button" title="Supprimer ce film"
        (click)="deleteFilm()">
        Supprimer
      </button>
    </div>
  </div>
```
###Obtaining Data for a Child Route ###

Maintenat on essayer de récupérer le vrai objet film: il y a moyens :

  - Film Data Service
```javascript 
this.filmService.getFilm(id)
.subscribe(film => this.film = film);
```
  - Child Route Resolver : Récuperer le film avant de charger le child route 
```javascript 
this.film = this.route.snapshot.data['film'];
```
  - Parent Route Resolver: le component parent utilise le même objet film 
```javascript 
this.film = this.route.parent.snapshot.data['film'];
```

Pour commencer on va modifier le EditFilmBasicInfoComponent pour récupérer l'objet film 

```javascript
  ngOnInit(): void {
    this.route.parent.data.subscribe(data => {
      const filmResolved: FilmResolved = data['film'];
      this.errorMessage = filmResolved.error;
      this.film = filmResolved.film;
    });
  }

```
Faites la même chose pour l'onglet acteurs

Nous avons pas encore finit, la validation des champs n'est pas bien fait surtout si on passe de la modification à la création on a toujours les erreurs de modification affiché 

On va utiliser le filmForm pour initialiser l'objet chaque fois qu'on a un nouveau objet film 
```javascript
  ngOnInit(): void {
    // TODO UNSUBSCRIBE
    this.route.parent.data.subscribe(data => {
      ////////////////////////////////
      if (this.filmForm){
        this.filmForm.reset();
      }
      ////////////////////////////////
      const filmResolved: FilmResolved = data['film'];
      this.errorMessage = filmResolved.error;
      this.film = filmResolved.film;
    });
  }

```

Maintenant on va essayer d'enregistrer sans saisir le code de film, Oups, ça a passé, on devrait désactiver si le formulaire n'est pas vide, oui je sais les boutons sont dans l'élement parent. 

Pour cela on va ajouter des fonctions de validation dans le component edit-film.component.ts

```javascript

  isValid(path?: string): boolean {
    this.validate();

    // dans le cas où on veut faire la validation seulement pour un onglet 
    if (path) {
      return this.dataIsValid[path];
    }
    //Dans le cas où il y a +++ tabs
    return this.dataIsValid && Object.keys(this.dataIsValid).every(d => this.dataIsValid[d] === true);
  }

  validate(): void {
    this.dataIsValid = {};

    // tabs info
    if (this.film.filmName && this.film.filmCode && this.film.filmCode.length != 4) {
      this.dataIsValid['info'] = true;
    } else {
      this.dataIsValid['info'] = false;
    }
    // tabs acteurs
    if (this.film.acteurs && this.film.acteurs.length > 0) {
      this.dataIsValid['acteurs'] = true;
    } else {
      this.dataIsValid['acteurs'] = false;
    }
  }
```
et dans le html on va désactiver le bouton tant que le form n'est pas valid 

```html
<button class="btn btn-primary mr-3" style="width:120px" type="button"
  [title]="'Enregistrer vos données'"
  [disabled]="!isValid()"
  (click)="saveFilm()">
  Enregistrer
</button>
```      

Angular routing step-06 Guards 
==============================

Depuis qu'on a commencé développé l'application vous vous posez la question quand on va ajouter la vérification de l'authentification, bah c'est maintenant ou jamais :-) 

# Contenu du step #

  - Using Route Guards
  - canActivate Guard
  - Sharing Data with a Guard
  - canActivateChild Guard
  - canDeactivate Guard

Protéger les routes avec les Guards 

  - canActivate : protége la route lors de la navigation 

  - canActivateChild : protége child route lors de la navigation 

  - canDeactivate : appelée quand on essaye de quitter la route 

  - canLoad : Protéger un async route 

  - resolve : Prefetch data avant d'activer la route 

le workflow de guerds est le suivant  :
* canDeactivate : vérifier avant de quitter la route 
  * canLoad : vérifier est-ce qu'il a le droit de charger les données 
    * canActivateChild : vérifier la route fille 
      * canActivate : vérifier la route mère 
        * resolve : charger les données après avoir être sûr de tout ce qu'on a checké ;-)

# Créer un Guard service #

Nous allons utilisé le angular cli pour générer un Guard, lancer la commande :
```bash
ng g g user/auth
```
Ensuite on va vérifer que l'utilisateur est connecté à l'aide de notre service auth.service.ts pour le laisser passer à /films sinon une redirection à la page login 

```javascript
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkIfUserisLogged();
  }

  checkIfUserisLogged(): boolean {
    if (this.authService.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
```
Nous allons faire une petite modification sur les routes pour les regrouper avec '/films' en utilisan children pour nous faciliter la vérification avec Guard 

```javascript
const ROUTES = [
  {
    path: 'films',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: FilmsComponent
      },
      {
        path: ':id',
        component: FilmDetailComponent,
        resolve: { film: FilmResolver }
      },
      {
        path: ':id/edit',
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
      }
    ]
  }
];
```
Faisant un petit test, aha, on peut plus aller se balader dans l'application sans être connecté :) 

Mais il y a un petit soucis, après authentification je suis redirigé vers la page de films alors que je voulais ajouter un film

Je suis d'accord, parce que nous avons fait la redirection en dure aprés l'authentification

pour remédier à ça on a besoin de partager l'url destionation avec les guards

pour faire cela on a le resolver et les services 

  - resolver c'est mort parce qu'il est appelé après les guards

  - service : c'est possible puisque c'est un singleton 

```javascript
// service 
export class AuthService {
  currentUser: User;
  ////////////////////////
  urlDestination: string;
  ////////////////////////  

  ..................

  // login component
  
  login(loginForm: NgForm) {
    if (loginForm && loginForm.valid) {
      const userName = loginForm.form.value.userName;
      const password = loginForm.form.value.password;
      this.authService.login(userName, password);
      console.log(this.authService.urlDestination);
      ////////////////////////////////////////////////////////////////////////////////////  
      this.router.navigate([this.authService.urlDestination || '/films' ]);
      ////////////////////////////////////////////////////////////////////////////////////  
    } else {
      this.errorMessage = 'Please enter a user name and password.';
    }
  }

  // Auth guard

    checkIfUserisLogged(url: string): boolean {
    if (this.authService.isLoggedIn) {
      return true;
    } else {
      //////////////////////////////////////////
      this.authService.urlDestination = url;
      //////////////////////////////////////////
      this.router.navigate(['login']);
      return false;
    }
  }

```

canActivated : ne va faire aucune vérification si on change que le child route, c'est pourquoi on a besoin de CanActivatedChild 

CanActivatedChild fonctionne comme le canAcivated

canDeactivete Guard : 
  - vérifier s'il utilisateur a tout sauvegardé avant de quitter

On va générer un nouveau guard :

```bash
ng g g films/edit-film/edit-film
```

Change l'implémentation

```javascript
////EditFilmGuard
  canDeactivate(component: EditFilmComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if(component.isDirty){
      const filmName = component.film.filmName || "Nouveau film";
      return confirm(`Vous êtes sûr de quitter, vous avez des modification non enregistré pour le film  ${filmName} ? `);
    }
    return true;
  } 

  /// vérification sur le component que l'objet film n'a pas été changé 
  private originalFilm: Film;
  private currentFilm: Film;
  private dataIsValid: { [key: string]: boolean } = {};

  get isDirty(): boolean {
    return JSON.stringify(this.originalFilm) !==
      JSON.stringify(this.currentFilm);
  }

// fonction appelé quand on fait réf à "this.film"
  get film(): Film {
    return this.currentFilm;
  }
//// fonction appelé quand on fait réf à "this.film = "
  set film(value: Film) {
    this.currentFilm = value;
    this.originalFilm = { ...value };
  }
.............

  // 
```


