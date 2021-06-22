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

  options = { autoHide: false, scrollbarMinSize: 40, scrollbarMaxSize: 60 };
 
  numbers = Array(1).fill(0);
 
  instructionsChange: boolean = true;
  ingredientsChange: boolean = false;
  extrasChange: boolean = false;
  loading: boolean = false;

  loadingSub: Subscription;


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
        this.loading = true;
        this.recipe = [recipe];
        console.log(recipe)
      })
  }

  changeToIngredients(){
    this.instructionsChange = false;
    this.ingredientsChange = !this.ingredientsChange;
    this.extrasChange = false;
  }
  changeToExtra(){
    this.extrasChange = !this.extrasChange;
    this.instructionsChange = false;
    this.ingredientsChange = false;
  }
  changeToInstruction(){
    this.extrasChange = false;
    this.ingredientsChange = false;
    this.instructionsChange = !this.instructionsChange;
  }

  ngOnDestroy(){
    this.unsub.next();
    this.unsub.complete();
  }

}

