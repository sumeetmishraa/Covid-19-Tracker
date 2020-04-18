import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { GlobalDataSummary } from "../models/global-data-model";
import { Datewise_model } from "../models/dataWise-model";
import _ from "lodash";

@Injectable({
  providedIn: "root",
})
export class dataServicesService {
  private globaldataUrl = "https://raw.githubusercontent.com/CSSEGISanddata/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-17-2020.csv";
  private globalDateWiseUrl = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"


  constructor(private http: HttpClient) { }


  /* ====== CONVERTING CSV DATA INTO JSON =======*/
  CSV_TO_JSON(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return JSON.stringify(result); //JSON
  }


  /* ======= TO GET GLOBAL DATA SERVICE ==========*/
  TO_GET_GLOBAL_DATA_SERVICE() {
    return this.http.get(this.globaldataUrl, { responseType: "text" }).pipe(
      map((result) => {
        let data: GlobalDataSummary[] = [];
        let jsonData = JSON.parse(this.CSV_TO_JSON(result));
        let raw = {};

        let GROUPED_DATA = _.groupBy(jsonData, "Country_Region");
        Object.keys(GROUPED_DATA).forEach((key) => {
          let cs = {
            country: key,
            confirmed: GROUPED_DATA[key].reduce(
              (acc, cur) => acc + parseInt(cur.Confirmed), 0),

            death: GROUPED_DATA[key].reduce(
              (acc, cur) => acc + parseInt(cur.Deaths), 0),

            recovered: GROUPED_DATA[key].reduce(
              (acc, cur) => acc + parseInt(cur.Recovered), 0),

            active: GROUPED_DATA[key].reduce(
              (acc, cur) => acc + parseInt(cur.Active), 0),
          };
          let temp: GlobalDataSummary = raw[cs.country];

          //if there is object
          if (temp) {
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.death = cs.death + temp.death;
            temp.recovered = cs.recovered + temp.recovered;
            temp.active = cs.active + temp.active;

            raw[cs.country] = temp;
          } else {
            // if there is no object then insert cs
            raw[cs.country] = cs;
          }
        });

        //It will return global data object values
        return <GlobalDataSummary[]>Object.values(raw);
      })
    );
  }


  /* ==== TO GET COUNTRY DATA DATE WISE SERVICE ========*/
  TO_GET_COUNTRY_DATA_DATE_WISE_SERVICE() {
    return this.http.get(this.globalDateWiseUrl, { responseType: "text" })
      .pipe(
        map(result => {
          // splits rows with comma
          let rows = result.split("\n");
          let mainData = {};

          //Holding Header values 
          let header = rows[0];
          let dates = header.split(/,(?=\s)/);
          console.log(dates);

          //get all the dates from the header
          dates.splice(0, 4);
          // console.log(dates);

          rows.splice(0, 1);
          rows.forEach(row => {
            let columns = row.split(/,(?=\s)/);
            let country = columns[1];
            columns.splice(0, 4);
            // console.log(columns, country);
            mainData[country] = [];


            //mapping of number of cases with header(date)
            columns.forEach((value, index) => {

              let DW: Datewise_model = {
                case: +value,
                country: country,
                date: new Date(Date.parse(dates[index]))
              }

              mainData[country].push(DW);
              console.log(mainData);
            })
          })

        }))
  }
}
