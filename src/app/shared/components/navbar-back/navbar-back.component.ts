import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar-back',
  standalone: true,
  imports: [],
  templateUrl: './navbar-back.component.html',
  styleUrl: './navbar-back.component.scss'
})
export class NavbarBackComponent {
  @Input({ required: true }) URL!: string;

  constructor(private readonly router: Router) {}

  navigateTo() {
    this.router.navigateByUrl(this.URL);
  }
}
