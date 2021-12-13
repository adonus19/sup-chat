import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: 'edit-user.page.html'
})
export class EditUserPage implements OnInit {

  user: User;

  constructor(
    private userService: UserService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.user = this.userService.currentUser;
  }

  cancel(): void {
    this.location.back();
  }

}
