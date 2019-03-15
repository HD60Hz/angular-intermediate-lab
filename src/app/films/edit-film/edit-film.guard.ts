import { Injectable } from '@angular/core';
import { CanDeactivate, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EditFilmComponent } from './edit-film.component';

@Injectable({
  providedIn: 'root'
})
export class EditFilmGuard implements CanDeactivate<EditFilmComponent> {

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

}
