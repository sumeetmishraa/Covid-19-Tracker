import { Component, OnInit, Input } from '@angular/core';
import { GlobalDataSummary } from '../../models/global-data-model';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css']
})
export class DashboardCardComponent implements OnInit {


  @Input('totalConfirmed')
  totalConfirmed;
    
  @Input('totalActive')
  totalActive;
   
  @Input('totalDeath')
  totalDeath;
   
  @Input('totalRecovered')
  totalRecovered;

  constructor() { }

  ngOnInit(): void {
  }

}
