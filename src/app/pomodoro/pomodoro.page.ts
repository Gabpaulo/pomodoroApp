import { Component, NgZone, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.page.html',
  styleUrls: ['./pomodoro.page.scss'],
  standalone:false
})
export class PomodoroPage implements OnInit {
  now = new Date();
  timerId?: number;
  running = false;
  isWork = true;
  seconds = 10;                    // 10s test
  private alertAudio = new Audio('assets/sounds/notif.wav');
  readonly TEST_DURATION = 10;

  constructor(
    private zone: NgZone,
    private platform: Platform,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // keep the clock updated
    setInterval(() => this.zone.run(() => this.now = new Date()), 1000);

    // wait for Capacitor to be ready
    this.platform.ready().then(() => {
      this.notificationService.requestNotificationPermissions();
      this.notificationService.listenForIncomingNotifications();
    });
  }

  startCycle() {
    this.running = true;
    this.isWork = true;
    this.seconds = this.TEST_DURATION;

    // start the countdown immediately
    this.tick();

    // schedule the native notification (fire-and-forget)
    this.notificationService
      .scheduleNotification({
        id: Date.now(),
        title: 'Work session ended!',
        body: 'Time for a quick break.',
        schedule: { at: new Date(Date.now() + this.TEST_DURATION * 1000) },
        sound: 'notif',
      })
      .catch(err => console.warn('Notif failed', err));
  }

  private tick() {
    // clear any old timer
    if (this.timerId) clearInterval(this.timerId);

    this.timerId = window.setInterval(() => {
      this.zone.run(() => {
        if (this.seconds <= 0) {
          clearInterval(this.timerId!);
          this.onTimerComplete();
        } else {
          this.seconds--;
        }
      });
    }, 1000);
  }

  private onTimerComplete() {
    this.alertAudio.play().catch(err => console.warn('Audio play failed:', err));
    Haptics.impact({ style: ImpactStyle.Medium });

    if (this.isWork) {
      // switch to break
      this.isWork = false;
      this.seconds = this.TEST_DURATION;
      this.tick();

      this.notificationService
        .scheduleNotification({
          id: Date.now(),
          title: 'Break ended!',
          body: 'Ready for another round?',
          schedule: { at: new Date(Date.now() + this.TEST_DURATION * 1000) },
          sound: 'notif',
        })
        .catch(err => console.warn('Notif failed', err));
    } else {
      // cycle done
      this.running = false;
    }
  }
}
