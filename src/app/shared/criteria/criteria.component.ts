import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit {

  @ViewChild('filterElement') inputFilter: ElementRef;

  private _listFilter = '';

  @Input()
  set listFilter(value: string) {
    this._listFilter = value;
  }

  get listFilter(): string {
    return this._listFilter;
  }

  constructor() { }

  ngOnInit() {}

}
