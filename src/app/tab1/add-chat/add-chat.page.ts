import { Component } from '@angular/core';
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
  error = false;

  constructor(
    private chatService: ChatService,
    private modal: ModalController,
    private userService: UserService
  ) {
    const currentUID = this.userService.currentUser.uid;
    this.userService.getAllUsers(currentUID).subscribe(users => {
      this.users = users;
    });
    this.selectedUsers.push(this.userService.currentUser);
  }

  addUser(event, user: User): void {
    this.error = false;
    if (event.detail.value) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers.splice(this.selectedUsers.indexOf(user), 1);
    }
  }

  async createChatRoom(): Promise<void> {
    if (this.selectedUsers.length < 2) {
      this.error = true;
      return;
    } else {
      this.error = false;
      if (!this.chatName || this.chatName.trim() == '') {
        this.chatName = this.buildRoomName();
      }
      await this.chatService.addChatRoom(this.chatName, this.userService.currentUser.uid, this.selectedUsers);
      this.modal.dismiss({ roomName: this.chatName });
    }
  }

  cancel(): void {
    this.modal.dismiss();
  }

  private buildRoomName(): string {
    let roomName = '';
    const l = this.selectedUsers.length;
    for (let x = 0; x < l; x++) {
      roomName += this.selectedUsers[x].displayName.split(' ')[0];
      if (x != l - 1) {
        roomName += ', ';
      }
    }
    return roomName;
  }

}
