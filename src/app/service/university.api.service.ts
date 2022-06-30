import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { University } from '../model/university';
import { Observable } from 'rxjs';

const URL = 'http://universities.hipolabs.com/search?country=United+States';

@Injectable({
  providedIn: 'root'
})
export class UniversityAPIService {

  constructor(private http: HttpClient) { }

  getUniversities(): Observable<any>{
    return this.http.get<University[]>(`${URL}`)
  }

}
