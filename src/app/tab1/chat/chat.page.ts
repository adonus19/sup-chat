import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { IonContent } from '@ionic/angular';
import { concat, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { filter, map } from 'rxjs/operators';
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

  // messages: Observable<any[]>;
  messages: any[];
  newMsg = '';
  currentUID: string;
  roomId: string;
  chatUsers: User[];
  firstRun = true;

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

    // const allChatMessages: Message[] = [];

    // gives back an Observable of all the messages but once all messages are in, subscriber closes
    // figure out how to combine this with this.messages for the view
    this.chatService.getAllChatMessages(this.roomId)
      .pipe(
        map(messages => {
          const texts = [];
          messages.forEach(message => {
            const m = this.addValues(message.data());
            texts.push(m);
          });
          this.content.scrollToBottom();
          return texts;
        })
      )
      .subscribe(messages => {
        this.messages = messages;
        this.content.scrollToBottom();
        if (messages.length == 0) {
          this.firstRun = false;
        }
        this.chatService.getLastMessage(this.roomId)
          .pipe(
            filter(messages => {
              if (messages[0]) return messages[0].createdAt != null
            }),
            map(messages => {
              for (let m of messages) {
                m = this.addValues(m);
              }
              return messages;
            })
          )
          .subscribe(messages => {
            if (this.firstRun) {
              this.firstRun = false;
            } else {
              messages.forEach(message => {
                this.messages.push(message);
              });
              setTimeout(() => this.content.scrollToBottom(), 200);
              this.content.scrollToBottom();
            }
          });
        this.content.scrollToBottom();
      });
  }

  ngAfterViewInit(): void {
    this.content.scrollToBottom();
  }

  sendMessage() {
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

  private addValues(m: Message) {
    m.fromName = this.getUserFromMsg(m.from, this.chatUsers);
    m.myMsg = m.from === this.currentUID;
    return m;
  }

}
