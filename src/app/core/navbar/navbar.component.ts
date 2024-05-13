import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { deleteLocalStorage, getToken } from "../../shared/functions";
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentURL!: string;

  get user(): any {
    return jwtDecode(getToken());
  }

  get username() {
    return this.user?.username;
  }

  constructor(private router: Router) {
    this.router.events.subscribe(() => this.currentURL = this.router.url);
  }

  signOut() {
    deleteLocalStorage('token');
    this.router.navigateByUrl('/sign-in');
  }
}
