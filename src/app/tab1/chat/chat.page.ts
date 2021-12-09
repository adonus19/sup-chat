import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss']
})
export class ChatPage implements OnInit, AfterViewInit {

  @ViewChild(IonContent) content: IonContent;

  messages: Observable<any[]>;
  newMsg = '';
  currentUID: string;
  roomId: string;
  chatUsers: User[];

  constructor(
    private auth: AuthService,
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.route.data.subscribe(users => {
      this.chatUsers = users.users;
    });
    this.currentUID = this.auth.currentUser.uid;
    this.messages = this.chatService.getChatMessages(this.roomId, this.currentUID)
      .pipe(
        map(messages => {
          for (const m of messages) {
            m.fromName = this.getUserFromMsg(m.from, this.chatUsers);
            m.myMsg = m.from === this.currentUID;
          }
          return messages;
        })
      );
  }

  ngAfterViewInit(): void {
    this.content.scrollToBottom();
  }

  sendMessage() {
    console.log(this.newMsg, this.currentUID);
    this.chatService.addChatMessage(this.newMsg, this.currentUID, this.roomId)
      .then(() => {
        this.newMsg = '';
        this.content.scrollToBottom();
      });
  }

  goBack() {
    this.location.back();
  }

  private getUserFromMsg(msgFromId: string, users: User[]): string {
    for (const user of users) {
      if (user.uid == msgFromId) {
        return user.displayName;
      }
    }
    return 'Deleted';
  }

}
