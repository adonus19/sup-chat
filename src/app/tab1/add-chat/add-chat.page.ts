import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ModalController } from '@ionic/angular';
import { User } from '../../models/user.model'
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-chat',
  templateUrl: 'add-chat.page.html'
})
export class AddChatPage {

  users: User[];
  selectedUsers: User[] = [];
  chatName: string;

  constructor(
    private chatService: ChatService,
    private auth: AuthService,
    private modal: ModalController,
    private userService: UserService
  ) {
    const currentUID = this.userService.currentUser.uid;
    this.chatService.getAllUsers(currentUID).subscribe(users => {
      this.users = users;
    });
  }

  addUser(event, user: User) {
    if (event.detail.value) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers.splice(this.selectedUsers.indexOf(user), 1);
    }
  }

  async createChatRoom() {
    await this.chatService.addChatRoom(this.chatName, this.userService.currentUser.uid, this.selectedUsers);
    this.modal.dismiss();
  }

  cancel() {
    this.modal.dismiss();
  }

}
