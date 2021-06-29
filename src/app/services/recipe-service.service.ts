import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod'

const baseUrl = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) { }

  getByIngredient (ingredients,number){
    return this.http.get(`${baseUrl}?ingredients=${ingredients}&number=${number}`)
   
  }
  getBySearch(main,number,diet,intol,exclude){
    
    return this.http.get(`${baseUrl}search/?main=${main}&number=${number}&diet=${diet}&intol=${intol}&exclude=${exclude}`)
  }
  
  getRecipe(id){

    return this.http.get(`${baseUrl}${id}`);
  }
}
