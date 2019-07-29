import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, Data } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UsersService } from '../users.service';
import { Department } from '../department.model';
import { Role } from '../role.model';
import { User } from '../user.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.less']
})
export class UserEditComponent implements OnInit {
  id: string;
  editMode: boolean;
  userForm: FormGroup;
  departments: Department[];
  roles: Role[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.id = params['id'];
        this.editMode = this.id ? true : false;

        this.initForm();
      });

    this.departments = this.route.snapshot.data.model.departments;
    this.roles = this.route.snapshot.data.model.roles;
  }

  initForm() {
    let user: User = this.route.snapshot.data.model.user;

    this.userForm = new FormGroup({
      name: new FormControl(user.name, Validators.required),
      lastName: new FormControl(user.lastName, Validators.required),
      birthday: new FormControl(user.birthday),
      departmentId: new FormControl(user.departmentId, Validators.required),
      roleId: new FormControl(user.roleId, Validators.required),
      email: new FormControl(user.email, [Validators.required, Validators.email]),
      username: new FormControl(user.username, Validators.required),
      qrCode: new FormControl(user.qrCode, Validators.required),
      password: new FormControl(user.password, user.id ? null : Validators.required),
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    if (this.editMode) {
      this.usersService.updateUser(this.id, this.userForm.value)
        .subscribe((data: Data) => {
          this.router.navigate(['/users']);
        });

      return;
    }

    this.usersService.createUser(this.userForm.value)
      .subscribe((data: Data) => {
        this.router.navigate(['/users']);
      });
  }

  onCancel() {
    this.router.navigate(['/users']);
  }
}
