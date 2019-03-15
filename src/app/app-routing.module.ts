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
