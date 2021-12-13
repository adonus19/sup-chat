import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { AddChatPage } from './add-chat/add-chat.page';
import { Message } from '../models/message.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'rooms.page.html',
  styleUrls: ['rooms.page.scss']
})
export class RoomsPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  // rooms = [];
  rooms: { room: string; messages: Message[] }[] = [];
  newMsg = '';
  roomNames: string[] = [];
  userImage = '';

  constructor(
    private chatService: ChatService,
    private router: Router,
    private modal: ModalController,
    private userService: UserService
  ) { }

  ngOnInit() {
    // get all of the user's rooms once and does not listen for changes
    this.userService.getUserRooms().subscribe(async userRooms => {
      this.userImage = this.userService.currentUser.photoURL;
      this.roomNames = userRooms;
      if (this.roomNames) {
        const roomsMessages = this.chatService.getUserRoomsObservables(userRooms);
        const length = roomsMessages.length;
        for (let x = 0; x < length; x++) {
          this.rooms.push({
            room: this.checkRoomNameAndFormat(roomsMessages[x].room),
            messages: []
          });
          roomsMessages[x].messages.subscribe(messages => {
            this.rooms[x].messages = messages;
          });
        }
      }
    });


    this.userService.listenForUserRoomUpdates().subscribe(userRooms => {
      if (userRooms.length) {
        const userRoomsLength = userRooms.length
        // check if there is a new room
        if (this.roomNames.length !== userRoomsLength) {
          this.roomNames = userRooms;
          // if new room, subscribe to the new room
          this.rooms.push({
            room: this.checkRoomNameAndFormat(userRooms[userRoomsLength - 1]),
            messages: []
          });
          this.chatService.getLastMessage(userRooms[userRoomsLength - 1]).subscribe(messages => {
            this.rooms[userRoomsLength - 1].messages.push(messages[0]);
          });
        }
      }
    });
  }

  async addChat() {
    const chatModal = await this.modal.create({
      component: AddChatPage
    });
    await chatModal.present();
    const { data } = await chatModal.onDidDismiss();
    if (data) {
      this.router.navigate([`tabs/rooms/${data.roomName}`]);
    }
  }

  goToChat(name: string) {
    this.router.navigate([`tabs/rooms/${name}`]);
  }

  goToEditProfile() {
    this.router.navigate([`tabs/rooms/users/${this.userService.currentUser.displayName}`]);
  }

  private checkRoomNameAndFormat(name: string) {
    const userName = this.userService.currentUser.displayName;
    if (name.split(', ').length > 1) {
      if (name.match(userName)) {
        return name.replace(userName, '').replace(', ', '');
      } else if (name.match(userName.split(' ')[0])) {
        return name.replace(userName.split(' ')[0], 'Me');
      }
    }
    return name;
  }

}


// 1. see what collections[0].id gets me
    // returns the name of the collection (its name is its ID)
// 5. check on DB rules to see if access can be added that way or if I should stick with rooms array

// Other things to consider
  // what to do if the main rooms doc runs out of fields (20,000 is the limit)
    // this may not be a problem since I'm only using the doc a way to trigger the valueChanges observable, I don't actually need this data
    // since I'm already getting a list of the collections here from the getCollections cloud function
    // confirm this with your functions and refactor if needed to not rely on the chats field
  // how to create admins
  // delete chat rooms
