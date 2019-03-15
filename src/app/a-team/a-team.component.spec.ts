import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ATeamComponent } from './a-team.component';

describe('ATeamComponent', () => {
  let component: ATeamComponent;
  let fixture: ComponentFixture<ATeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ATeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ATeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
