import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsuarioListComponent } from './usuario/components/usuario-list/usuario-list.component';
import { UsuarioNewComponent } from './usuario/components/usuario-new/usuario-new.component';
import { UsuarioEditComponent } from './usuario/components/usuario-edit/usuario-edit.component';

import { EmpleadosListComponent } from './empleados/empleados-list/empleados-list.component';
import { EmpleadosNewComponent } from './empleados/empleados-new/empleados-new.component';
import { EditEmpleadoComponent } from './empleados/empleados-edit/empleados-edit.component';
import { EmpleadosDetailComponent } from './empleados/empleados-detail/empleados-detail.component';
import { HomeComponent } from './home-user/home.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';

export const routes: Routes = [
    {
        path:'home-admin',
        component: HomeAdminComponent
    },
    {
        path:'home',
        component: HomeComponent
    },
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
        path: 'employee/edit/:id', 
        component: EditEmpleadoComponent 
    }

];
