import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FriendResponse } from '../interfaces/friend-response';
import { FriendInsert } from '../interfaces/friend-insert';
import { FriendUpdate } from '../interfaces/friend-update';
import { Page } from '../interfaces/page';

const BACKEND_API_URL = "http://localhost:8080"

@Injectable({
    providedIn: 'root'
})
export class FriendService {
    http: HttpClient = inject(HttpClient);

    insertFriend(friendInsertDTO: FriendInsert) {
        return this.http.post<FriendResponse>(`${BACKEND_API_URL}/api/friends`, friendInsertDTO);
    }

    updateFriend(friendUpdateDTO: FriendUpdate, friendId: string) {
        return this.http.put<FriendResponse>(`${BACKEND_API_URL}/api/friends/${friendId}`, friendUpdateDTO);
    }

    deleteFriend(friendId: string) {
        return this.http.delete(`${BACKEND_API_URL}/api/friends/${friendId}`);
    }

    getFriendById(friendId: string) {
        return this.http.get<FriendResponse>(`${BACKEND_API_URL}/api/friends/${friendId}`);
    }

    getAllFriends() {
        return this.http.get<FriendResponse[]>(`${BACKEND_API_URL}/api/friends`);
    }

    getPaginatedFriends(pageNumber: number, pageSize: number) {
        return this.http.get<Page>(`${BACKEND_API_URL}/api/friends/paginated?pageNo=${pageNumber}&size=${pageSize}`);
    }
}
