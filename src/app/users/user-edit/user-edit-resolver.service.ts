import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UsersService } from '../users.service';
import { DepartmentsService } from 'src/app/departments/departments.service';
import { CostCentersService } from 'src/app/cost-centers/cost-centers.service';
import { DataHelperService } from 'src/app/_services/data.helper.service';
import { User } from '../../common/models/user.model';
import { Department } from '../../common/models/department.model';
import { Role } from '../../common/models/role.model';

interface UserEditData {
  departments: Department[],
  roles: Role[],
  user: User
}

@Injectable({ providedIn: 'root' })
export class UserEditResolverService implements Resolve<UserEditData> {
  constructor(
    private userService: UsersService,
    private costCentersService: CostCentersService,
    private departmentsService: DepartmentsService,
    private dataHelper: DataHelperService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let queries : Observable<any>[] = [
      this.departmentsService.fetchAll(),
      this.costCentersService.fetchAll(),
      this.userService.fetchRoles(),
    ];

    if (route.params.id) {
      queries.push(this.userService.fetchById(route.params.id));
    }

    return forkJoin(queries).pipe(
      map(data => {
        let userObject = data[3]
          ? this.dataHelper.createUserFromObject(data[3])
          : new User();

        return {
          departments: <Department[]>data[0],
          costCenters: <Department[]>data[1],
          roles: <Role[]>data[2],
          user: userObject
        };
      })
    );
  }
}