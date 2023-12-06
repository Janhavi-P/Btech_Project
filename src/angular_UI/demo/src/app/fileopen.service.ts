import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileopenService {

  openFile(fileUrl: string): void {
    window.open(fileUrl, '_blank');
}
}