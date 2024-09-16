import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsuarioListComponent } from './usuario/components/usuario-list/usuario-list.component';
import { UsuarioNewComponent } from './usuario/components/usuario-new/usuario-new.component';
import { UsuarioEditComponent } from './usuario/components/usuario-edit/usuario-edit.component';

import { EmpleadosListComponent } from './empleados/empleados-list/empleados-list.component';
import { EmpleadosNewComponent } from './empleados/empleados-new/empleados-new.component';
import { EmpleadosEditComponent } from './empleados/empleados-edit/empleados-edit.component';
import { EmpleadosDetailComponent } from './empleados/empleados-detail/empleados-detail.component';

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
        path:'employee',
        component: EmpleadosListComponent
    },
    {
        path:'employee/create',
        component: EmpleadosNewComponent
    },
    {
        path:'employee/profile',
        component: EmpleadosDetailComponent
    },
    {
        path:'employee/edit/:id',
        component: EmpleadosEditComponent
    }


];
