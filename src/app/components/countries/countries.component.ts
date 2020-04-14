import { Component, OnInit } from '@angular/core';
import { dataServicesService } from '../../services/data-services.service';
import { GlobalDataSummary } from '../../models/global-data-model';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  GLOBAL_DATA: GlobalDataSummary[];
  COUNTRIES: string[] = [];

  constructor( private dataservice?: dataServicesService) { }

  ngOnInit(): void {
    this.GET_COUNTRIES_DATA();
  }


  GET_COUNTRIES_DATA(){
    this.dataservice.getGlobaldata().subscribe(result=>{
      this.GLOBAL_DATA = result;
      this.GLOBAL_DATA.forEach(element => {
        this.COUNTRIES.push(element.country);
      });

    })
  }


  UpdateCountry(country: string){
    // console.log(country);

  }

}
