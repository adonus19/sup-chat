import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { map } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { Message } from '../../models/message.model';
import { UserService } from 'src/app/services/user.service';

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
    private location: Location,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.route.data.subscribe(users => {
      this.chatUsers = users.users;
    });
    this.currentUID = this.userService.currentUser.uid;

    const allChatMessages: Message[] = [];

    // gives back an Observable of all the messages but once all messages are in, subscriber closes
    // figure out how to combine this with this.messages for the view
    this.chatService.getAllChatMessages(this.roomId)
      .pipe(
        map(messages => {
          messages.forEach(message => {
            const m = message.data();
            m.fromName = this.getUserFromMsg(m.from, this.chatUsers);
            m.myMsg = m.from === this.currentUID;
            allChatMessages.push(m);
          })
          // for (const m of messages) {
          //   m.fromName = this.getUserFromMsg(m.from, this.chatUsers);
          //   m.myMsg = m.from === this.currentUID;
          // }
          return allChatMessages;
        })
      )

    // this will give me all messages everytime a new message is added, not just the new message
    this.messages = this.chatService.getChatMessages(this.roomId)
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
