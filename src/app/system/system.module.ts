import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {SharedModule} from "../shared/shared.module";
import {SystemRoutingModule} from "./system-routing.module";
import {SystemComponent} from "./system.component";
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "../shared/services/auth.service";
import {CategoryService} from "../shared/services/category.service";
import {CategoryEventService} from "../shared/services/categoryevent.service";
import {TransactionService} from "../shared/services/transaction.service";
import {TransactionEventService} from "../shared/services/transactionevent.service";
import {FilterDateEventService} from "../shared/services/filterdateevent.service";

@NgModule({
  imports: [CommonModule, SharedModule, SystemRoutingModule, SystemComponent, HttpClientModule],
  providers: [AuthService, CategoryService, CategoryEventService, TransactionService, TransactionEventService, FilterDateEventService]
})

export class SystemModule {}
