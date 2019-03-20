import { map, filter } from 'rxjs/operators';
import { Observable, fromEvent, from } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  selector: 'app-a-team',
  templateUrl: './a-team.component.html',
  styleUrls: ['./a-team.component.css']
})
export class ATeamComponent {
  public pageTitle = 'Film disponible dans notre application : ';
  imageWidth = 100;
  numbers = ['Scarface', 'BraveHeart', 'Gladiator', 'Stalingrade'];
  mouseEvent$ = fromEvent(document, 'mousemove');
  sourceFrom$ = from(this.numbers);
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

  constructor() {
    this.sourceFrom$.subscribe(
      value => console.log(value)
    )
    this.mouseEvent$.subscribe(
      value => console.log(value)
    );
  }


}
