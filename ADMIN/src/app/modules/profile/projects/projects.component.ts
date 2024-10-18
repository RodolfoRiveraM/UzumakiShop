import { Component, OnInit } from '@angular/core';
import { IconUserModel } from '../../../_metronic/partials';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  users1: Array<IconUserModel> = [
    { name: 'Emma Smith', avatar: './assets/media/avatars/300-6.jpg' },
    { name: 'Rudy Stone', avatar: './assets/media/avatars/300-1.jpg' },
    { name: 'Susan Redwood', initials: 'S', color: 'primary' },
  ];

  users2 = [
    { name: 'Alan Warden', initials: 'A', color: 'warning' },
    { name: 'Brian Cox', avatar: './assets/media/avatars/300-5.jpg' },
  ];

  users3 = [
    { name: 'Mad Masy', avatar: './assets/media/avatars/300-6.jpg' },
    { name: 'Cris Willson', avatar: './assets/media/avatars/300-1.jpg' },
    { name: 'Mike Garcie', initials: 'M', color: 'info' },
  ];

  users4 = [
    { name: 'Nich Warden', initials: 'N', color: 'warning' },
    { name: 'Rob Otto', initials: 'R', color: 'success' },
  ];

  users5 = [
    { name: 'Francis Mitcham', avatar: './assets/media/avatars/300-20.jpg' },
    { name: 'Michelle Swanston', avatar: './assets/media/avatars/300-7.jpg' },
    { name: 'Susan Redwood', initials: 'S', color: 'primary' },
  ];

  users6 = [
    { name: 'Emma Smith', avatar: './assets/media/avatars/300-6.jpg' },
    { name: 'Rudy Stone', avatar: './assets/media/avatars/300-1.jpg' },
    { name: 'Susan Redwood', initials: 'S', color: 'primary' },
  ];

  users7 = [
    { name: 'Meloday Macy', avatar: './assets/media/avatars/300-2.jpg' },
    { name: 'Rabbin Watterman', initials: 'S', color: 'success' },
  ];

  users8 = [
    { name: 'Emma Smith', avatar: './assets/media/avatars/300-6.jpg' },
    { name: 'Rudy Stone', avatar: './assets/media/avatars/300-1.jpg' },
    { name: 'Susan Redwood', initials: 'S', color: 'primary' },
  ];

  users9 = [
    { name: 'Meloday Macy', avatar: './assets/media/avatars/300-2.jpg' },
    { name: 'Rabbin Watterman', initials: 'S', color: 'danger' },
  ];

  description:any;
  page = 4;
  pageSize = 10;
  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:IDropdownSettings = {};
  constructor(
    private toastr: ToastrService,
    public modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    // this.showSuccess();
    // this.modalService.open()

    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  public onChange(event: any) {
    this.description = event.editor.getData();
  }
  loadPage(page: number) {
    console.log(page);
  }
  showSuccess() {
    this.toastr.warning('Hello world!', 'Toastr fun!',{
      timeOut: 20000,
    });
  }
}
