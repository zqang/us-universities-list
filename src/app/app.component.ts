import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { University } from './model/university';
import { UniversityState } from './store/state/app.state';
import { tap, debounceTime, takeUntil } from 'rxjs/operators';
import { FilterUniversity, GetUniversityList } from './store/action/app.action';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  page = 1;
  pageSize = 20;
  searchText = new FormControl('');
  universities: University[] = [];

  @Select(UniversityState.filteredUniversities)
  filteredUniversities$!: Observable<University[]>;
  @Select(UniversityState.areUniversitiesLoaded)
  areUniversitiesLoaded$!: Observable<boolean>;
  @Select(UniversityState.collectionSize) collectionSize$!: Observable<number>;

  areUniversityLoadedSub!: Subscription;
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.areUniversityLoadedSub = this.areUniversitiesLoaded$
      .pipe(
        tap((areUniversitiesLoaded) => {
          if (!areUniversitiesLoaded) {
            this.store.dispatch(new GetUniversityList());
          }
        })
      )
      .subscribe((value) => {
        console.log('done loaded', value);
      });

    this.searchText.valueChanges
      .pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.store.dispatch(new FilterUniversity(value)).subscribe();
      });

    this.refresh();
  }

  ngOnDestroy() {
    this.areUniversityLoadedSub.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.filteredUniversities$.subscribe((data) => {
      this.universities = data
        .map((university, i) => ({ id: i + 1, ...university }))
        .slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize
        );
    });
  }
}
