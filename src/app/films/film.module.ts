import { EditFilmGuard } from './edit-film/edit-film.guard';
import { AuthGuard } from './../user/auth.guard';
import { EditFilmActeursComponent } from './edit-film/edit-film-acteurs.component';
import { EditFilmBasicInfoComponent } from './edit-film/edit-film-basic-info.component';
import { FilmDetailComponent } from './film-detail.component';
import { RouterModule } from '@angular/router';
import { EditFilmComponent } from './edit-film/edit-film.component';
import { FilmsComponent } from './films.component';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { FilmResolver } from './film-resolver.service';

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
        canDeactivate: [EditFilmGuard],
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

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    FilmsComponent,
    FilmDetailComponent,
    EditFilmComponent,
    EditFilmBasicInfoComponent,
    EditFilmActeursComponent
  ]
})
export class FilmModule { }
