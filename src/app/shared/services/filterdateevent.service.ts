import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class FilterDateEventService {
  private datesUpdatedSource = new BehaviorSubject<{} | null>({});

  datesUpdated$ = this.datesUpdatedSource.asObservable();

  notifyDatesUpdated(arg: {}) {
    this.datesUpdatedSource.next(arg);
  }
}
