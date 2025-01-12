import { Routes } from '@angular/router';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AddFriendComponent } from './components/add-friend/add-friend.component';
import { UpdateFriendComponent } from './components/update-friend/update-friend.component';
import { UsersMainComponent } from './components/users/users-main/users-main.component';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';

export const routes: Routes = [
    { path:'', redirectTo: '/login', pathMatch: 'full' },       // localhost:4200 then redirect to /login, path should match 100%
    { path:'login', component: UserLoginComponent},
    { path:'register', component: UserRegisterComponent },
    
    { path:'main', component: MainViewComponent, canActivate: [authGuard]},
    { path:'friends/add', component: AddFriendComponent, canActivate: [authGuard] },
    { path:'friends/edit/:id', component: UpdateFriendComponent, canActivate: [authGuard] },
    { path: 'users', component: UsersMainComponent, canActivate: [adminGuard] },
    { path: 'users/add', component: AddUserComponent, canActivate: [adminGuard] },

    { path: 'unauthorized', component: UnauthorizedComponent },    
    { path:'not-found', component: NotFoundComponent },
    { path:'**', redirectTo: '/not-found', pathMatch: 'full' },  // any non matching path should redirect to /not-found
];
