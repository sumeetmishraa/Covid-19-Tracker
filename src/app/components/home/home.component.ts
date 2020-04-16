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
  globalData: GlobalDataSummary[];

  totalConfirmed = 0;
  totalActive = 0;
  totalRecovered = 0;
  totalDeath = 0;

  /* Pie chart interface */
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  }

  /* column chart interface */
  columnChart: GoogleChartInterface = {
    chartType: 'columnChart'
  }

  CaseTypevalue: number;
  constructor(private dataservice?: dataServicesService) { }

  ngOnInit(): void {
    this.GET_GLOBAL_COVID_DATA();
    this.INIT_GOOGLE_CHART('c');
  }


  /** Get the globaldata (GITHUB REPO)*/
  GET_GLOBAL_COVID_DATA() {
    this.dataservice.getGlobaldata().subscribe(
      {
        next: (result) => {
          console.log(result);
          this.globalData = result;

          result.forEach(element => {
            if (!Number.isNaN(element.confirmed)) {
              this.totalConfirmed += element.confirmed;
              this.totalActive += element.active;
              this.totalDeath += element.death;
              this.totalRecovered += element.recovered;
            }
          });
        }
      }
    )
  }

  /* INITIALIZATION OF GOOGLE PIE AND COLUMN CHART */
  INIT_GOOGLE_CHART(caseType: string) {
    let ARRAY_DATATABLE = [];
    ARRAY_DATATABLE.push(["country", "cases"]);
    console.log("GLOBAL DATA ::"+JSON.stringify(this.globalData));
   let  globalData: GlobalDataSummary[];
    globalData.forEach(item => {
     
      if(caseType == 'c' && item.confirmed > 2000){
      ARRAY_DATATABLE.push([item.country, item.confirmed]);
      this.CaseTypevalue =  item.confirmed;
      }
      if(caseType == 'd' && item.death >1000){
        ARRAY_DATATABLE.push([item.country, item.death]);
        this.CaseTypevalue = item.death;
      }
      if(caseType == 'r' && item.recovered >2000){
        ARRAY_DATATABLE.push([item.country, item.recovered]);
        this.CaseTypevalue = item.recovered;
      }
      if(caseType == 'a' && item.active >2000){
        ARRAY_DATATABLE.push([item.country, item.active]);
        this.CaseTypevalue = item.active;
      }
    });
    console.log("ARRAY_DATATABLE::" + ARRAY_DATATABLE);

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: ARRAY_DATATABLE,
      options: {height: 500},
    };

    this.columnChart = {
      chartType: 'columnChart',
      dataTable: ARRAY_DATATABLE,
      options: { height: 500 },
    };

  }


  /* UPDATE CASE ACCORDING TO CASETYPE */
  UpdateCase(input:HTMLInputElement){
    console.log(input);
    this.INIT_GOOGLE_CHART(input.value);
  }

}
