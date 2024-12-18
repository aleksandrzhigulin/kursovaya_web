import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Category} from "../models/category.model";

@Injectable()
export class CategoryService {
  private readonly apiUrl = 'http://localhost:3000/categories';
  constructor(private http: HttpClient) {}

  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe();
  }

  findCategoriesByOwner(owner: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}?owner=${owner}`);
  }

  findCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${category.id}`, category);
  }

  getCategoryNameById(id: number): Observable<string> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      map(categories => {
        const category = categories.find(category => category.id === id);
        return category ? category.name : 'Неизвестная категория';
      })
    );
  }

}
