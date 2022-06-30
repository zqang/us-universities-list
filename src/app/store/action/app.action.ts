export class GetUniversityList {
  static readonly type = '[University] Get University List';
}

export class SetAreUniversitiesLoaded {
  static readonly type = '[University] Set Are Universities Loaded';
  constructor(public payload: boolean) {}
}

export class FilterUniversity {
  static readonly type = '[University] Filter University';
  constructor(public payload: string) {}
}
