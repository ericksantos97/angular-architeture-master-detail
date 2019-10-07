import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Entry } from './entry.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private readonly API_PATH = 'api/entries';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Entry[]> {
    return this.http.get(this.API_PATH).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    );
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.API_PATH}/${id}}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    );
  }

  create(entry: Entry): Observable<Entry> {
    return this.http.post(this.API_PATH, entry).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    );
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.API_PATH}/${entry.id}`;

    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.API_PATH}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element);
      entries.push(entry);
    });
    return entries;
  }

  private handleError(error: any): Observable<any> {
    console.log('Erro na requisição => ', error);
    return throwError(error);
  }

}
