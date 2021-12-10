import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { ChatService } from "../services/chat.service";

@Injectable({
  providedIn: 'root'
})
export class ChatUserResolver implements Resolve<any> {

  constructor(
    private chatService: ChatService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const roomName = route.paramMap.get('id');
    return this.chatService.getChatSpecificUsers(roomName);
  }
}
