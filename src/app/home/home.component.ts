import { RecipeService } from '../services/recipe-service.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingAnimService } from '../services/loading.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';

import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsub: Subject<any> = new Subject();
  
  loadingSub: Subscription;
  loading: boolean = false;
  change: boolean = false;
  animationTrigger: boolean = false;
  ext: boolean = false;
  onclick: boolean = false;
  ingreServ: boolean;
  ingredients: String;
  main: String;
  number: number = 20;
  
  recipes: any;
  diet: any = '';
  intol: any = '';
  exclude: any = '';
  error: any;

  constructor(
    private recipeService: RecipeService,
    private loadingScreenServ: LoadingAnimService
  ) {}

  ngOnInit() {
    this.loadingSub = this.loadingScreenServ.loadingStatus
      .pipe(debounceTime(200),takeUntil(this.unsub))
      .subscribe((value) => {
        this.loading = value;
      });
  }

  getByIngredients() {
    
    this.recipeService
      .getByIngredient(this.ingredients, this.number)
      .pipe(takeUntil(this.unsub))
      .subscribe((recipes) => {
        this.ingredients = '';
        this.loading = true;
        this.recipes = recipes;
      
        this.ingreServ = true;
        this.animationTrigger = !this.animationTrigger;
      }, (error) => {
      this.error = error.error
      console.log(error.error)
    }
    );
  }

  getBySearch() {
    console.log(this.main);
    this.recipeService
      .getBySearch(this.main, this.number, this.diet, this.intol, this.exclude)
      .pipe(takeUntil(this.unsub))
      .subscribe((recipes) => {
        this.ingreServ = false;
        this.main = '';
        this.loading = true;
        this.recipes = recipes;
        this.animationTrigger = !this.animationTrigger;
      },
    (error) => {
      this.error = error.error
      console.log(error.error)
    }
      );
    }
  
  ngOnDestroy() {
    this.loadingSub.unsubscribe();
    this.unsub.next();
    this.unsub.complete();
  }

  changeSearch() {
    this.change = !this.change;
    this.error = null
  }

  extra() {
    this.ext = true;
    this.onclick = !this.onclick;
    
  }


 
}
