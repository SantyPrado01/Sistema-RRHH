import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsuarioListComponent } from './usuario/components/usuario-list/usuario-list.component';
import { UsuarioNewComponent } from './usuario/components/usuario-new/usuario-new.component';
import { UsuarioEditComponent } from './usuario/components/usuario-edit/usuario-edit.component';
import { CiudadListComponent } from './ciudad/components/ciudad-list/ciudad-list.component';
import { CiudadNewComponent } from './ciudad/components/ciudad-new/ciudad-new.component';
import path from 'path';
import { CiudadEditComponent } from './ciudad/components/ciudad-edit/ciudad-edit.component';

export const routes: Routes = [
    {
        path:'',
        component: LoginComponent
    },
    {
        path:'login',
        component: LoginComponent
    },
    {
        path:'user',
        component: UsuarioListComponent
    },
    {
        path:'user/create',
        component: UsuarioNewComponent
    },
    {
        path:'user/edit/:id',
        component: UsuarioEditComponent
    },
    {
        path:'city',
        component: CiudadListComponent
    },
    {
        path:'city/Create',
        component: CiudadNewComponent
    },
    {
        path:'city/edit/:id',
        component:CiudadEditComponent
    }

];
