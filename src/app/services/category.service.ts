import { Injectable } from '@angular/core';
import { Category } from './Models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  

    getCategories() { 
    return new Array("Hotel", "Caffee", "Hospital", "school"); 
  }
  

}
