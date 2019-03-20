RxJs
====

# Définition de quelques termes #

Supposant que vous avez trops de callback et dans ces callback vous avez besoin de faire d'autre opération asynchrone, c'est trés pénible à maintenir, à lire et juste à regarder :)
code spaghetti

![alt text](https://media.giphy.com/media/5xrMbCpcgf0nC/giphy.gif)

- programmation reactive : La programation reactive est la programmation avec du data asynchrone d'après Andre Staltz, le créateur de cycle.js
c'est la programmation déclarative au lieu de la programation procédurale pour plus de détail aller sur le lien suivant:

```link 
https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
```
- Stream : flux de données, c'est la base de la programation réactive, tout peut être comme flux un input text, récupération de data, les évenements de souris/claviers, et on peut manipuler ces flux selon le besoin. 

- Rxjs : C'est l'implémentation de ReactiveX, il y a plusieurs d'autre implémentation pour les autres langages.
il est basé sur les observables et sur les événements
```link 
http://reactivex.io/rxjs/manual/overview.html#observer
```
- Observable : C'est une entité qui va émettre des évévenements ou publier des données durant le temps et d'une manière asynchrone 

La définition dans la documentation de RxJS
`Observable represents the idea of an invokable collection of future values or events.`

- Observers :
C'est des entités qui vont écouter ou souscrire pour récupérer les data observés
La définition dans la documentation de RxJS
` Observer is a collection of callbacks that knows how to listen to values delivered by the Observable.`

- Subscriptions :
Des objets retournés quand on souscrit à un Observable

La définition dans la documentation de RxJS
`Subscription represents the execution of an Observable, is primarily useful for cancelling the execution.`

* installation :
```bash
npm install rxjs
```
normalement nous l'avons déjà dans notre projet et il est ajouté par défaut dans le package.json à la création avec Angular/CLI

Hands-On !!!!

Nous allons importer et créer notre Observable avec la manière facile :)


* Importer RxJs 
```typeScript
import { Observable } from 'rxjs';
//--------------------------
export class ATeamComponent{
  public pageTitle = 'Bienvenue';
  imageWidth: number = 100;
  numbers = [0, 3, 7, 5];
  sourceFrom$ = from(this.numbers);

  constructor() {
    this.sourceFrom$.subscribe(
      value => console.log(`value: ${value}`),
      e => console.log(`error: ${e}`),
      () => console.log("complete")
    );
  }
```

C'est juste un tableau, oui dans notre exmple, mais peut être que le tableau va être mis à jour par des webSocket et moi je dois observer ses valeurs pour faire un traitement 

Par convention les observable il faut les postfixer par '$'

A la souscription, on doit déclarer trois fonctions :
* onNext()  : C'est la fonction obligatoir à implémenter lors de la souscription, elle est appelée chaque foit qu'un élément sera émis par l'Observable
```typeScript 
value => console.log(`value: ${value}`),
```
* onComplete()  : appelée quand l'Observable termine avec succès son émission de données
```typeScript 
e => console.log(`error: ${e}`),
```
* onError()  : appelée si une erreur se produit lors de l'émission d'un élément par l'Observable et arrête l'observable
```typeScript 
() => console.log("complete")
```
Maintenant on va voir une autre façon de créer un Observable, avec Observable.create et pour simuler onError() on va  déclencher une erreur si la valeur égale à stalingrade 

```typeScript
  source$ = Observable.create(observer => {
    for (const nbr of this.numbers) {
      if (nbr === 'Stalingrade') { observer.error('Error into the Observable'); }
      observer.next(nbr);
    }
    observer.complete();
  });
```

Vous avez remarqué que l'observable s'est arrêté brusquement sans qu'il execute la fonction onComplete()

Maintenant on va modifier notre code pour utiliser un timer 

```typeScript
 source$ = Observable.create(observer => {
    let index = 0;
    let getValue = () => {
      observer.next(this.numbers[index++]);
      if (index < this.numbers.length) {
        setTimeout(getValue, 400);
      }
      else {
        observer.complete();
      }
    }
    getValue();
  });
```

Si vous avez remaquez même si on a ajouté un timer et on a récupéré les données d'une manière asynchrone nous avons pas modifier notre subscription  

Parmis les points forts de RxJs c'est les opérateurs, Nous allons  pouvoir chainer plusieurs opérations les unes à la suite des autres, filtrer les résultats... .etc
```typeScript
// parfois vscode bug et récupére pas les dépendances map filter .....
  source$ = Observable.create(observer => {
    let index = 0;
    let getValue = () => {
      observer.next(this.numbers[index++]);
      if (index < this.numbers.length) {
        setTimeout(getValue, 400);
      }
      else {
        observer.complete();
      }
    }
    getValue();
  }).pipe(
    map((nbr:number) => nbr * 2),
    filter((nbr:number) => nbr > 6)
  ); 
```

* Async pipe 
c'est un subscribe qui peut être utiliser dans le html, il n'a pas besoin d'être unsubscribe, il le fait automatiquement quand le component est détruit 

Définition depuis la documentation de Angular 
`The async pipe subscribes to an Observable or Promise and returns the latest value it has emitted. When a new value is emitted, the async pipe marks the component to be checked for changes. When the component gets destroyed, the async pipe unsubscribes automatically to avoid potential memory leaks.`

```typeScript

export class ATeamComponent {
  public pageTitle = 'Film disponible dans notre application : ';
  imageWidth = 100;
  numbers = ['Scarface', 'BraveHeart', 'Gladiator', 'Stalingrade'];

  source$ = Observable.create(observer => {
    let index = 0;
    let getValue = () => {
      observer.next(this.numbers[index++]);
      if (index == this.numbers.length) {
        index = 0;
      }
      setTimeout(getValue, 2000);

    }
    getValue();
  });
```
```html
  <div class="card-header">
    {{pageTitle}} {{source$ | async}}
  </div>
```

A chaque subscription il faut ajouter unsubscribe dans le ngDestroy du component



