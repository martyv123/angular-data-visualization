import { Component, OnInit , NgZone
       } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

import { Option } from './models/option';

import { OPTIONS } from './data/option-data';

import {CensusService } from './services/census.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // eventSource = null;

  selectedOption: string;
  message: string = '';
  options: Option[] = [];

  censusData = {};

  censusDataFound: boolean = false;

  // private zone: NgZone = new NgZone({enableLongStackTrace; false});

  constructor(
    // private http: HttpClient,
    private censusService: CensusService//,

  ) {
    this.selectedOption = null;

    // this.eventSource = new EventSource('http://localhost:4000/sse');
  }

  ngOnInit() {

    // this.eventSource.onerror  = e =>  this.onEventSourceError(e);
    // this.eventSource.onopen = e =>  this.onEventOpen(e);
    // this.eventSource.onmessage = e => this.onEventMessage(e);
    // this.eventSource.addEventListener('close', this.onEventClosed);
    // this.eventSource.addEventListener('update', this.onEventUpdate);

    // this.censusService.watch().subscribe(data => {
    //   console.log('watch app comp ');
    //   console.log(data);
    //   this.censusData = data;

    //   // console.log(this);
    // });
    this.getOptions();
    this.getCensusData();
  }

  takeVote(index: number) {

    const selectedOption = this.options[index];

    this.censusService.addVote(selectedOption).subscribe((res: Option) => {
      const options = this.options.map(
        (option, i) => (index === i ? { ...res} : { ...option })
      );

      // console.log("return from census add vote ");
      // console.log(res);
       // console.log([...options]);

      this.options = [ ...options ];
        // this.selectedOption = res.value;
    });

    // if(!selectedOption.selected) {
    //   // this.http
    //   //   .post('http://localhost:4000/vote', selectedOption)
    //   //   .subscribe((res: Option) => {
    //   //     const options = this.options.map(
    //   //       (option, i) => (index === i ? { ...res } : { ...option })
    //   //     );
    //   //     this.options = [...options];
    //   //     this.selectedOption = res.value
    //   //   });
    //   this.censusService.addVote(selectedOption).subscribe((res: Option) => {
    //     const options = this.options.map(
    //       (option, i) => (index === i ? { ...res} : { ...option })
    //     );

    //     // console.log("return from census add vote ");
    //     // console.log(res);
    //     // console.log([...options]);

    //     this.options = [ ...options ];
    //     // this.selectedOption = res.value;
    //   });
    // }
    // else {
    //   this.message = "You've already placed a vote";
    // }
  }

  onNewEntry(data) {
    // this.censusData[data.value] += 1;

    // this.getCensusData();

    console.log('new entry ');
    console.log(this.censusData);
    console.log(data);
    console.log('----------');
  }

  getOptions(): void {
    this.censusService.getOptions().subscribe(options => {
      this.options = options;
      // console.log('get options service');

    });
  }

  getCensusData(): void {
    this.censusService.getCensusData().subscribe(censusData => {
      this.censusData = censusData;
      this.censusDataFound = true;
    });
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
    console.log('the event stream message received');
    // console.log(event);
    // console.log(JSON.parse(event.data));

    // this.censusData = { ...JSON.parse(event.data) };

    const  jsonData = JSON.parse(event.data);

    // console.log(jsonData);
    // console.log(this.censusData);

    // if (this.censusDataFound) {
    //   this.censusDataFound = false;
    // } else{
    //   this.censusDataFound = true;
    // }

    // this.zone.run(() => {

    //   for(let key in jsonData) {

    //     this.censusData[key] = jsonData[key];
    //     console.log('key ' + key);
    //     console.log(jsonData[key]);
    //     console.log(this.censusData[key]);
    //   }

    // });

    // let censusData = {};

    // for(let key in jsonData) {

    //   this.censusData[key] = jsonData[key];
    //   console.log('key ' + key);
    //   console.log(jsonData[key]);
    //   console.log(this.censusData[key]);
    // }

    // this.censusData = censusData;

    // this.censusDataFound = true;

    // console.log(this.censusData);
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
