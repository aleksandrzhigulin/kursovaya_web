import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Category} from "../models/category.model";

@Injectable()
export class CategoryEventService {
  private categoryCreatedSource = new BehaviorSubject<Category | null>(null);
  private categoriesUpdatedSource = new BehaviorSubject<Category | null>(null);
  private categoryDeletedSource = new BehaviorSubject<Category | null>(null);

  categoryCreated$ = this.categoryCreatedSource.asObservable();
  categoriesUpdated$ = this.categoriesUpdatedSource.asObservable();
  categoryDeleted$ = this.categoryDeletedSource.asObservable();

  notifyCategoryCreated(category: Category) {
    this.categoryCreatedSource.next(category);
    this.categoriesUpdatedSource.next(category);
  }

  notifyCategoriesUpdated(category: Category | null) {
    this.categoriesUpdatedSource.next(category);
  }

  notifyCategoryDeleted(category: Category) {
    this.categoryDeletedSource.next(category);
    this.notifyCategoriesUpdated(category);
  }
}
