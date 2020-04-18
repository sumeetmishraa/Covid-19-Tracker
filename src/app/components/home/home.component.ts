import { Component, OnInit } from '@angular/core';
import { dataServicesService } from '../../services/data-services.service';
import { GlobalDataSummary } from '../../models/global-data-model';
import { GoogleChartInterface } from 'ng2-google-charts';

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

  globalData: GlobalDataSummary[];

  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  }

  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  }

  constructor(private dataservice?: dataServicesService) { }


  /* Charts Integration */
  InitChart(caseType: string) {
    let datatable = [];
    datatable.push(["country", "cases"]);
      this.globalData.forEach(cs => {
        let value: number;
        if(caseType == "c" && cs.confirmed > 2000){
          value = cs.confirmed;
        }
        if(caseType == "d" && cs.death > 1000){
          value = cs.death;
        }
        if(caseType == "r" && cs.recovered > 2000){
          value =cs.recovered;
        }
        if(caseType == "a" && cs.active > 2000){
          value =cs.active;
        }
        
        datatable.push([
          cs.country, value
        ]);
       
    });
    console.log("datatable::" +JSON.stringify(datatable));

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: datatable,
      options: { height: 500,
        animation:{
          duration: 1000,
          easing: "out"
        }, 
      },
    };

    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: datatable,
      options: { height: 500 ,
        animation:{
          duration: 1000,
          easing: "out"
        },
      },
    };

  }


  ngOnInit(): void {
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
        this.InitChart("c");
      }
    })

  }


  updateChart(input: HTMLInputElement){
    console.log("Update chart value::"+input.value)
    this.InitChart(input.value);
  }

}
