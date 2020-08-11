import { Component } from '@angular/core';
import { Event, ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DD Identity';
  public isWelcomeScreen = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/welcome') {
          this.isWelcomeScreen = true;
        } else {
          this.isWelcomeScreen = false;
        }
      }
    });
  }

}
