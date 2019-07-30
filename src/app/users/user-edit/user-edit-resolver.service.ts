import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../user.model';
import { UsersService } from '../users.service';
import { Department } from '../department.model';
import { Role } from '../role.model';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataHelperService } from 'src/app/_services/data.helper.service';

interface UserEditData {
  departments: Department[],
  roles: Role[],
  user: User
}

@Injectable({ providedIn: 'root' })
export class UserEditResolverService implements Resolve<UserEditData> {
  constructor(private userService: UsersService, private dataHelper: DataHelperService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let queries : Observable<any>[] = [
      this.userService.fetchDepartments(),
      this.userService.fetchRoles()
    ];

    if (route.params.id) {
      queries.push(this.userService.fetchById(route.params.id));
    }

    return forkJoin(queries).pipe(
      map(data => {
        let userObject = data[2]
          ? this.dataHelper.createUserFromObject(data[2])
          : new User();

        return {
          departments: <Department[]>data[0],
          roles: <Role[]>data[1],
          user: userObject
        };
      })
    );
  }
}