import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Input() sideNavStatus: boolean = false;
  list=[
    {
      number: '1',
      name: 'Home',
      icon: 'fa-solid fa-house'
    },
    {
      number: '2',
      name: 'Approval requests',
      icon: 'fa-solid fa-thumbs-up'
    },
    {
      number: '3',
      name: 'New Folder',
      icon: 'fa-solid fa-folder-plus'
    },
    {
      number: '4',
      name: 'Upload',
      icon: 'fa-solid fa-upload'
    },
    {
      number: '5',
      name: 'My Space',
      icon: 'fa-solid fa-user'
    },
    {
      number: '6',
      name: 'Quick access',
      icon: 'fa-regular fa-clock'
    },
    {
      number: '7',
      name: 'Help',
      icon: 'fa-solid fa-circle-info'
    },
    {
      number: '8',
      name: 'Feedback',
      icon: 'fa-solid fa-comment'
    },
    {
      number: '9',
      name: 'Shared With Me',
      icon: 'fa-brands fa-creative-commons-share'
    }
  ]
  constructor() { }

  ngOnInit(): void {
    
  }

}

