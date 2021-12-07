import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { AddChatPage } from './add-chat/add-chat.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'rooms.page.html',
  styleUrls: ['rooms.page.scss']
})
export class RoomsPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  rooms = [];
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
    this.chatService.getRooms().subscribe(() => {
      console.log('there was an update');
      this.chatService.getRoomNames().subscribe(names => {
        console.log(names);
        this.rooms = names;
      });
    });
  }

  async addChat() {
    const chatModal = await this.modal.create({
      component: AddChatPage
    });
    await chatModal.present();
  }

}
