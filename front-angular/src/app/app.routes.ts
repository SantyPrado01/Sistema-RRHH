import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsuarioNewComponent } from './usuario/components/usuario-new/usuario-new.component';

import { EmpleadosListComponent } from './empleados/empleados-list/empleados-list.component';
import { EmpleadosNewComponent } from './empleados/empleados-new/empleados-new.component';
import { EditEmpleadoComponent } from './empleados/empleados-edit/empleados-edit.component';

import { HomeComponent } from './home-user/home.component';
import { ServiciosNewComponent } from './servicios/servicios-new/servicios-new.component';
import { ServiciosListComponent } from './servicios/servicios-list/servicios-list.component';
import { ServiciosEditComponent } from './servicios/servicios-edit/servicios-edit.component';

import { AuthGuard } from './login/auth/auth.guard';
import { CrearOrdenTrabajoComponent } from './ordenTrabajo/crear-orden-trabajo/crear-orden-trabajo.component';
import { HorariosAsignadosComponent } from './horariosAsignados/horarios-asignados.component';
import { ListarOrdenTrabajoComponent } from './ordenTrabajo/listar-orden-trabajo/listar-orden-trabajo.component';
import { OrdenTrabajoViewComponent } from './ordenTrabajo/orden-trabajo-view/orden-trabajo-view.component';
import { CambioPasswordComponent } from './login/cambio-password/cambio-password.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { CrearFacturaComponent } from './facturas/facturas-new/facturas.component';
import { FacturasListComponent } from './facturas/facturas-list/facturas-list.component';
import { FacturasEditComponent } from './facturas/facturas-edit/facturas-edit.component';
import { ManualComponent } from './manual/manual.component';
import { InformesComponent } from './informes/informes.component';

export const routes: Routes = [
    {
        path:'manual-usuario',
        component: ManualComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}
    },
    {
        path:'home',
        component: HomeComponent,
        canActivate:[AuthGuard],
        data:{expectedRole: 'Administrador'}
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
        path:'user/create',
        component: UsuarioNewComponent,
        canActivate:[AuthGuard],
        data:{expectedRole: 'Administrador'}
    },
    {
        path:'categorias',
        component: CategoriasComponent,
        canActivate:[AuthGuard],
        data:{expectedRole: 'Administrador'}
    },
    {
        path:'cambio-contrasena/:id/:username',
        component: CambioPasswordComponent
    },
    {
        path:'employee',
        component: EmpleadosListComponent,
        canActivate:[AuthGuard],
        data:{expectedRole: 'Administrador'}
        
    },

    {
        path:'employee/create',
        component: EmpleadosNewComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}

    },
    {
        path: 'employee/edit/:id', 
        component: EditEmpleadoComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}
    },
    {
        path:'service/create',
        component:ServiciosNewComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}
    },
    {
        path:'service',
        component: ServiciosListComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}
    },
    {
        path:'service/edit/:id',
        component: ServiciosEditComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}   
    },
    {
        path:'ordentrabajo/create',
        component: CrearOrdenTrabajoComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}
    },
    {
        path:'ordentrabajo',
        component: ListarOrdenTrabajoComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}
    },
    {
        path:'ordentrabajo/view/:id',
        component: OrdenTrabajoViewComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}
    },
    {
        path:'cargarHorarios',
        component: HorariosAsignadosComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}
    },
    {
        path:'factura/create',
        component: CrearFacturaComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}
    },
    {
        path:'facturas',
        component: FacturasListComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}
    },
    {
        path:'factura/view/:id',
        component: FacturasEditComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}
    },
    {
        path:'informes',
        component: InformesComponent,
        canActivate:[AuthGuard],
        data:{expectedRole:'Administrador'}
    },


];
