import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router, Data } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { UsersService } from '../users.service';
import { FileUploaderService } from 'src/app/file-uploader.service';
import { User } from '../../common/models/user.model';
import { Role } from '../../common/models/role.model';
import { Department } from '../../common/models/department.model';
import { CostCenter } from '../../common/models/cost-center.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.less']
})
export class UserEditComponent implements OnInit {
  id: string;
  editMode: boolean;
  userEntity: User;
  userForm: FormGroup;
  departments: Department[];
  costCenters: CostCenter[];
  roles: Role[];

  profilePictureFile: File;
  profilePicturePreview: any;

  @ViewChild('imageInput', { static: false }) profilePictureFileInput: ElementRef;
  @ViewChild('imageLabel', { static: false }) profilePictureFileLabel: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private fileUploader: FileUploaderService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.id = params['id'];
        this.editMode = this.id ? true : false;

        this.initForm();
      });

    this.departments = this.route.snapshot.data.model.departments;
    this.costCenters = this.route.snapshot.data.model.costCenters;
    this.roles = this.route.snapshot.data.model.roles;

    this.profilePictureFile = null;
  }

  initForm() {
    this.userEntity = this.route.snapshot.data.model.user;

    this.userForm = new FormGroup({
      name: new FormControl(this.userEntity.name, Validators.required),
      lastName: new FormControl(this.userEntity.lastName, Validators.required),
      birthdayNgbDate: new FormControl(this.userEntity.birthdayNgbDate),
      departmentId: new FormControl(this.userEntity.departmentId, Validators.required),
      costCenterId: new FormControl(this.userEntity.costCenterId, Validators.required),
      roleId: new FormControl(this.userEntity.roleId, Validators.required),
      email: new FormControl(this.userEntity.email, [Validators.required, Validators.email]),
      username: new FormControl(this.userEntity.username, Validators.required),
      qrCode: new FormControl(this.userEntity.qrCode, Validators.required),
      password: new FormControl(this.userEntity.password, this.userEntity.id ? null : Validators.required),
      photo: new FormControl(this.userEntity.photo),
    });
  }

  handleSubmitError(serverError: HttpErrorResponse) {
    const error = serverError.error && serverError.error.error;

    if (!error || (error.name !== 'ValidationError')) {
      return;
    }

    let errorCodes: Object = error.details.codes;

    Object.keys(errorCodes).forEach((attrKey: string) => {
      if (attrKey === 'context') {
        return;
      }

      if (errorCodes[attrKey].includes('uniqueness')) {
        if (this.userForm.value.hasOwnProperty(attrKey)) {
          this.userForm.controls[attrKey].markAsTouched();
          this.userForm.controls[attrKey].setErrors({
            alreadyExists: true
          });
        }
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    if (this.userForm.value.birthdayNgbDate) {
      let ngbDate: NgbDate = this.userForm.value.birthdayNgbDate;
      this.userForm.value.birthday = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);

      delete this.userForm.value['birthdayNgbDate'];
    }

    if (this.editMode) {
      return this.usersService.updateUser(this.id, this.userForm.value)
        .subscribe(
          () => this.router.navigate(['/users']),
          this.handleSubmitError.bind(this)
        );
    }

    return this.usersService.createUser(this.userForm.value)
      .subscribe(
        () => this.router.navigate(['/users']),
        this.handleSubmitError.bind(this)
      );
  }

  profilePictureSelected(fileInput: any) {
    if (!fileInput.target.files.length) {
      this.profilePictureFile = null;
      this.profilePictureFileInput.nativeElement.value = null;
      this.profilePictureFileLabel.nativeElement.innerText = 'Seleccionar archivo';

      return;
    }

    if (fileInput.target.files[0].type.match(/image\/*/) == null) {
      this.notifier.notify('error', 'Archivo inválido.');
      this.profilePictureFileInput.nativeElement.value = null;
      this.profilePictureFileLabel.nativeElement.innerText = 'Seleccionar archivo';

      return;
    }

    this.profilePictureFile = new File([fileInput.target.files[0]], this.id);
    this.profilePictureFileLabel.nativeElement.innerText = fileInput.target.files[0].name;

    // TODO: Fix this feature. Doesn't work at now.
    // this.previewProfilePicture();
  }

  previewProfilePicture() {
    if (!this.profilePictureFile) {
      return;
    }

    var reader = new FileReader();

    reader.readAsDataURL(this.profilePictureFile);
    reader.onload = (_event) => {
      this.profilePicturePreview = reader.result;
    }
  }

  uploadProfilePicture() {
    if (!this.profilePictureFile) {
      this.notifier.notify('error', 'Ninguna imagen seleccionada.');

      return;
    }

    if (this.userForm.invalid) {
      this.notifier.notify('error', 'Corrija los errores para poder subir la imagen de perfil.');

      return;
    }

    return this.fileUploader.uploadFile(this.profilePictureFile)
      .subscribe(event => {
        if(event['type'] === HttpEventType.UploadProgress) {
          console.log('Loaded:', Math.round(event['loaded'] / event['total'] * 100) + '%');
        } else if(event['type'] === HttpEventType.Response) {
          this.userForm.value.photo = this.id + '?lastModified=' + (new Date()).getTime();

          return this.onSubmit();
        }
      });
  }

  onCancel() {
    this.router.navigate(['/users']);
  }
}
