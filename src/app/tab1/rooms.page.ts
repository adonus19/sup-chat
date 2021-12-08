import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { AuthService, User } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { AddChatPage } from './add-chat/add-chat.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'rooms.page.html',
  styleUrls: ['rooms.page.scss']
})
export class RoomsPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  rooms: Observable<string[]>;
  newMsg = '';
  currentUID: string;

  constructor(
    private auth: AuthService,
    private chatService: ChatService,
    private router: Router,
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.currentUID = this.auth.currentUser.uid;
    this.rooms = this.auth.listenForUserUpdates();
  }

  async addChat() {
    const chatModal = await this.modal.create({
      component: AddChatPage
    });
    await chatModal.present();
  }

  goToChat(name: string) {
    this.router.navigate([`tabs/rooms/${name}`]);
  }

}


// 1. see what collections[0].id gets me
    // returns the name of the collection (its name is its ID)
// 2. have getCollections return a list of rooms that the user has access to
// 3. figure out how to subscribe to chat rooms
// 4. Enter chat rooms
// 5. check on DB rules to see if access can be added that way or if I should stick with rooms array

// Other things to consider
  // what to do if the main rooms doc runs out of fields (20,000 is the limit)
    // this may not be a problem since I'm only using the doc a way to trigger the valueChanges observable, I don't actually need this data
    // since I'm already getting a list of the collections here from the getCollections cloud function
    // confirm this with your functions and refactor if needed to not rely on the chats field
  // how to create admins
  // delete chat rooms
