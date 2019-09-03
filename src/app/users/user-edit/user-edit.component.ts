import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, Data } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UsersService } from '../users.service';
import { Department } from '../department.model';
import { Role } from '../role.model';
import { User } from '../user.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FileUploaderService } from 'src/app/file-uploader.service';
import { HttpEventType } from '@angular/common/http';

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
  profilePictureFile: File = null;
  profilePicturePreviewUrl: any;
  profilePictureUploadProgress: string = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private fileUploader: FileUploaderService
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
      birthdayNgbDate: new FormControl(user.birthdayNgbDate),
      departmentId: new FormControl(user.departmentId, Validators.required),
      roleId: new FormControl(user.roleId, Validators.required),
      email: new FormControl(user.email, [Validators.required, Validators.email]),
      username: new FormControl(user.username, Validators.required),
      qrCode: new FormControl(user.qrCode, Validators.required),
      password: new FormControl(user.password, user.id ? null : Validators.required),
    });

    this.profilePicturePreviewUrl = this.fileUploader.downloadUrl + this.id;
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

  fileProgress(fileInput: any) {
    this.profilePictureFile = new File([fileInput.target.files[0]], this.id);
    this.previewProfilePicture();
  }

  previewProfilePicture() {
    // Show preview 
    if (this.profilePictureFile.type.match(/image\/*/) == null) {
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
      return;
    }

    return this.fileUploader.uploadFile(this.profilePictureFile)
      .subscribe(event => {
        this.profilePictureUploadProgress = '0%';

        if(event['type'] === HttpEventType.UploadProgress) {
          this.profilePictureUploadProgress = Math.round(event['loaded'] / event['total'] * 100) + '%';
        } else if(event['type'] === HttpEventType.Response) {
          this.profilePictureUploadProgress = '';
          this.profilePicturePreviewUrl = this.fileUploader.downloadUrl + this.id;
        }
      });
  }

  onCancel() {
    this.router.navigate(['/users']);
  }
}
