import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit {

  @ViewChild('filterElement') inputFilter: ElementRef;
  @Output() valueModified: EventEmitter<string> = new EventEmitter<string>();
  private _listFilter = '';
  @Input()
  set listFilter(value: string) {
    this._listFilter = value;
    this.valueModified.emit(value);
  }
  get listFilter(): string {
    return this._listFilter;
  }

  constructor() { }

  ngOnInit() { }

}
