import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingAnimService } from '../services/loading.service';
import { finalize } from 'rxjs/operators'


@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  
  activeRequests: number = 0;

  constructor( private loadingScreenServ: LoadingAnimService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.activeRequests === 0) {
      this.loadingScreenServ.startLoading();
    }

    this.activeRequests++;
    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0){
          this.loadingScreenServ.stopLoading();
        }
      })
    )
  };
}
