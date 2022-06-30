export interface University {
  domains: string[];
  webPages: string[];
  stateProvince: string;
  name: string;
  country: string;
  alphaTwoCode: string;
}

export interface API_University {
  'state-province': string;
  'alpha_two_code': string;
  'domains': string[];
  'name': string;
  'web_pages': string[];
  'country': string
}
