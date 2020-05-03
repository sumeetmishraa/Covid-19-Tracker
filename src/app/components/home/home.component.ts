import { Component, OnInit } from '@angular/core';
import { dataServicesService } from '../../services/data-services.service';
import { GlobalDataSummary } from '../../models/global-data-model';

import { CASETYPE } from "../../enum/enum-config";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalRecovered = 0;
  totalDeath = 0;

  showSpinner = false;
  datatable= [];

  globalData: GlobalDataSummary[];
  

  chart ={
    PieChart: 'PieChart',
    ColumnChart: 'ColumnChart',
    LineChart: 'LineChart',
    height: 500,
    options: { 
      animation:{
        duration: 1000,
        easing: "out",
      }, 
      is3D: true
    }
  }
 

  constructor(private dataservice?: dataServicesService) { }


  /* Charts Integration */
  InitChart(caseType: string) {
  console.log("CASETYPE::"+caseType);
    this.datatable = [];
    // this.datatable.push(["country", "cases"]);
      this.globalData.forEach(cs => {
        let value: number;
      
        if(caseType == CASETYPE.CONFIRMRED && cs.confirmed > 2000){
          value = cs.confirmed;
          console.log("CASETYPE AND VALUE::"+caseType + '' +value);
        }
        else if(caseType == CASETYPE.DEATH && cs.death > 1000 ){
          value = cs.death;
          console.log("CASETYPE AND VALUE::"+caseType + '' +value);
        }
        else if(caseType == CASETYPE.RECOVERED && cs.recovered > 2000){
          value = cs.recovered;
          console.log("CASETYPE AND VALUE::"+caseType + '' +value);
        }
        else if(caseType == CASETYPE.ACTIVE && cs.active > 2000){
          value = cs.active;
          console.log("CASETYPE AND VALUE::"+caseType + '' +value);
        }
        
        this.datatable.push([
          cs.country, value
        ]);
       
    });
    console.log("datatable::" +JSON.stringify(this.datatable));

  }


  ngOnInit(): void {
    this.showSpinner= false;
    this.dataservice.TO_GET_GLOBAL_DATA_SERVICE().subscribe({
      next: (result) => {
        this.globalData = result;
        result.forEach(cs => {
          if (!Number.isNaN(cs.confirmed)) {
            this.totalConfirmed += cs.confirmed;
            this.totalActive += cs.active;
            this.totalDeath += cs.death;
            this.totalRecovered += cs.recovered;
          }
        });
        
      this.InitChart(CASETYPE.CONFIRMRED);
      }
    })

  }


  updateChart(input: HTMLInputElement){
    console.log("Update chart value::"+input.value)
    this.InitChart(input.value);

  }

}
