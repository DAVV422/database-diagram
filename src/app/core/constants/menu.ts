import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Diagramas',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/folder.svg',
          label: 'Diagramas',
          route: '/dashboard',
          children: [
            { label: 'Creados', route: '/dashboard/diagramas' },
            { label: 'Compartidos', route: '/dashboard/compartidos' },
          ],
        }
      ],
    },
    {
      group: 'Invitaciones',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Invitaciones',
          route: '/dashboard/invitaciones',
        }
      ]
    },
    {
      group: 'Config',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/cog.svg',
          label: 'Settings',
          route: '/settings',
        }
      ],
    },
  ];
}
