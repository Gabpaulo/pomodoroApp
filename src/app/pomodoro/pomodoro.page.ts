import { Component, NgZone, OnInit } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.page.html',
  styleUrls: ['./pomodoro.page.scss'],
  standalone:false
})
export class PomodoroPage implements OnInit {
  now = new Date();
  timerId: any;
  running = false;
  isWork = true;
  minutes = 25;
  seconds = 0;

  constructor(private zone: NgZone) {}

  async ngOnInit() {
    // Update the clock every second
    setInterval(() => this.zone.run(() => this.now = new Date()), 1000);
    // Request notification permission once
    await LocalNotifications.requestPermissions();
  }

  async startCycle() {
    this.running = true;
    this.isWork = true;
    this.minutes = 25;
    this.seconds = 0;

    // Schedule the end-of-work notification
    await this.scheduleNotification(
      'Work session ended!',
      'Time for a 5-minute break.'
    );

    this.tick();
  }

  private tick() {
    this.timerId = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          clearInterval(this.timerId);
          this.onTimerComplete();
          return;
        }
        this.minutes--;
        this.seconds = 59;
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  private async onTimerComplete() {
    // Haptic feedback
    Haptics.impact({ style: ImpactStyle.Medium });

    if (this.isWork) {
      // Switch to break
      this.isWork = false;
      this.minutes = 5;
      this.seconds = 0;

      // Schedule the end-of-break notification
      await this.scheduleNotification(
        'Break ended!',
        'Ready for another Pomodoro?'
      );

      this.tick();
    } else {
      // Cycle complete
      this.running = false;
    }
  }

  private async scheduleNotification(title: string, body: string) {
    await LocalNotifications.schedule({
      notifications: [{
        id: Date.now(),
        title,
        body,
        schedule: {
          at: new Date(
            Date.now() + (this.isWork ? 25 : 5) * 60 * 1000
          )
        },
        sound: 'default'
      }]
    });
  }
}
