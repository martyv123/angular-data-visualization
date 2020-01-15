import { Injectable, EventEmitter, Output,  NgZone } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';



import { Option } from '../models/option';
import { OPTIONS } from '../data/option-data';

@Injectable({
  providedIn: 'root'
})
export class CensusService {

  // eventSource = null;

  // @Output() newEntryFx: EventEmitter<any> = new EventEmitter();

  private censusDataUrl: string = 'http://localhost:4000'

  private newEntryFx = new Subject<Option>();
  public newEntryFxObs = this.newEntryFx.asObservable();

  private newEntryFx2 = new Subject<any>();
  public newEntryFx2Obs = this.newEntryFx2.asObservable();

  options: Option[];

  // censusData = {
  //   '14-25':0,
  //   '25-35':0,
  //   '35-45':0,
  //   '45-60':0,
  //   '60+':0,
  // };

  censusData = {};

  private zone: NgZone = new NgZone({ enableLongStackTrace: false});

  constructor(
    private http: HttpClient
  ) {
    this.options = []; //OPTIONS
    // console.log('census service constructor');
    // console.log(this.options);
    // console.log(OPTIONS);

    // this.eventSource = new EventSource('http://localhost:4000/sse');

    // this.eventSource.addEventListener('error', this.onEventSourceError);
    // this.eventSource.addEventListener('open',  this.onEventOpen);
    // // this.eventSource.addEventListener('message', this.onEventMessage);
    // this.eventSource.addEventListener('close', this.onEventClosed);
    // this.eventSource.addEventListener('update', this.onEventUpdate);

    // this.eventSource.onerror = e =>  this.onEventSourceError(e);
    // this.eventSource.onopen = e => this.onEventOpen(e);
    // this.eventSource.onmessage = e => this.onEventMessage(e);
  }

  watch(): Observable<object> {
    return Observable.create( (observer) => {
      const eventSource = new EventSource('http://localhost:4000/sse');

      // eventSource.onopen = event => this.zone.run(() => observer.next(event));
      eventSource.onerror = event => this.zone.run(() => observer.error(event));
      eventSource.onmessage = event => this.zone.run(() => observer.next(JSON.parse(event.data)));

    });
  }

  getOptions(): Observable<Option[]> {
    return of(OPTIONS);
    // const url = `${this.censusDataUrl}/censusoptions`;
    // return this.http.get<Option[]>(url)
    //   .pipe(
    //     catchError(this.handleError('censusoptions', []))
    //   );
  }

  getCensusData(): Observable<any> {
    // return of(this.censusData);
    const url = `${this.censusDataUrl}/censusdata`;

    return this.http.get<any>(url)
      .pipe(

        catchError(this.handleError('censusdata', []))
      );
  }

  addVote(option: Option): Observable<Option> {

    const httpOptions = {
      headers : new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<Option>(`${this.censusDataUrl}/vote`, option, httpOptions)
      .pipe(
        tap(data => this.newEntryFx.next(data)),
        catchError(this.handleError<any>('addVote'))
      );
    // this.censusData[option.value] += 1;

    // const data = {
    //   ...option,
    //   selected: true,
    // }

    // this.newEntryFx.next(data);
    // return of(data);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  onEventSourceError(event) {
    console.log('received an error from event stream');
    console.log(event)
  }

  onEventOpen(event) {
    console.log('The event stream was opened');
    console.log(event);
  }

  // onEventClosed(event) {
  //   console.log('the event stream closed');
  //   console.log(event)
  // }

  onEventMessage(event) {
    // console.log('the event stream message received');
    // console.log(event);
    // console.log(JSON.parse(event.data));

    // this.censusData = JSON.parse(event.data);
    // this.newEntryFx2.next(JSON.parse(event.data));


  }

  // onEventUpdate(event) {
  //   console.log('the event stream update');
  //   console.log(event);
  // }

  // onEventNotice(event) {
  //   console.log('the event stream notice');
  //   console.log(event);
  // }
}
