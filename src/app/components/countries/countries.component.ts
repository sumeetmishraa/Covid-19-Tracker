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
  totalConfirmed = 0;
  totalActive = 0;
  totalRecovered = 0;
  totalDeath = 0;
  
  selectedDatewise :Datewise_model[];
  dateWiseData ;

  lineChart: GoogleChartInterface={
    chartType: "LineChart"
  }

  constructor( private dataservice?: dataServicesService) { }

  ngOnInit(): void {
    this.GET_COUNTRIES_DATA();
    this.getDatewiseData();
  }


  GET_COUNTRIES_DATA(){
    this.dataservice.getGlobaldata().subscribe(result=>{
      this.GLOBAL_DATA = result;
      // console.log("GLOBAL SUMMARY DATA::"  +JSON.stringify(this.GLOBAL_DATA));
      this.GLOBAL_DATA.forEach(element => {
        this.COUNTRIES.push(element.country);
        // console.log("TOTAL COUNTRIES::" +JSON.stringify(this.COUNTRIES));
   
      });

    })
  }


  UpdateCountry(country: string){
    // console.log(country);

    this.GLOBAL_DATA.forEach(element=>{
      if(element.country == country){
        this.totalConfirmed = element.confirmed;
        this.totalActive = element.active;
        this.totalDeath = element.death;
        this.totalRecovered = element.recovered;
      }
    })

    this.selectedDatewise = this.dateWiseData[country];
    console.log(this.selectedDatewise);
  }

  getDatewiseData(){
    this.dataservice.togetDateWiseData().subscribe(
      (result)=>{

        this.dateWiseData = result;
      // console.log(result);
    })
  }


  UpdateChart(){
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
