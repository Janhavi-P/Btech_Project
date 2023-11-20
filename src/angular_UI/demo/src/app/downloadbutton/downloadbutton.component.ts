import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
@Component({
  selector: 'app-downloadbutton',
  templateUrl: './downloadbutton.component.html',
  styleUrls: ['./downloadbutton.component.scss']
})
export class DownloadbuttonComponent implements AgRendererComponent {
  private params: any;

  agInit(params: any): void {
    this.params = params;
  } refresh(params: any): boolean {
    return false;
  }
  onDownloadClick() {
    // Pass the data to the parent component for download
    if (this.params.onDownloadClick) {
      this.params.onDownloadClick(this.params.data.filename);
    }
  }
}
