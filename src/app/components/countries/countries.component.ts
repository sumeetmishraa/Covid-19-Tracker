import { Component, OnInit } from '@angular/core';
import { dataServicesService } from '../../services/data-services.service';
import { GlobalDataSummary } from '../../models/global-data-model';
import { Datewise_model } from "../../models/dataWise-model";
import { GoogleChartInterface } from 'ng2-google-charts';
import { map } from "rxjs/operators";
import { merge } from 'rxjs';


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  GLOBAL_DATA: GlobalDataSummary[];
  COUNTRIES: string[] = [];
  
  totalConfirmed: number = 0;
  totalActive: number = 0;
  totalRecovered: number =0;
  totalDeath : number= 0;
  
  selectedDatewise: Datewise_model[];
  dateWiseData;

  lineChart: GoogleChartInterface = {
    chartType: "LineChart"
  }

  constructor( private dataservice?: dataServicesService) { }

  ngOnInit(): void {
    
    //Merging both the subscriptions
    merge(
      this.dataservice.TO_GET_COUNTRY_DATA_DATE_WISE_SERVICE().pipe(
        map(result=>{
          this.dateWiseData = result;
        })
      ),
  
      this.dataservice.TO_GET_GLOBAL_DATA_SERVICE().pipe(
        map(result=>{
          this.GLOBAL_DATA = result;
          this.GLOBAL_DATA.forEach(cs => {
            this.COUNTRIES.push(cs.country);
          });
        })
      )
    ).subscribe({
      complete: ()=>{
      this.SELECETD_COUNTRY_UPDATE("India");
      }
    })
  }




  /* Update the LineChart method */
  TO_UPDATE_LINE_CHART(){
    let datatable = [];
    datatable.push(["dates","cases"]);
    console.log("chart data array::"+JSON.stringify(this.selectedDatewise));
    this.selectedDatewise.forEach(cs=>{
      datatable.push([cs.date , cs.case]);
    })

    this.lineChart = {
      chartType: 'LineChart',
      dataTable: datatable,
      options: { height: 500,
      animation:{
        duration: 1000,
        easing: "out"
      } ,
    },
    };
  }


  /* Selected country data will update */
  SELECETD_COUNTRY_UPDATE(country: string){
    this.GLOBAL_DATA.forEach(element=>{
      if(element.country == country){
        this.totalConfirmed = element.confirmed;
        this.totalActive = element.active;
        this.totalDeath = element.death;
        this.totalRecovered = element.recovered;
      }
    })
    this.selectedDatewise = this.dateWiseData[country];
    this.TO_UPDATE_LINE_CHART();
 
  }

}
