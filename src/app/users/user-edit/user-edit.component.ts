import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router, Data } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
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
  userForm: FormGroup;
  departments: Department[];
  costCenters: CostCenter[];
  roles: Role[];

  profilePictureFile: File;
  profilePicturePreviewUrl: any;
  profilePictureFileExist: boolean;
  @ViewChild('imageInput', { static: false }) profilePictureFileInput: ElementRef;

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
    this.profilePictureFileExist = true;
  }

  initForm() {
    let user: User = this.route.snapshot.data.model.user;

    this.userForm = new FormGroup({
      name: new FormControl(user.name, Validators.required),
      lastName: new FormControl(user.lastName, Validators.required),
      birthdayNgbDate: new FormControl(user.birthdayNgbDate),
      departmentId: new FormControl(user.departmentId, Validators.required),
      costCenterId: new FormControl(user.costCenterId, Validators.required),
      roleId: new FormControl(user.roleId, Validators.required),
      email: new FormControl(user.email, [Validators.required, Validators.email]),
      username: new FormControl(user.username, Validators.required),
      qrCode: new FormControl(user.qrCode, Validators.required),
      password: new FormControl(user.password, user.id ? null : Validators.required),
      photo: new FormControl(user.photo),
    });

    // this.profilePicturePreviewUrl = user.photo ? (this.fileUploader.downloadUrl + user.photo) : null;
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
      this.usersService.updateUser(this.id, this.userForm.value)
        .subscribe(() => {
          this.router.navigate(['/users']);
        });

      return;
    }

    this.usersService.createUser(this.userForm.value)
      .subscribe(() => {
        this.router.navigate(['/users']);
      });
  }

  profilePictureSelected(fileInput: any) {
    if (!fileInput.target.files.length) {
      this.profilePictureFile = null;
      this.profilePictureFileInput.nativeElement.value = null;

      return;
    }

    if (fileInput.target.files[0].type.match(/image\/*/) == null) {
      this.notifier.notify('error', 'Archivo inválido.');
      this.profilePictureFileInput.nativeElement.value = null;

      return;
    }

    this.profilePictureFile = new File([fileInput.target.files[0]], this.id);

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
      this.profilePicturePreviewUrl = reader.result;
    }
  }

  uploadProfilePicture() {
    if (!this.profilePictureFile) {
      this.notifier.notify('error', 'Ninguna imagen seleccionada.');

      return;
    }

    return this.fileUploader.uploadFile(this.profilePictureFile)
      .subscribe(event => {
        if(event['type'] === HttpEventType.UploadProgress) {
          console.log('Loaded:', Math.round(event['loaded'] / event['total'] * 100) + '%');
        } else if(event['type'] === HttpEventType.Response) {
          this.profilePictureFile = null;
          this.profilePictureFileInput.nativeElement.value = null;
          // this.profilePicturePreviewUrl = this.fileUploader.downloadUrl + this.id + '?lastModified=' + (new Date()).getTime();
          this.profilePictureFileExist = true;

          this.userForm.value.photo.setValue(this.id + '?lastModified=' + (new Date()).getTime());

          return this.onSubmit();
        }
      });
  }

  userProfilePictureNotFound() {
    // this.profilePicturePreviewUrl = this.fileUploader.downloadUrl + 'man.png';
    this.profilePictureFileExist = false;
  }

  onCancel() {
    this.router.navigate(['/users']);
  }
}
