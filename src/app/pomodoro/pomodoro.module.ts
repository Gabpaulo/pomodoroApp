import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';        // for the date pipe
import { FormsModule } from '@angular/forms';          // if you ever use ngModel
import { IonicModule } from '@ionic/angular';          // for all <ion-*> components

import { PomodoroPageRoutingModule } from './pomodoro-routing.module';
import { PomodoroPage } from './pomodoro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PomodoroPageRoutingModule
  ],
  declarations: [PomodoroPage]
})
export class PomodoroPageModule {}
