import { Component } from '@angular/core';
import {TransactionListComponent} from "./transaction-list/transaction-list.component";
import {HttpClientModule} from "@angular/common/http";
import {CategoriesListComponent} from "./categories-list/categories-list.component";
import {ExpenseBarComponent} from "./expense-bar/expense-bar.component";
import {FilterDateEventService} from "../../shared/services/filterdateevent.service";

@Component({
  selector: 'app-app-page',
  standalone: true,
  imports: [
    TransactionListComponent,
    HttpClientModule,
    CategoriesListComponent,
    ExpenseBarComponent
  ],
  templateUrl: './app-page.component.html',
  styleUrl: './app-page.component.scss'
})
export class AppPageComponent {
  protected from_date: Date = new Date();
  protected to_date: Date = new Date();

  public constructor(private filterDateEventService: FilterDateEventService) {
    this.filterDateEventService.datesUpdated$.subscribe({
      next: result => {
        if (result)
        { // @ts-ignore
          this.from_date = result["from"];
          // @ts-ignore
          this.to_date = result["to"];
          console.log("Dates")
          console.log(this.from_date, this.to_date);
        }

      }
    })
  }
}
