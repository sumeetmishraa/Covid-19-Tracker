import { Component, OnInit } from '@angular/core';
import { dataServicesService } from '../../services/data-services.service';
import { GlobalDataSummary } from '../../models/global-data-model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {
  globalData :GlobalDataSummary[];
 
  totalConfirmed = 0;
  totalActive = 0;
  totalRecovered = 0;
  totalDeath = 0;
  constructor(private dataservice?: dataServicesService) { }

  ngOnInit(): void {
    this.GET_GLOBAL_COVID_DATA();
  }



  /** Get the globaldata (GITHUB REPO)*/
  GET_GLOBAL_COVID_DATA() {
    this.dataservice.getGlobaldata().subscribe(
      {
        next: (result) => {
          console.log(result);
          this.globalData = result;
          
          result.forEach(element => {
            if(!Number.isNaN(element.confirmed)){
              this.totalConfirmed += element.confirmed;
              this.totalActive += element.active;
              this.totalDeath += element.death;
              this.totalRecovered +=element.recovered;
            }
           
          });        
        }

      }


    )
  }

}
