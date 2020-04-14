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
  constructor(private dataservice?: dataServicesService) { }



  ngOnInit(): void {
    this.GET_GLOBAL_COVID_DATA();
    this.INIT_GOOGLE_CHART();
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
  INIT_GOOGLE_CHART() {
    let ARRAY_DATATABLE = [];
    ARRAY_DATATABLE.push(["country", "case"]);

    this.globalData.forEach(item => {
      if (item.confirmed > 2000) {
        ARRAY_DATATABLE.push([item.country, item.confirmed]);
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

}
