import { FilmParamsService } from './film-params.service';
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
  { path: 'films', component: FilmsComponent },
  {
    path: 'films/:id',
    component: FilmDetailComponent,
    resolve: { film: FilmResolver }
  },
  {
    path: 'films/:id/edit',
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
  },
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
  ],
  providers: [FilmParamsService]
})
export class FilmModule { }
