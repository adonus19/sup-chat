import { Component } from '@angular/core';
import { AuthService, User } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ModalController } from '@ionic/angular';

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
    private modal: ModalController
  ) {
    this.chatService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  addUser(user: User) {
    this.selectedUsers.push(user);
  }

  async createChatRoom() {
    await this.chatService.addChatRoom(this.chatName, this.auth.currentUser.uid);
    this.modal.dismiss();
  }

}
