import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { IonContent } from '@ionic/angular';
import { concat, Observable } from 'rxjs';
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

  // messages: Observable<any[]>;
  messages: Message[];
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
          console.log(texts);
          return texts;
        })
      )
      .subscribe(messages => {
        this.messages = messages;
        this.chatService.getLastMessage(this.roomId)
          .pipe(
            map(messages => {
              for (let m of messages) {
                m = this.addValues(m);
              }
              return messages;
            })
          )
          .subscribe(messages => {
            messages.forEach(message => {
              // this is responding twice
              // first with createdAt as null, then with the actaul value
              // something is different about this call
              // maybe try a timeout or see if there is something else that can be done
              console.log(message);
              this.messages.push(message);
            });
          });
      });
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

  private addValues(m: Message) {
    m.fromName = this.getUserFromMsg(m.from, this.chatUsers);
    m.myMsg = m.from === this.currentUID;
    return m;
  }

}
