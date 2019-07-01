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
  id: number;
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
        this.id = +params['id'];
        this.editMode = (this.id + 1) ? true : false;

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
    this.userForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      birthday: new FormControl(null),
      role: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      status: new FormControl(true, Validators.required),
      username: new FormControl(null, Validators.required),
      qrCode: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    this.usersService.createUser(this.userForm.value)
      .subscribe((data: Data) => {
        console.log('RESPONSE:', data);
      });
  }

  onCancel() {
    this.router.navigate(['/users']);
  }
}
