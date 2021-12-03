import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss']
})
export class ChatPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  messages: Observable<any[]>;
  newMsg = '';
  currentUID: string;

  constructor(
    private auth: AuthService,
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUID = this.auth.currentUser.uid;
    this.messages = this.chatService.getChatMessages(this.currentUID);
  }

  sendMessage() {
    this.chatService.addChatMessage(this.newMsg, this.currentUID)
      .then(() => {
        this.newMsg = '';
        this.content.scrollToBottom();
      });
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }

}
