import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenClaims } from '../interfaces/token-claims';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenName = 'birthday_keeper_token';

  // Save the given token to the local storage 
  saveTokenToStorage(token: string): void {
    localStorage.setItem(this.tokenName, token);
  }

  // Returns the token from the local storage
  getToken() {
    return localStorage.getItem(this.tokenName);
  }

  // If a token exists return the decoded token claims
  getDecodedToken() {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken = jwtDecode(token) as unknown as TokenClaims;
    return decodedToken;
  }

  // Checks if the token in the local storage has expired
  isTokenExpired(): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) {
      return true;
    }

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTimeInSeconds;
  }

  // Checks if a token exists and if it has expired.
  isUserAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return this.isTokenExpired();
  }

  // Checks if the token in the local storage has the provided role.
  hasRole(role: string): boolean {
    const decodedToken = this.getDecodedToken();

    if (!decodedToken) {
      return false;
    }

    return decodedToken.role === role;
  }
}
