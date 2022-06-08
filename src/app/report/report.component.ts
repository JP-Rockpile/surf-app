import { Component, OnInit } from '@angular/core';
import { ColDef, GridOptions, ValueFormatterParams, RowClassRules, RowClassParams, GridReadyEvent, GridApi, ColumnApi, ColumnResizedEvent } from 'ag-grid-community';
import { StormGlassAPIService } from '../Services/storm-glass-api.service';

// import * as internal from 'stream';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  gridApi!: GridApi;
  gridColumnApi!: ColumnApi

  beaches: any = [];
  abilities: any = [];
  waves: any = [];
  weather: any = [];
  startTime: any = [];
  forecastLength: any = [];
  selectedBeach: string = '';
  selectedAbility: string = '';
  selectedField: string = '';
  abilityMaxWaveHeight: number = 4;
  latitude: number = 0;
  longitude: number = 0;
  parameters: string = '';
  displayReport: boolean = false;
  reportData: any;
  APIkey = 'be0244dc-e68a-11ec-8af0-0242ac130002-be024540-e68a-11ec-8af0-0242ac130002';
  params = 'windSpeed,waveHeight,airTemperature,waterTemperature,windSpeed,visibility,cloudCover';
  start: number = 0;
  end: number = 0;
  currentStatus: string = '';
  currentWaveSize: number = 0;
  today: any = [];
  reportDuration: string = '24 hours';
  weatherPref: number = 0;
  coverPref: number = 101;
  timePref: string = ':';
  forecastPref: number = 23;

  // initializing ag-grid values
  rowData: any[] = [];
  colDefs: ColDef[] = [
    {field: 'time', headerName: 'Time', valueFormatter: this.dateFormatter},
    {field: 'waveHeight.icon', headerName: 'Max Wave Height (M)'},
    {field: 'airTemperature.noaa', headerName: 'Air Temperature (C)'},
    {field: 'cloudCover.noaa', headerName: 'Cloud Coverage (%)'},
    {field: 'visibility.noaa', headerName: 'Visibilty (%)'},
    {field: 'waterTemperature.noaa', headerName: 'Water Temperature (C)'},
    {field: 'windSpeed.noaa', headerName: 'Wind Speed (Knots)'},
  ];

  // applicable to all ag-grid columns
  defaultColDef: ColDef = {
    sortable: true, filter: true
  }
  
  // setting background color for good-surf if conditions are met
  public rowClassRules: RowClassRules = {
    // row style function
    'good-surf': (params) => {
      return  params.data.waveHeight.icon < (this.abilityMaxWaveHeight / 3.28) && params.data.cloudCover.noaa < this.coverPref && params.data.airTemperature.noaa > this.weatherPref && params.data.time.includes(this.timePref);
    }
  };
  

  constructor(private reportService: StormGlassAPIService) { }

  ngOnInit(): void {

    //initializing HTML dropdown options
    this.beaches = [
      {name: 'Pacific Beach', lat: 32.798232, lng: -117.259311},
      {name: 'El Porto', lat: 33.90392932528822, lng: -118.42409350732741}
    ]

    this.abilities = [
      {title: 'Beginner', maxWaveHeight: 4},
      {title: 'Intermediate', maxWaveHeight: 6},
      {title: 'Advanced', maxWaveHeight: 10}
    ]

    this.waves = [
      {title: '2 or less feet', value: 2},
      {title: '3 feet', value:3},
      {title: '4 feet', value:4},
      {title: '5 feet', value:5},
      {title: '6 feet', value:6},
      {title: '7 feet', value:7},
      {title: '8 feet', value:8},
      {title: '9 feet', value:9},
      {title: '10 or more feet', value: 10},
    ]

    this.weather = [
      {title: 'Perfect Weather Only', airTemp: 24, cloudCoverage: 20 },
      {title: 'Warm Weather Only', airTemp: 21},
      {title: 'I prefer the cold', airTemp: 16},
      {title: 'Does Not Matter' , airTemp: 0}
    ]

    this.startTime = [
      {title: '12:00 AM', conversion: '07:00'},
      {title: '1:00 AM', conversion: '08:00'},
      {title: '2:00 AM', conversion: '09:00'},
      {title: '3:00 AM', conversion: '10:00'},
      {title: '4:00 AM', conversion: '11:00'},
      {title: '5:00 AM', conversion: '12:00'},
      {title: '6:00 AM', conversion: '13:00'},
      {title: '7:00 AM', conversion: '14:00'},
      {title: '8:00 AM', conversion: '15:00'},
      {title: '9:00 AM', conversion: '16:00'},
      {title: '10:00 AM', conversion: '17:00'},
      {title: '11:00 AM', conversion: '18:00'},
      {title: '12:00 PM', conversion: '19:00'},
      {title: '1:00 PM', conversion: '20:00'},
      {title: '2:00 PM', conversion: '21:00'},
      {title: '3:00 PM', conversion: '22:00'},
      {title: '4:00 PM', conversion: '23:00'},
      {title: '5:00 PM', conversion: '24:00'},
      {title: '6:00 PM', conversion: '01:00'},
      {title: '7:00 PM', conversion: '02:00'},
      {title: '8:00 PM', conversion: '03:00'},
      {title: '9:00 PM', conversion: '04:00'},
      {title: '10:00 PM', conversion: '05:00'},
      {title: '11:00 PM', conversion: '06:00'}
    ]

    this.forecastLength = [
      {title: '24 hours',  value: 23},
      {title: '48 hours',  value: 47},
      {title: '72 hours',  value: 71},
      {title: '7 days', value: 167}
    ]
    
  }

  //updating beach selection for API based upon HTML dropdown selection
  updateBeach(event:any){
    this.selectedBeach = event.target.value;
    console.log(this.selectedBeach);
    for(let i = 0; i < this.beaches.length; i++){
      if(this.beaches[i].name == this.selectedBeach){
        this.latitude = this.beaches[i].lat;
        this.longitude = this.beaches[i].lng;
      }
    }
    console.log(this.latitude);
    console.log(this.longitude);
  }

  //manual beach input
  manualLatitude(event:any){
    this.latitude = event.target.value;
    console.log(this.latitude);
  }

  manualLongitude(event:any){
    this.longitude = event.target.value;
    console.log(this.longitude);
  }

  //updating ability and wave height for API based upon HTML dropdown selection
  updateAbility(event:any){
    this.selectedAbility = event.target.value;
    console.log(this.selectedAbility);
    for(let i = 0; i < this.abilities.length; i++){
      if(this.abilities[i].title == this.selectedAbility){
        this.abilityMaxWaveHeight = this.abilities[i].maxWaveHeight;
      }
    }
    console.log(this.abilityMaxWaveHeight);
  }

  //updating ability and wave height for API based upon HTML dropdown selection - Advanced Options
  updateMaxWave(event:any){
    this.selectedField = event.target.value;
    for(let i = 0; i < this.waves.length; i++){
      if(this.waves[i].title == this.selectedField){
        this.abilityMaxWaveHeight = this.waves[i].value;
      }
    }
    console.log(this.abilityMaxWaveHeight);
  }

  //updating weather based upon HTML dropdown selection - Advanced Options
  updateWeather(event:any){
    this.selectedField = event.target.value;
    for(let i = 0; i < this.weather.length; i++){
      if(this.weather[i].title == this.selectedField){
        this.weatherPref = this.weather[i].airTemp;
      }
    }
    if(this.weatherPref == 24){
      this.coverPref = this.weather[0].cloudCoverage;
    }
    console.log(this.weatherPref);
    console.log(this.coverPref);
  }

  //updating time based upon HTML dropdown selection - Advanced Options
  updateTime(event:any){
    this.selectedField = event.target.value;
    for(let i = 0; i < this.startTime.length; i++){
      if(this.startTime[i].title == this.selectedField){
        this.timePref = this.startTime[i].conversion;
      }
    }
    console.log(this.timePref);
  }

  //updating forecast based upon HTML dropdown selection - effects API input - Advanced Options
  updateForecast(event:any){
    this.selectedField = event.target.value;
    for(let i = 0; i < this.forecastLength.length; i++){
      if(this.forecastLength[i].title == this.selectedField){
        this.forecastPref = this.forecastLength[i].value;
        this.reportDuration = this.forecastLength[i].title;
      }
    }
    console.log(this.forecastPref);
  }

  //make API call - retrieve and assign data - must be async due to load time
  async generateReport(){
    this.start = Math.floor(new Date().getTime() / 1000);
    var dt = new Date();
    dt.setHours( dt.getHours() + this.forecastPref );
    this.end = Math.floor(new Date(dt).getTime() / 1000);
    console.log('start: ' + this.start + 'end: ' + this.end);
    //API call
    await fetch(`https://api.stormglass.io/v2/weather/point?lat=${this.latitude}&lng=${this.longitude}&params=${this.params}&start=${this.start}&end=${this.end}`, {
      headers: {
      // defined at the top
      'Authorization': this.APIkey
      }
    }).then((response) => response.json()).then((jsonData) => {
    // Do something with response data.
      this.reportData =  jsonData;
    });
    this.sortSurfData();
    this.displayReport = true;
  }

  async sortSurfData(){
    await console.log(this.reportData.hours);
    this.currentSurfStatus();
    // fully dynamic column header option...
    // for(let key in this.reportData.hours[0]){
    //   this.colDefs.push({field: key});
    // }
    
    console.log(this.colDefs);
    
    for(let i = 0; i< this.reportData.hours.length ; i++){
      this.rowData.push(this.reportData.hours[i]);
    }
    console.log(this.rowData);
  }

  // fully dynamic column header option... not in current use
  objectFormatter(params: ValueFormatterParams){
    if(typeof params == 'object'){
      return JSON.stringify(params);
    } else{
      return params;
    }
  }

  //formats dates for ag-grid display - does not alter actual value
  dateFormatter(params: ValueFormatterParams){
    return params.value ? (new Date(params.value)).toLocaleString() : '';
  }

  // HTML display for current surf status - takes largest wave height for comparison
  currentSurfStatus(){
    var heightArr = [];
    var icon = this.reportData.hours[0].waveHeight.icon;
    heightArr.push(icon);
    var meteo = this.reportData.hours[0].waveHeight.meteo;
    heightArr.push(meteo);
    var noaa = this.reportData.hours[0].waveHeight.noaa;
    heightArr.push(noaa);
    var sg = this.reportData.hours[0].waveHeight.sg;
    heightArr.push(sg);
    console.log(Math.max(...heightArr));
    console.log(Math.min(...heightArr));
    var max = Math.max(...heightArr) * 3.28;
    this.currentWaveSize = Math.round(max);
    if(this.abilityMaxWaveHeight < this.currentWaveSize){
      this.currentStatus = 'Bad time to surf! Waves are too large!';
    } else if(this.abilityMaxWaveHeight >= this.currentWaveSize){
      this.currentStatus = 'Good time to surf! The waves are just the right size!';
    }
  }

  // for HTML display current status color
  getCurrentStatusClass(){
    if(this.abilityMaxWaveHeight < this.currentWaveSize){
      return 'bad-surf';
    } else if(this.abilityMaxWaveHeight >= this.currentWaveSize){
      return 'good-surf';
    } else {
      return '';
    }
  }

  // AG-Grid sizing adjustment function
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  // AG-Grid sizing adjustment function
  onColumnResized(params: ColumnResizedEvent) {
    console.log(params);
  }

}
