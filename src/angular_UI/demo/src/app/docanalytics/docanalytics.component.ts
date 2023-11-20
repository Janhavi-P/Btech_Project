import { Component, OnInit } from '@angular/core';
import { Chart, ChartDataset } from 'chart.js/auto';
import { DoccountService } from '../doccount.service';
@Component({
  selector: 'app-docanalytics',
  templateUrl: './docanalytics.component.html',
  styleUrls: ['./docanalytics.component.scss']
})
export class DocanalyticsComponent  implements OnInit {
  chartData: ChartDataset[] = [];

  constructor(private count: DoccountService) {}

  ngOnInit(): void {
    this.count.getCountByType().subscribe((data: any) => {
     
      this.createPieChart(data);
    });
  }

  createPieChart(data: any) {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(data), // Use the keys as labels
        datasets: [
          {
            data: Object.values(data), // Use the values as data points
            backgroundColor: ['red', 'green', 'blue'], // Colors for the slices
          },
        ],
      },
      options: {
        
        responsive: true, // Make the chart responsive to its container
    maintainAspectRatio: false, 
      },
    });
  }
}
