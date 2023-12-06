import { Component,AfterViewInit, OnInit, EventEmitter, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Chart, ChartDataset } from 'chart.js/auto';
import { FolderService } from '../folder.service';
import { FileUploadService } from '../file-upload.service';
import { LoginempService } from '../loginemp.service';
import { Router,NavigationExtras   } from '@angular/router';
@Component({
  selector: 'app-employeeanalytics',
  templateUrl: './employeeanalytics.component.html',
  styleUrls: ['./employeeanalytics.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ width: '250px' })),
      state('out', style({ width: '50px' })),
      transition('in => out, out => in', animate('300ms ease-in-out')),
    ]),
  ],
})
export class EmployeeanalyticsComponent implements OnInit, AfterViewInit   {
  
  chart: any;
  fileData: any;
  chartData: ChartDataset[] = [];
  showText: boolean = false;
  totalFiles: number = 0;
  totalFolders:number=0;



  countAnimationState: string = 'start';

  @Output() sideNavToggled = new EventEmitter<boolean>();
  showFirstMatCard = true;

  menuState: string = 'out';
  menuItems: any[] | undefined; // Define your menu items here

  loggedInUser:string='';
  private loggedInId: number | undefined ;
  message: string | null = null;
  profilePictureData: Uint8Array | Blob | null | undefined;
  profilePictureUrl: SafeUrl | undefined;

  constructor(private folderService: FolderService,private fileUploadService: FileUploadService, private router: Router,private emplogin:LoginempService,private sanitizer: DomSanitizer) {}
  ngOnInit(): void {
    // Retrieve the user's name from the service
    this.loggedInUser = this.emplogin.getLoggedInUser();
    this.loggedInId = this.emplogin.getLoggedInId();
    console.log("empid:",this.loggedInId);
    const profilePictureData = this.emplogin.getProfilePictureData();
    //console.log("profilepicdata",profilePictureData);
    if (profilePictureData) {
      this.profilePictureUrl = this.createProfilePictureUrl(profilePictureData as Blob);
            //console.log("profilepicurl",this.profilePictureUrl);
            

    }
    if (this.loggedInId !== undefined) {
      this.fileUploadService.getCountDocTypeEmp(this.loggedInId).subscribe(
        (data: any) => {
          console.log('Data received from API:', data);
          this.createPieChart(data.fileTypeCounts);
          this.animateCount(data.totalFiles); // Animate the totalFiles property
          this.animateCount2(data.totalFolders); 
         console.log('Data received from API:', data.totalFiles);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    } else {
      console.error('Logged In ID is undefined');
    }

    if (this.loggedInId !== undefined) {
      this.fileUploadService.getFileDataByDate(this.loggedInId).subscribe(
        (data: any) => {
          console.log(data);
          this.fileData = data;
        this.renderLineChart(data);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    } else {
      console.error('Logged In ID is undefined');
    }
  }
  renderLineChart(data2: any) {
    // console.log(data2);
    // if (!data2 || !data2.dateFileCounts) {
    //   console.error('Invalid data structure received from API.');
    //   return;
    // }
    if (!data2) {
      console.error('No data received from API.');
      return;
    }
  
    if (!data2.dateFileCounts) {
      console.error('Invalid data structure received from API. Expected "dateFileCounts" property.');
      return;
    }
  
  
    const dateFileCounts = data2.dateFileCounts;
  
    const labels = dateFileCounts.map((entry: any) => entry.date);
    const dataPoints = dateFileCounts.map((entry: any) => entry.count);
  
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'File Count',
          fill: false,
          lineTension: 0.5,
          backgroundColor: 'rgba(255, 255, 255)',
          borderColor: 'rgba(2, 39, 76)',
          data: dataPoints,
        }
      ]
    };
  
    const options = {
      // ... other chart options
    };
  
    const ctx = document.getElementById('lineChart');
    if (ctx instanceof HTMLCanvasElement) {
      // Check if the chart instance already exists and destroy it
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }
  
      this.chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
      });
    } else {
      console.error('Canvas element not found');
    }
  }  ngAfterViewInit(): void {
    if (this.loggedInId !== undefined) {
      this.fileUploadService.getCountDocTypeEmp(this.loggedInId).subscribe((data: any[]) => {
        this.createPieChart(data);
      });
    } else {
      console.error('Logged In ID is undefined');
    }
  }


  animateCount(targetCount: number): void {
    const interval = 100; // Update every 100ms
    const steps = targetCount / (500 / interval); // Adjust the duration based on the animation time

    let currentCount = 0;
   
    const countInterval = setInterval(() => {
      this.totalFiles = Math.ceil(currentCount);
      currentCount += steps;

      if (currentCount >= targetCount) {
        this.totalFiles = targetCount;
        clearInterval(countInterval);
        this.countAnimationState = 'end'; // Trigger the end state of the animation
      }
    }, interval);
    
  }
  animateCount2(targetCount: number): void {
    const interval = 100; // Update every 100ms
    const steps = targetCount / (500 / interval); // Adjust the duration based on the animation time

    let currentCount = 0;
   
    const countInterval = setInterval(() => {
      this.totalFolders = Math.ceil(currentCount);
      currentCount += steps;

      if (currentCount >= targetCount) {
        this.totalFolders = targetCount;
        clearInterval(countInterval);
        this.countAnimationState = 'end'; // Trigger the end state of the animation
      }
    }, interval);
    
  }
  createPieChart(data: any) {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element not found.');
      return;
    }
  
    // Check if the chart instance already exists and destroy it
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }
  
    // Check if the expected properties are present in the data object
    if ('fileTypeCounts' in data && 'totalFiles' in data) {
      const fileTypeCounts = data.fileTypeCounts;
      
      const labels = fileTypeCounts.map((item: any) => item.fileType);
      const counts = fileTypeCounts.map((item: any) => item.count);
  
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              data: counts,
              backgroundColor: ['red', 'green', 'blue', 'yellow', 'grey'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                font: {
                  family: 'Arial',
                  size: 14,
                },
                color: 'black',
              },
            },
          },
        },
      });
    } else {
      console.error('Invalid data structure received from API.');
    }
  }
  
  private createProfilePictureUrl(data: Blob | null): SafeUrl {
    // console.log("profilepicurl",data);
    // console.log("profilepicurl",typeof data);
    if (data instanceof Blob) {
      // The data is already a Blob, proceed as usual
      const blobUrl = URL.createObjectURL(data);
      return this.sanitizer.bypassSecurityTrustUrl(blobUrl);
    } else if (typeof data === 'string') {
     // console.log("inside string");
      // Convert the base64-encoded string to a Blob
      const binaryData = atob(data);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }
  
      const blob = new Blob([arrayBuffer], { type: 'image/jpeg' }); // Adjust the type if necessary
      const blobUrl = URL.createObjectURL(blob);
      return this.sanitizer.bypassSecurityTrustUrl(blobUrl);
    }
    return '';
  }
 
  logout()
  {
    const navigationExtras: NavigationExtras = { skipLocationChange: true };
    this.router.navigate(['/login'], { replaceUrl: true });
  }
getLoggedInId():number | undefined
{
  return this.loggedInId;
}
navigateToEditProfile() {
  // Navigate to the EditprofileComponent and pass the loggedInId as a route parameter
  this.router.navigate(['/edit-profile', { id: this.loggedInId }]);
}
toggleMenu() {
  this.menuState = this.menuState === 'out' ? 'in' : 'out';
  this.sideNavToggled.emit(this.menuState === 'in');
  console.log('Menu State:', this.menuState);
} 

}
