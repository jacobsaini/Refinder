import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RecipeService } from '../services/recipe-service.service'
import { LoadingAnimService } from '../services/loading.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit,OnDestroy {
  private unsub: Subject<any> = new Subject();
  recipe:any = [{}];
  loaded:boolean = false;
  loading: any;
  loadingSub: Subscription;
  instructions:any = [{}];
  constructor(  
    private recipeService: RecipeService,
    private loadingScreenServ: LoadingAnimService,   
    private route: ActivatedRoute) {
  
   }

  ngOnInit(){
    this.loadingSub = this.loadingScreenServ.loadingStatus
    .pipe(debounceTime(200),takeUntil(this.unsub))
    .subscribe((value) => {
      this.loading = value;
    });
    this.getRecipe(this.route.snapshot.paramMap.get('id'));
  }

  getRecipe(id){
    this.recipeService.getRecipe(id)
    .pipe(takeUntil(this.unsub))
    .subscribe(
      (recipe) => {
        this.recipe = recipe; 
        this.instructions = recipe[0].analyzedInstructions[0]
      })
  }

  ngOnDestroy(){
    this.unsub.next();
    this.unsub.complete();
  }

}

