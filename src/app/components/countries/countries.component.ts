import { Component, OnInit } from '@angular/core';
import { dataServicesService } from '../../services/data-services.service';
import { GlobalDataSummary } from '../../models/global-data-model';
import { Datewise_model } from "../../models/dataWise-model";
import { GoogleChartInterface } from 'ng2-google-charts';


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
  dateWiseData: any ;

  lineChart: GoogleChartInterface={
    chartType: "LineChart"
  }

  constructor( private dataservice?: dataServicesService) { }

  ngOnInit(): void {
    this.GET_COUNTRIES_DATA();
    this.TO_GET_DATEWISE_DATA();
    
  }


  GET_COUNTRIES_DATA(){
    this.dataservice.TO_GET_GLOBAL_DATA_SERVICE().subscribe(result=>{
      this.GLOBAL_DATA = result;
      // console.log("GLOBAL SUMMARY DATA::"  +JSON.stringify(this.GLOBAL_DATA));
      this.GLOBAL_DATA.forEach(element => {
        this.COUNTRIES.push(element.country);
        // console.log("TOTAL COUNTRIES::" +JSON.stringify(this.COUNTRIES));
   
      });

    })
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
    console.log(this.selectedDatewise);
  }


  /*Api call for Datewise data */
  TO_GET_DATEWISE_DATA(){
    this.dataservice.TO_GET_COUNTRY_DATA_DATE_WISE_SERVICE().subscribe(
      (result)=>{
        this.dateWiseData = result;
        this.TO_UPDATE_LINE_CHART();
  
    })
  }


  /* Update the LineChart method */
  TO_UPDATE_LINE_CHART(){
    let datatable = [];
    datatable.push(["cases","dates"]);

    this.selectedDatewise.forEach(item=>{
      datatable.push([item.case , item.date]);
    })

    this.lineChart = {
      chartType: 'LineChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {height: 500},
    };
  }
}
