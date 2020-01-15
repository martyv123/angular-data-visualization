import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Option } from '../../models/option';

import { CensusService } from  '../../services/census.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})


export class ChartsComponent implements OnInit {

  @Input() censusData = {};

  @Output() newEntry: EventEmitter<Option> = new EventEmitter();

  chartType: string = 'pie';
  chartData =  [];
  chartLabels = [];
  totalPopulation: number = 0;
  under35: number = 0;
  between35and60: number = 0;
  above60: number = 0;

  constructor(
    private censusService: CensusService
  ) { }

  ngOnInit() {
    this.censusService.newEntryFxObs.subscribe((res: Option) => {

      this.newEntry.emit(res);
      // this.computeData();
      this.getCensusData();
    });

    this.censusService.newEntryFx2Obs.subscribe(data  => {
      console.log("new entry fx obs2 charts")
      console.log(data);
      this.censusData = data
      this.computeData();
    });

    this.censusService.watch().subscribe(data => {
      console.log('chart update census data')
      this.censusData = data;
      this.computeData();
    });

    // this.getCensusData()
    this.computeData();

  }

  computeData() {

    this.chartData = Object.keys(this.censusData).map(key => this.censusData[key]); //Object.values(this.censusData);
    this.chartLabels = Object.keys(this.censusData);
    this.totalPopulation = this.getTotalPopulation();
    this.under35 = Math.round(this.getPopulationUnder35());
    this.between35and60 = Math.round(this.getPopulationBetween35and60());
    this.above60 = Math.round(this.getPopulationAbove60());
  }

  getTotalPopulation() {
    const values: number[] = Object.keys(this.censusData).map(key => this.censusData[key]); //Object.values(this.censusData);

    return values.reduce((defaultValue, val) => defaultValue + val, 0);
  }

  getPopulationUnder35() {
    const total = this.getTotalPopulation();

    const populationUnder35 = Object.keys(this.censusData).reduce(
      (initVal, val) => {
        if (val === '14-25' || val === '25-35') {
          return initVal + this.censusData[val];
        }

        return initVal;
      },
      0
    );

    return populationUnder35 / total * 100;
  }

  getPopulationBetween35and60() {
    const total = this.getTotalPopulation();

    const populationBetween35and60 = Object.keys(this.censusData).reduce(
      (initVal, val) => {
        if (val === '35-45' || val === '45-60') {
          return initVal + this.censusData[val];
        }

        return initVal;
      },
      0
    );

    return populationBetween35and60 / total * 100;
  }

  getPopulationAbove60() {
    const total = this.getTotalPopulation();

    const populationAbove60 = Object.keys(this.censusData).reduce(
      (initVal, val) => {
        if (val === '60+') {
          return initVal + this.censusData[val];
        }

        return initVal;
      },
      0
    );

    return populationAbove60 / total * 100;
  }

  getCensusData(): void {
    this.censusService.getCensusData().subscribe(censusData => {
      this.censusData = censusData;

      this.computeData();
      console.log('get census data chart');
      console.log(censusData);
    });
  }

  // not using
  onTestBtn(mLabel: string, mVal: string) {
    this.computeData();
    this.newEntry.emit({label: mLabel,
                        selected: true,
                        value: mVal
                       });
  }
}
