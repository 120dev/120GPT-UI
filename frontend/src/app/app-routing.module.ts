import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PromptComponent} from "./components/prompt/prompt.component";

const routes: Routes = [
  { path: 'prompt', component: PromptComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
