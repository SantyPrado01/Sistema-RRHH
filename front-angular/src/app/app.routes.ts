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

export const routes: Routes = [
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
        path:'user/create',
        component: UsuarioNewComponent,
    },
    {
        path:'categorias',
        component: CategoriasComponent,
    },
    {
        path:'cambio-contrasena/:id/:username',
        component: CambioPasswordComponent
    },
    {
        path:'employee',
        component: EmpleadosListComponent,
    },

    {
        path:'employee/create',
        component: EmpleadosNewComponent

    },
    {
        path: 'employee/edit/:id', 
        component: EditEmpleadoComponent 
    },
    {
        path:'service/create',
        component:ServiciosNewComponent
    },
    {
        path:'service',
        component: ServiciosListComponent
    },
    {
        path:'service/edit/:id',
        component: ServiciosEditComponent    
    },
    {
        path:'ordentrabajo/create',
        component: CrearOrdenTrabajoComponent
    },
    {
        path:'ordentrabajo',
        component: ListarOrdenTrabajoComponent
    },
    {
        path:'ordentrabajo/view/:id',
        component: OrdenTrabajoViewComponent
    },
    {
        path:'cargarHorarios',
        component: HorariosAsignadosComponent
    },
    {
        path:'factura/create',
        component: CrearFacturaComponent
    },
    {
        path:'facturas',
        component: FacturasListComponent
    },
    {
        path:'factura/view/:id',
        component: FacturasEditComponent
    },


];
