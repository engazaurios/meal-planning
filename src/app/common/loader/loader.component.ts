import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {LoaderService} from './loader.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.less']
})
// https://firstclassjs.com/display-a-loader-on-every-http-request-using-interceptor-in-angular-7/
// https://coursetro.com/posts/code/63/Angular-4-Animation-Tutorial
export class LoaderComponent implements OnInit, OnDestroy {

  isLoading = false;
  isLoadingSubscription: any;

  constructor(
    private loaderService: LoaderService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.isLoadingSubscription = this.loaderService.isLoading.subscribe((loading: boolean) => {
      this.isLoading = loading && !this.modalService.hasOpenModals();
    });
  }

  ngOnDestroy() {
    this.isLoadingSubscription.unsubscribe();
  }

}
