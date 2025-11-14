import {Routes} from '@angular/router';
import {PollListComponent} from "./components/poll-list/poll-list.component";
import {PollCreateComponent} from "./components/poll-create/poll-create.component";

export const routes: Routes = [
    {path: '', component: PollListComponent},
    {path: 'create', component: PollCreateComponent},
];
