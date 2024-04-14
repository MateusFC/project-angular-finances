import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Entry } from "./entry.model";

@Injectable({
  providedIn: "root",
})
export class EntriesService {
  constructor(private http: HttpClient) {}

  private apiPath: string = "api/entries";

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.map((element) => entries.push(element));
    return entries;
  }

  private handleError(error: any[]): Observable<any[]> {
    console.log("Error na requisição: ", error);
    return throwError(error);
  }

  getAllEntries(): Observable<Entry[]> {
    return this.http
      .get(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntries));
  }

  getByIdEntries(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map((data) => data as Entry)
    );
  }

  createEntries(entries: Entry): Observable<Entry> {
    return this.http.post(this.apiPath, entries).pipe(
      catchError(this.handleError),
      map((data) => data as Entry)
    );
  }

  updateEntries(id: number, entries: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;
    return this.http.put(url, entries).pipe(
      catchError(this.handleError),
      map(() => entries)
    );
  }

  deleteEntries(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }
}
