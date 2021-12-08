import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss']
})
export class ChatPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  messages: Observable<any[]>;
  newMsg = '';
  currentUID: string;
  roomId: string;

  constructor(
    private auth: AuthService,
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    // this.currentUID = this.auth.currentUser.uid;
    // this.messages = this.chatService.getChatMessages(this.currentUID);
  }

  sendMessage() {
    this.chatService.addChatMessage(this.newMsg, this.currentUID)
      .then(() => {
        this.newMsg = '';
        this.content.scrollToBottom();
      });
  }

  goBack() {
    this.location.back();
  }

}
