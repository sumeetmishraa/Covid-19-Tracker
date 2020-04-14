import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { GlobalDataSummary } from "../models/global-data-model";
import _ from "lodash";

@Injectable({
  providedIn: "root",
})
export class dataServicesService {
  private globaldataUrl =
    "https://raw.githubusercontent.com/CSSEGISanddata/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-12-2020.csv";

  constructor(private http: HttpClient) {}

  csvJSON(csv) {
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

  /** Function created for fetching the global data */
  getGlobaldata() {
    return this.http.get(this.globaldataUrl, { responseType: "text" }).pipe(
      map((result) => {
        let data: GlobalDataSummary[] = [];
        let jsonData = JSON.parse(this.csvJSON(result));
        let raw = {};

        let groupedData = _.groupBy(jsonData, "Country_Region");
        Object.keys(groupedData).forEach((key) => {
          let cs = {
            country: key,
            confirmed: groupedData[key].reduce(
              (acc, cur) => acc + parseInt(cur.Confirmed),
              0
            ),
            death: groupedData[key].reduce(
              (acc, cur) => acc + parseInt(cur.Deaths),
              0
            ),
            recovered: groupedData[key].reduce(
              (acc, cur) => acc + parseInt(cur.Recovered),
              0
            ),
            active: groupedData[key].reduce(
              (acc, cur) => acc + parseInt(cur.Active),
              0
            ),
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

        //it will return global data object values
        return <GlobalDataSummary[]>Object.values(raw);
      })
    );
  }
}
