import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'rooms.page.html',
  styleUrls: ['rooms.page.scss']
})
export class RoomsPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  rooms: Observable<any[]>;
  newMsg = '';
  currentUID: string;

  constructor(
    private auth: AuthService,
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUID = this.auth.currentUser.uid;
    this.rooms = this.chatService.getRooms();
    this.rooms.subscribe(rooms => {
      console.log(rooms);
    });
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }

}
