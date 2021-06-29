import { RecipeService } from '../services/recipe-service.service';
import { Component, OnInit, OnDestroy,HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingAnimService } from '../services/loading.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: '/home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsub: Subject<any> = new Subject();
  
  loadingSub: Subscription;
  loading: boolean = false;
  change: boolean = false;
  ext: boolean = false;
  onclick: boolean = false;
  check:boolean = false;
  ingreServ: boolean;
  ingredients: String;
  main: String;
  number: number = 20;
  isSticky:boolean = false;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 450;
  
    
  }

  
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
    this.check = true;
    this.recipeService
      .getByIngredient(this.ingredients, this.number)
      .pipe(takeUntil(this.unsub))
      .subscribe((recipes) => {
        this.ingredients = '';
        this.loading = true;
        this.recipes = recipes;
        this.ingreServ = true;
      
      }, (error) => {
      this.error = error.error
      console.log(error.error)
    }
    );
  }

  getBySearch() {
    this.check = true;
    
    this.recipeService
      .getBySearch(this.main, this.number, this.diet, this.intol, this.exclude)
      .pipe(takeUntil(this.unsub))
      .subscribe((recipes) => {
        this.ingreServ = false;
        this.main = '';
        this.loading = true;
        this.recipes = recipes;

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
