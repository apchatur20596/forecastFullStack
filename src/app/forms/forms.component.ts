import { Component, ElementRef, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeprecatedDatePipe } from '@angular/common';
import * as Highcharts from 'highcharts';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { BaseChartDirective } from 'ng2-charts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);


@Component ({
  selector: 'app-form',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})

export class FormsComponent {

@ViewChild("content", {static: false}) divView: ElementRef;
@ViewChild(BaseChartDirective, {static: true}) chart123: BaseChartDirective;

favorite = [];
autoSuggestions: string[] = [];

public twitterURL = '';

public contentHeader = '';
public contentCity = '';
public contentTemp = '';
public contentSummary = '';
public contentImageURL = '';
public contentPrecip = '';
public contentChanceOfRain = 0.0;
public contentWindSpeed = '';
public contentHumidity = 0.0;
public contentVisibility = '';


public options: any = {
  chart : {
        type: 'columnrange',
        inverted:true,
     },
     title : {
       text: 'Weekly Weather',
       style: {
        fontWeight: 'bold'
       }
     },
     legend: {
      layout: 'vertical',
      align: 'center',
      verticalAlign: 'top'
  },
     xAxis : {
      title: {
        text: 'Days'
     },
        categories: [],
     },
     yAxis : {
        title: {
           text: 'Temperature in Fahrenheit'
        },
        categories: ['50','60','70','80','90','100'],
        min: 40,
        max: 100,
        tickInterval: 10,

     },
    tooltip: {
           pointFormat: '<span>{point.key}: {point.low} to {point.high}</span>',
        shared: true,
        useHTML: true
     },

     plotOptions : {
        columnrange: {
          events: {
            click: (event) => {
              this.testFunction(event);
            }
          },
           dataLabels: {
              enabled: true,
              formatter: function () {
                 return this.y;
              }
           }
        }
     },
     credits : {
        enabled: false
     },
     series : [{
        name: 'Day wise temperature range',
        data: [  ],
        marker : {symbol : 'square', radius : 12 }

     }]
};


  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    tooltips: {
      titleFontSize: 20,
      bodyFontSize: 20
    },
    plugins: {
      datalabels: {
        font: {
          size: 20
        }
      }

    },
    legend: {
      labels: {
        fontSize: 20
      },
      onClick: null
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Farhenite',
          fontSize: 20
        },
        ticks: {
          fontSize: 15
      }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time difference from current hour',
          fontSize: 20
        },
        ticks: {
          fontSize: 15
      }

      }]
    }
  };

  public barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16',
  '17', '18', '19', '20', '21', '22', '23'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public response = {};

  public barChartData = [ {data: [65, 59, 80, 81, 56, 55, 40], label: 'seriesA', backgroundColor: 'lightskyblue', hoverBackgroundColor: 'steelblue'} ];

  constructor( private http: HttpClient, private modalService: NgbModal) {}

  closeResult: string;

  ngOnInit() {
    Highcharts.chart('container', this.options);
  }

  clearEverything() {
    console.log('clear');
    (<HTMLInputElement> document.getElementById('streetVal')).value = '';
    (<HTMLInputElement>document.getElementById('cityVal')).value = '';
    (<HTMLInputElement>document.getElementById('stateVal')).value = 'state';
    document.getElementById('cityError').style.display = 'none';
    document.getElementById('streetError').style.display = 'none';
    document.getElementById('resultsButton').click();
    (<HTMLInputElement>document.getElementById('currentLoc')).checked = false;
    document.getElementById('favoriteDiv').style.display = 'none';
    document.getElementById('invalidAddress').style.display = 'none';
    this.favorite = [];
    localStorage.clear();
    document.getElementById('helloWorld').style.display = 'none';


  }

  searchEnable() {
    if((<HTMLInputElement>document.getElementById('streetVal')).value == '' ||
    (<HTMLInputElement>document.getElementById('cityVal')).value == '' ||
    (<HTMLInputElement>document.getElementById('stateVal')).value == 'state') {
      (<HTMLInputElement>document.getElementById('searchButton')).disabled = true;
    } else {
      (<HTMLInputElement>document.getElementById('searchButton')).disabled = false;
    }
  }

  resultsClick() {
    document.getElementById('resultsButton').style.backgroundColor = 'steelblue';
    document.getElementById('resultsButton').style.color = 'white';
    document.getElementById('favoritesButton').style.backgroundColor = 'white';
    document.getElementById('favoritesButton').style.color = 'grey';
    document.getElementById('helloWorld').style.display='block';
    document.getElementById('favoriteDiv').style.display = 'none';
    document.getElementById('helloWorld').style.display='block';
  }

  favoritesClick() {

    document.getElementById('favoritesButton').style.backgroundColor = 'steelblue';
    document.getElementById('favoritesButton').style.color = 'white';
    document.getElementById('resultsButton').style.backgroundColor = 'white';
    document.getElementById('resultsButton').style.color = 'grey';
    document.getElementById('favoriteDiv').style.display='block';
    document.getElementById('helloWorld').style.display = 'none';
    document.getElementById('invalidAddress').style.display = 'none';
  }


  onSearch(currentLoc, state: HTMLInputElement, street: HTMLInputElement, city: HTMLInputElement) {

    document.getElementById('invalidAddress').style.display = 'none';
    document.getElementById('helloWorld').style.display = 'none';
    if(document.getElementById('tab1Tab').classList.contains('active')) {
      document.getElementById('tab1Tab').classList.remove('active');
    }
    if(document.getElementById('tab2Tab').classList.contains('active')) {
      document.getElementById('tab2Tab').classList.remove('active');
    }
    if(document.getElementById('homeTab').classList.contains('active')) {
      document.getElementById('homeTab').classList.remove('active');
    }
    document.getElementById('resultsButton').click();
    document.getElementById('favoriteButton').innerHTML = '<i class="material-icons"> star_border </i>';
    this.move();
    document.getElementById('homeTab').classList.add('active');
    document.getElementById('homeLink').click();
    if (currentLoc.checked) {
      const xmlhttp = new XMLHttpRequest();
      const urlget = 'https://ipapi.co/json';
      xmlhttp.open('GET', urlget, false);
      xmlhttp.overrideMimeType('application/json');
      xmlhttp.send();
      if (xmlhttp.status === 200) {
        const myObj = JSON.parse(xmlhttp.responseText);
        console.log(myObj);
        console.log('testing the op');
        const latitudeCurrent = myObj.latitude;
        const longitudeCurrent = myObj.longitude;
        const cityCurrent = myObj.city;
        const reqJson = {};
        reqJson['lat'] = latitudeCurrent;
        reqJson['long'] = longitudeCurrent;
        reqJson['city'] = cityCurrent;
        reqJson['state'] = myObj.region_code;
        console.log('myobj before send');
        console.log(reqJson);
        this.http.post('http://forecastnode-env.6kvsybmrmn.us-west-1.elasticbeanstalk.com/api/forecastapi', reqJson)
        .subscribe((response) => {
          console.log(response);
          console.log('response of forecast');
          this.end();
          this.onProgress(JSON.parse(JSON.stringify(response)));

        });
      //  console.log(latitudeCurrent);
      //  console.log(longitudeCurrent);
       // console.log(cityCurrent);
    } else {
      document.getElementById('favoriteDiv').style.display = 'none';
      document.getElementById('invalidAddress').style.display = 'block';
      document.getElementById('helloWorld').style.display = 'none';
    }
  } else {

    const jsonToSend = {};
    jsonToSend['city'] = city.value;
    jsonToSend['street'] = street.value;
    jsonToSend['state'] = state.value;

    this.http.post('http://forecastnode-env.6kvsybmrmn.us-west-1.elasticbeanstalk.com/api/posts', jsonToSend)
    .subscribe((resposeData) => {
      console.log(resposeData);
      const responseJson = JSON.parse(JSON.stringify(resposeData));
      if(responseJson.status == 200) {

        this.end();
        document.getElementById('invalidAddress').style.display = 'block';
        document.getElementById('helloWorld').style.display = 'none';






      } else {
        console.log('response to forecast API');
        console.log(responseJson.dataRes);
      const resLat = responseJson.dataRes.lat;
      const resLon = responseJson.dataRes.long;
      this.http.post('http://forecastnode-env.6kvsybmrmn.us-west-1.elasticbeanstalk.com/api/forecastapi', responseJson.dataRes)
        .subscribe((response) => {
          if(JSON.parse(JSON.stringify(response)).status == 200) {
            this.end();
            document.getElementById('invalidAddress').style.display = 'block';
            document.getElementById('helloWorld').style.display = 'none';


          } else {
          console.log(response);
          this.end();
          this.onProgress(JSON.parse(JSON.stringify(response)));
          }
        });
      //const data = resposeData;
      //console.log(data);
      //this.http.get('http://localhost:3000/api/forecastapi', data)
      //.subscribe((respose) => {
       // console.log(respose);
     // });
     // getLatLong = resposeData;
      }
    });
    //console.log(getLatLong);

}
  }
onProgress(jsonRespponse) {
  document.getElementById('helloWorld').style.display = 'block';
  (<HTMLInputElement>document.getElementById('resultsButton')).disabled = false;
  (<HTMLInputElement>document.getElementById('favoritesButton')).disabled = false;

  this.twitterURL = 'https://twitter.com/intent/tweet?text=The current temperature at '+jsonRespponse.returnFor.city+' is '+jsonRespponse.returnFor.temperature+'\xB0F. The weather conditions are '+jsonRespponse.returnFor.summary+'.%0D%23CSCI571WeatherSearch';
  console.log(this.twitterURL);
  document.getElementById('cityInTable').innerHTML = jsonRespponse.returnFor.city;
  document.getElementById('region').innerHTML = jsonRespponse.returnFor.timezone;
  document.getElementById('weather').innerHTML = jsonRespponse.returnFor.summary;
  document.getElementById('temperature').innerText = jsonRespponse.returnFor.temperature;
  if ( jsonRespponse.returnFor.humidity != 0) {
    document.getElementById('humidityVal').innerText = jsonRespponse.returnFor.humidity;
    document.getElementById('humidity').innerHTML =
  '<img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-16-512.png" title="Humidity" class="tableImage" height = 40 width = 40 />';
  } else {
    document.getElementById('humidityTable').style.marginRight = '0';
  }
  if ( jsonRespponse.returnFor.pressure != 0) {
    document.getElementById('pressureVal').innerText = jsonRespponse.returnFor.pressure;
    document.getElementById('pressure').innerHTML =
  '<img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-25-512.png" title="Pressure" class="tableImage" height = 40 width = 40 />';
  } else {
    document.getElementById('pressureTable').style.marginRight = '0';
  }
  if ( jsonRespponse.returnFor.windspeed != 0) {
    document.getElementById('windSpeedVal').innerText = jsonRespponse.returnFor.windspeed;
    document.getElementById('windSpeed').innerHTML =
  '<img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-27-512.png" title="WindSpeed" class="tableImage" height = 40 width = 40 />';
  } else {
    document.getElementById('windTable').style.marginRight = '0';
  }
  if ( jsonRespponse.returnFor.visibility != 0) {
    document.getElementById('visibilityVal').innerText = jsonRespponse.returnFor.visibility;
    document.getElementById('visibility').innerHTML =
  '<img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-30-512.png" title="Visibility" class="tableImage" height = 40 width = 40 />';
  } else {
    document.getElementById('visibilityTable').style.marginRight = '0';
  }
  if ( jsonRespponse.returnFor.cloudcover != 0) {
    document.getElementById('cloudCoverVal').innerText = jsonRespponse.returnFor.cloudcover;
    document.getElementById('cloudCover').innerHTML =
  '<img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-28-512.png" title="CloudCover" class="tableImage" height = 40 width = 40 />';
  } else {
    document.getElementById('cloudTable').style.marginRight = '0';
  }
  if ( jsonRespponse.returnFor.ozone != 0) {
    document.getElementById('ozoneVal').innerText = jsonRespponse.returnFor.ozone;
    document.getElementById('ozone').innerHTML =
  '<img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-24-512.png" title="Ozone" class="tableImage" height = 40 width = 40 />';
  } else {
    document.getElementById('ozonTable').style.marginRight = '0';
  }
  document.getElementById('stateseal').innerHTML = '<img src="' + jsonRespponse.returnFor.stateSeal + '" id="stateSealImage" height=150 width=150>';
  this.response = jsonRespponse;
  this.barChartData[0].data = [jsonRespponse.returnFor.hourlydata[0].temperature];
  for (let i = 1; i <= 23; i++) {
    this.barChartData[0].data.push(jsonRespponse.returnFor.hourlydata[i].temperature);
  }
  this.barChartData[0].label = 'temperature';

  // update the x and y axis of range column graph
  this.options.series[0].data = [];
  const dailyData = jsonRespponse.returnFor.dailydata;
  for (let i = 0; i < 8; i++) {
    const dategiven = new Date(dailyData[i].time * 1000);
    const dateString = dategiven.getDate() + '/' + dategiven.getMonth() + '/' + dategiven.getFullYear();
    this.options.xAxis.categories.push(dateString);
    const tempArr = [];
    tempArr.push(Math.round(dailyData[i].temperatureLow));
    tempArr.push(Math.round(dailyData[i].temperatureHigh));
    this.options.series[0].data.push(tempArr);
  }

  Highcharts.chart('container', this.options);


  console.log(document.getElementById('modal-basic-title'));

  //this.createGraph();


}

forceChartRefresh() {
  if(this.chart123 !== undefined){
    this.chart123.ngOnDestroy();
    this.chart123.chart = this.chart123.getChartBuilder(this.chart123.ctx);
}
}

createGraph() {
 // document.getElementById('tab2Tab').innerHTML = '<highcharts-chart [Highcharts] = "highcharts" [options] = "chartOptions" style = "width: 100%; height: 400px; display: block;"> </highcharts-chart>';
}



secondProgress( checkedElem) {

const jsonResponseConst = JSON.parse(JSON.stringify(this.response));
if (checkedElem.value === 'temp') {
  this.barChartData[0].data = [jsonResponseConst.returnFor.hourlydata[0].temperature];
  for (let i = 1; i <= 23; i++) {
    this.barChartData[0].data.push(jsonResponseConst.returnFor.hourlydata[i].temperature);
  }
  this.barChartData[0].label = 'temperature';
  this.barChartOptions.scales.yAxes[0].scaleLabel.labelString = 'Fahrenheit';
  this.forceChartRefresh();

} else if (checkedElem.value === 'pres') {

  this.barChartData[0].data = [jsonResponseConst.returnFor.hourlydata[0].pressure];
  for (let i = 1; i <= 23; i++) {
    this.barChartData[0].data.push(jsonResponseConst.returnFor.hourlydata[i].pressure);
  }
  this.barChartData[0].label = 'pressure';
  this.barChartOptions.scales.yAxes[0].scaleLabel.labelString = 'Millibars';
  this.forceChartRefresh();

} else if (checkedElem.value === 'humi') {

  this.barChartData[0].data = [jsonResponseConst.returnFor.hourlydata[0].humidity];
  for (let i = 1; i <= 23; i++) {
    this.barChartData[0].data.push(jsonResponseConst.returnFor.hourlydata[i].humidity * 100);
  }
  this.barChartData[0].label = 'humidity';

  this.barChartOptions.scales.yAxes[0].scaleLabel.labelString = '% Humidity';
  this.forceChartRefresh();
  console.log(this.barChartOptions.scales.yAxes[0].scaleLabel.labelString);


} else if (checkedElem.value === 'ozon' ) {


  this.barChartData[0].data = [jsonResponseConst.returnFor.hourlydata[0].ozone];
  for (let i = 1; i <= 23; i++) {
    this.barChartData[0].data.push(jsonResponseConst.returnFor.hourlydata[i].ozone);
  }
  this.barChartData[0].label = 'ozone';
  this.barChartOptions.scales.yAxes[0].scaleLabel.labelString = 'Dobson Units';
  console.log(this.barChartOptions.scales.yAxes[0].scaleLabel.labelString);
  this.forceChartRefresh();


} else if (checkedElem.value === 'visi' ) {

  this.barChartData[0].data = [jsonResponseConst.returnFor.hourlydata[0].visibility];
  for (let i = 1; i <= 23; i++) {
    this.barChartData[0].data.push(jsonResponseConst.returnFor.hourlydata[i].visibility);
  }
  this.barChartData[0].label = 'visibility';
  this.barChartOptions.scales.yAxes[0].scaleLabel.labelString = 'Miles (Maximum 10)';
  console.log(this.barChartOptions.scales.yAxes[0].scaleLabel.labelString);
  this.forceChartRefresh();


} else {


  this.barChartData[0].data = [jsonResponseConst.returnFor.hourlydata[0].windSpeed];
  for (let i = 1; i <= 23; i++) {
    this.barChartData[0].data.push(jsonResponseConst.returnFor.hourlydata[i].windSpeed);
  }
  this.barChartData[0].label = 'windSpeed';
  this.barChartOptions.scales.yAxes[0].scaleLabel.labelString = 'Miles per Hour';
  console.log(this.barChartOptions.scales.yAxes[0].scaleLabel.labelString);
  this.forceChartRefresh();
}

}
  onCheck(state: HTMLInputElement, street: HTMLInputElement, city: HTMLInputElement, checkBox) {

    if(checkBox.target.checked) {
      (<HTMLInputElement>document.getElementById('streetVal')).value = '';
      (<HTMLInputElement>document.getElementById('cityVal')).value = '';
      (<HTMLInputElement>document.getElementById('stateVal')).value = 'state';
      (<HTMLInputElement>document.getElementById('streetVal')).disabled = true;
      (<HTMLInputElement>document.getElementById('cityVal')).disabled = true;
      (<HTMLInputElement>document.getElementById('stateVal')).disabled = true;
      (<HTMLInputElement>document.getElementById('searchButton')).disabled = false;
      document.getElementById('cityError').style.display = 'none';
      document.getElementById('streetError').style.display = 'none';
    } else {
      (<HTMLInputElement>document.getElementById('streetVal')).disabled = false;
      (<HTMLInputElement>document.getElementById('cityVal')).disabled = false;
      (<HTMLInputElement>document.getElementById('stateVal')).disabled = false;
      (<HTMLInputElement>document.getElementById('searchButton')).disabled = true;
    }
  }

  move() {
    let i = 0;
    document.getElementById('myBar').style.width = '0%';
    document.getElementById('myProgress').style.backgroundColor = '#ddd';
    document.getElementById('myProgress').style.display = 'block';
    if (i === 0) {
      i = 1;
      const elem = document.getElementById('myBar');
      let width = 0;
      const id = setInterval(frame, 10);
      function frame() {
        if (width >= 80) {
          clearInterval(id);
          i = 0;
        } else {
          width++;
          console.log(width);
          elem.style.width = width + '%';
        }
      }
    }
  }

  testFunction( getData) {
    console.log('Inside the test function');
    const number = parseInt(getData.point.x);
    console.log(number);
    const jsonResponseRes =  JSON.parse(JSON.stringify(this.response));
    console.log(jsonResponseRes);
    const timeToSend = jsonResponseRes.returnFor.dailydata[number].time;
    const latReq = jsonResponseRes.returnFor.lat;
    const longReq = jsonResponseRes.returnFor.long;
    const reqJson = {};
    reqJson['time'] = timeToSend;
    reqJson['lat'] = latReq;
    reqJson['long'] = longReq;
    reqJson['city'] = jsonResponseRes.returnFor.city;

    this.http.post('http://forecastnode-env.6kvsybmrmn.us-west-1.elasticbeanstalk.com/api/dailyWeather', reqJson)
        .subscribe((response) => {
          console.log(response);
          const responseDaily = JSON.parse(JSON.stringify(response));
          const timeReceiver = new Date(responseDaily.returnData.time * 1000);
          const timeReceiverText =  timeReceiver.getDate() + '/' + timeReceiver.getMonth() + '/' + timeReceiver.getFullYear();
          this.contentHeader = timeReceiverText;
          this.contentCity = responseDaily.returnData.city;
          this.contentTemp = responseDaily.returnData.temperature;
          this.contentSummary = responseDaily.returnData.summary;
          const icon = responseDaily.returnData.icon;
          console.log(icon);
          if(icon == 'clear-day' || icon == 'clear-night') {
            this.contentImageURL = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png';
          } else if(icon == 'rain') {
            this.contentImageURL = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png';
          } else if(icon == 'snow') {
            this.contentImageURL = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png';
          } else if(icon == 'sleet') {
            this.contentImageURL = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png';
          } else if(icon== 'wind') {
            this.contentImageURL = 'https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png';
          } else if(icon == 'fog') {
            this.contentImageURL = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png';
          } else if(icon == 'cloudy') {
            this.contentImageURL = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png';
          } else if(icon == 'partly-cloudy-day' || icon == 'partly-cloudy-night') {
            this.contentImageURL = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png';
          }
          this.contentPrecip = responseDaily.returnData.precipIntensity.toFixed(2);
          this.contentChanceOfRain = Math.trunc(responseDaily.returnData.chanceOfRain);
          this.contentWindSpeed = responseDaily.returnData.windSpeed.toFixed(2);
          this.contentHumidity = Math.trunc(responseDaily.returnData.humidity);
          this.contentVisibility = responseDaily.returnData.visibility;
          this.modalService.open(this.divView,{ windowClass : "my-class", ariaLabelledBy: 'modal-basic-title'},).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });

        });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onFavorite() {
    const innetTextFavorite = document.getElementById('favoriteButton').innerText;
    if(innetTextFavorite == 'star_border') {

    console.log(JSON.parse(JSON.stringify(this.response)).returnFor.stateSeal);

    var ts = Math.round((new Date()).getTime() / 1000);
    const setKey = ts +
    JSON.parse(JSON.stringify(this.response)).returnFor.lat + JSON.parse(JSON.stringify(this.response)).returnFor.long;

    let jsonToLocal = JSON.parse(JSON.stringify(this.response));
    jsonToLocal['state'] = JSON.parse(JSON.stringify(this.response)).returnFor.state;
    jsonToLocal['city'] = JSON.parse(JSON.stringify(this.response)).returnFor.city;
    jsonToLocal['seal'] = JSON.parse(JSON.stringify(this.response)).returnFor.stateSeal;
    jsonToLocal['setKey'] = setKey;


    localStorage.setItem(setKey, JSON.stringify(jsonToLocal));

      this.createFavorite();


    document.getElementById('favoriteButton').innerHTML = '<i class="material-icons" style="color:sandybrown" name="'+setKey+'"> star </i>';
    console.log(this.favorite);
    console.log('this is favorite');
    console.log(this.favorite.length);

    } else {
      const stringDoc = document.getElementById('favoriteButton').innerHTML;
      const doc = new DOMParser().parseFromString(stringDoc, "text/xml");
      const childNodeGet = <HTMLScriptElement>doc.firstChild;
      const searchKey =  childNodeGet.getAttribute("name");
      localStorage.removeItem(searchKey);

      this.createFavorite();


      document.getElementById('favoriteButton').innerHTML = '<i class="material-icons"> star_border </i>';
      console.log(this.favorite);
      console.log(this.favorite.length);

    }

  }

  createFavorite() {

    let keys = Object.keys(localStorage);
    let i = keys.length;
    this.favorite =[];



    while ( i-- ) {
      try {
      if(JSON.parse(localStorage.getItem(keys[i]))) {
        this.favorite.push( JSON.parse(localStorage.getItem(keys[i])) );
      }
  } catch(e) {
    console.log(e);
  }
}
console.log(this.favorite);

  }

  retrieveFavorite(clickData) {
    document.getElementById('invalidAddress').style.display = 'none';
    (<HTMLInputElement>document.getElementById('resultsButton')).disabled = false;
    this.resultsClick();
    console.log(clickData.target.name);
    const getData = localStorage.getItem(clickData.target.name);
    console.log(JSON.parse(getData));
    this.onProgress(JSON.parse(getData));
  }


  changedContent(event) {
    this.autoSuggestions = [];
    console.log(event.target.value);
    const reqestJson = {};
    reqestJson['query'] = event.target.value;
    this.http.post('http://forecastnode-env.6kvsybmrmn.us-west-1.elasticbeanstalk.com/api/autocomplete', reqestJson)
        .subscribe((response) => {
          let arrReceived = [];
          arrReceived = JSON.parse(JSON.stringify(response)).dataArr.dataArr;
          arrReceived.forEach(
            element => {
              this.autoSuggestions.push(element);
            }
          );

        });
  }

  validateStreet( streetIp ) {
    this.searchEnable();
    if(streetIp.target.value == '') {
      document.getElementById('streetError').style.display = 'block';
    } else {
      document.getElementById('streetError').style.display = 'none';

    }
  }

  validateCity( cityIp ) {
    this.searchEnable();
    if(cityIp.target.value == '') {
      document.getElementById('cityError').style.display = 'block';
    } else {
      document.getElementById('cityError').style.display = 'none';


    }
  }


  deleteWish(key) {
    let keyData;
    if(key.target.innerHTML == ' delete ') {
      keyData = key.target.classList[1];
    } else {
      keyData = key.target.name;
    }
    localStorage.removeItem(keyData);

    this.createFavorite();
    document.getElementById('favoriteButton').innerHTML = '<i class="material-icons"> star_border </i>';


  }

  end() {
    let i = 0;
    if (i === 0) {
      i = 1;
      const elem = document.getElementById('myBar');
      let width = 98;
      const id = setInterval(frame, 30);
      function frame() {
        if (width >= 100) {
          clearInterval(id);
          document.getElementById('myProgress').style.display = 'none';
          i = 0;
        } else {
          width++;
          elem.style.width = width + '%';
        }
      }
    }
  }
}

