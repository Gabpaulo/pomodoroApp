import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PomodoroPage } from './pomodoro.page';

const routes: Routes = [
  {
    path: '',
    component: PomodoroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PomodoroPageRoutingModule {}
