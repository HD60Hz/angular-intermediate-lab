import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StarComponent } from './star.component';
import { CriteriaComponent } from './criteria/criteria.component';

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
    CriteriaComponent,
    StarComponent,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
