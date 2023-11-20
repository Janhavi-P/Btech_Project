import { Component } from '@angular/core';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent {
  folders: any[] = [
    { name: 'Folder 1', isChecked: false,             timestamp: '2023-10-25 14:30:00' },
    { name: 'Folder 2', isChecked: false,             timestamp: '2023-10-26 09:15:00' },
    { name: 'Folder 3', isChecked: false,             timestamp: '2023-10-27 16:45:00' },
  ];
}
