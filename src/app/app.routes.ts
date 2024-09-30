import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'errors',
    loadChildren: () => import('./modules/error/error.module').then((m) => m.ErrorModule),
  },
  {
    path: 'diagramador',
    loadChildren: () => import('./modules/diagrama/diagrama.module').then((m) => m.DiagramaModule),
  },
  { path: '**', redirectTo: 'errors/404' },
];
