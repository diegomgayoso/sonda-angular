import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sicknotes } from '../interfaces/sicknotes';

@Injectable({
  providedIn: 'root'
})
export class SicknotesService {


  private apiSicknotes = 'http://localhost:3000/atestados'
  constructor(private http: HttpClient) { }

  getSicknotes() : Observable<Sicknotes[]>{
    return this.http.get<Sicknotes[]>(this.apiSicknotes);
  }
}
