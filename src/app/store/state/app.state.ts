import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { API_University, University } from 'src/app/model/university';
import { UniversityAPIService } from 'src/app/service/university.api.service';
import { tap } from 'rxjs/operators';
import {
  GetUniversityList,
  SetAreUniversitiesLoaded,
  FilterUniversity,
} from '../action/app.action';

export interface UniversityStateModel {
  default_universities: University[];
  filteredUniversities: University[];
  areUniversitiesLoaded: boolean;
  collectionSize: number;
}

const universityStateDefaults: UniversityStateModel = {
  default_universities: [],
  filteredUniversities: [],
  areUniversitiesLoaded: false,
  collectionSize: 0,
};

@State<UniversityStateModel>({
  name: 'university',
  defaults: universityStateDefaults,
})
@Injectable()
export class UniversityState {
  @Selector()
  static collectionSize(state: UniversityStateModel): number {
    return state.collectionSize;
  }

  @Selector()
  static areUniversitiesLoaded(state: UniversityStateModel): boolean {
    return state.areUniversitiesLoaded;
  }

  @Selector()
  static filteredUniversities(state: UniversityStateModel) {
    return state.filteredUniversities;
  }

  constructor(private universityAPIService: UniversityAPIService) {}

  @Action(GetUniversityList)
  getUniversities({ getState, setState }: StateContext<UniversityStateModel>) {
    return this.universityAPIService.getUniversities().pipe(
      tap((result) => {
        const newData = result.map((item: API_University) => ({
          ...item,
          domains: item.domains[0],
          stateProvince: item['state-province'],
          webPages: item.web_pages[0],
        }));
        const state = getState();
        setState({
          ...state,
          default_universities: newData,
          filteredUniversities: newData,
          areUniversitiesLoaded: true,
          collectionSize: result.length,
        });
      })
    );
  }

  @Action(SetAreUniversitiesLoaded)
  setAreUniversitiesLoaded(
    { getState, setState }: StateContext<UniversityStateModel>,
    action: SetAreUniversitiesLoaded
  ) {
    const state = getState();
    setState({
      ...state,
      areUniversitiesLoaded: action.payload,
    });
  }

  @Action(FilterUniversity)
  updateFilter(
    { getState, setState }: StateContext<UniversityStateModel>,
    action: FilterUniversity
  ) {
    const state = getState();
    const temp = state.default_universities.filter((university) => {
      const value = action.payload.toLowerCase();
      return university.name.toLowerCase().includes(value);
    });
    setState({
      ...state,
      filteredUniversities: temp,
      collectionSize: temp.length,
    });
  }
}
