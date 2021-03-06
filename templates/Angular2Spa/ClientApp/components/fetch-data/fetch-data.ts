import * as ng from 'angular2/core';
import { Http } from 'angular2/http';

@ng.Component({
  selector: 'fetch-data'
})
@ng.View({
  template: require('./fetch-data.html')
})
export class FetchData {
    public forecasts: WeatherForecast[];

    constructor(http: Http) {
        http.get('/api/SampleData/WeatherForecasts').subscribe(result => {
            this.forecasts = result.json();
        });
    }
}

interface WeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}
