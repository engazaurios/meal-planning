import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, Data } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Department } from '../department.model';
import { Role } from '../role.model';
import { UsersService } from '../users.service';

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

    this.departments = [
      new Department(1, 'Informatica'),
      new Department(2, 'Recursos Humanos'),
      new Department(3, 'Otro')
    ];

    this.roles = [
      new Role(1, 'Administrador'),
      new Role(2, 'Operario'),
    ];
  }

  initForm() {
    let user = this.editMode ? this.usersService.peekById(this.id) : null;

    if (!user) {
      user = {
        name: null,
        lastName: null,
        birthday: null,
        role: '',
        department: '',
        status: true,
        username: null,
        qrCode: null,
        password: null,
      };
    }

    this.userForm = new FormGroup({
      name: new FormControl(user.name, Validators.required),
      lastName: new FormControl(user.lastName, Validators.required),
      birthday: new FormControl(user.birthday),
      role: new FormControl(user.role, Validators.required),
      department: new FormControl(user.department, Validators.required),
      status: new FormControl(user.status, Validators.required),
      username: new FormControl(user.username, Validators.required),
      qrCode: new FormControl(user.qrCode, Validators.required),
      password: new FormControl(user.password, this.editMode ? null : Validators.required),
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
