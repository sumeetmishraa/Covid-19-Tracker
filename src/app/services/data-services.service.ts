import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from '../models/global-data-model';

@Injectable({
  providedIn: 'root'
})
export class dataServicesService {


  private globaldataUrl = 'https://raw.githubusercontent.com/CSSEGISanddata/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-12-2020.csv';

  constructor(private http: HttpClient) { }


  /** Function created for fetching the global data */
  getGlobaldata() {
    return this.http.get(this.globaldataUrl, { responseType: 'text' }).pipe(
      map(result => {

        let data: GlobalDataSummary[] = [];
        let rows = result.split('\n');
        let raw = {};
        
        rows.splice(0,1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\s)/);
         
          //Merging the objects 
          let cs = {
            country : cols[3],
            confirmed : +cols[7],
            death: +cols[8],
            recovered : +cols[9],
            active: +cols[10]
          }

          let temp :GlobalDataSummary = raw[cs.country];

          //if there is object
          if(temp){
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.death = cs.death + temp.death;
            temp.recovered = cs.recovered + temp.recovered;
            temp.active = cs.active + temp.active;

            raw[cs.country] = temp;
          }
          else {
            // if there is no object then insert cs
            raw[cs.country] = cs;
          }

      });

        //it will return global data object values
        return <GlobalDataSummary[]>Object.values(raw);
      })
    )
  }
}
