import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/sloty-saas-appointment-system/__docusaurus/debug',
    component: ComponentCreator('/sloty-saas-appointment-system/__docusaurus/debug', '4c8'),
    exact: true
  },
  {
    path: '/sloty-saas-appointment-system/__docusaurus/debug/config',
    component: ComponentCreator('/sloty-saas-appointment-system/__docusaurus/debug/config', 'c5b'),
    exact: true
  },
  {
    path: '/sloty-saas-appointment-system/__docusaurus/debug/content',
    component: ComponentCreator('/sloty-saas-appointment-system/__docusaurus/debug/content', '3d3'),
    exact: true
  },
  {
    path: '/sloty-saas-appointment-system/__docusaurus/debug/globalData',
    component: ComponentCreator('/sloty-saas-appointment-system/__docusaurus/debug/globalData', 'a2b'),
    exact: true
  },
  {
    path: '/sloty-saas-appointment-system/__docusaurus/debug/metadata',
    component: ComponentCreator('/sloty-saas-appointment-system/__docusaurus/debug/metadata', '1b3'),
    exact: true
  },
  {
    path: '/sloty-saas-appointment-system/__docusaurus/debug/registry',
    component: ComponentCreator('/sloty-saas-appointment-system/__docusaurus/debug/registry', 'cdb'),
    exact: true
  },
  {
    path: '/sloty-saas-appointment-system/__docusaurus/debug/routes',
    component: ComponentCreator('/sloty-saas-appointment-system/__docusaurus/debug/routes', '6b9'),
    exact: true
  },
  {
    path: '/sloty-saas-appointment-system/docs',
    component: ComponentCreator('/sloty-saas-appointment-system/docs', '48e'),
    routes: [
      {
        path: '/sloty-saas-appointment-system/docs',
        component: ComponentCreator('/sloty-saas-appointment-system/docs', '170'),
        routes: [
          {
            path: '/sloty-saas-appointment-system/docs',
            component: ComponentCreator('/sloty-saas-appointment-system/docs', 'b67'),
            routes: [
              {
                path: '/sloty-saas-appointment-system/docs/api-reference/overview',
                component: ComponentCreator('/sloty-saas-appointment-system/docs/api-reference/overview', '7aa'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/sloty-saas-appointment-system/docs/architecture/data-model',
                component: ComponentCreator('/sloty-saas-appointment-system/docs/architecture/data-model', 'dd8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/sloty-saas-appointment-system/docs/architecture/monorepo-structure',
                component: ComponentCreator('/sloty-saas-appointment-system/docs/architecture/monorepo-structure', 'ca5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/sloty-saas-appointment-system/docs/architecture/multi-tenancy',
                component: ComponentCreator('/sloty-saas-appointment-system/docs/architecture/multi-tenancy', '520'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/sloty-saas-appointment-system/docs/architecture/overview',
                component: ComponentCreator('/sloty-saas-appointment-system/docs/architecture/overview', 'd4c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/sloty-saas-appointment-system/docs/authentication/overview',
                component: ComponentCreator('/sloty-saas-appointment-system/docs/authentication/overview', '4e0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/sloty-saas-appointment-system/docs/core-concepts/overview',
                component: ComponentCreator('/sloty-saas-appointment-system/docs/core-concepts/overview', 'b14'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/sloty-saas-appointment-system/docs/development/setup',
                component: ComponentCreator('/sloty-saas-appointment-system/docs/development/setup', 'e7c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/sloty-saas-appointment-system/docs/getting-started/configuration',
                component: ComponentCreator('/sloty-saas-appointment-system/docs/getting-started/configuration', 'b59'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/sloty-saas-appointment-system/docs/getting-started/deployment',
                component: ComponentCreator('/sloty-saas-appointment-system/docs/getting-started/deployment', 'f5b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/sloty-saas-appointment-system/docs/getting-started/first-tenant',
                component: ComponentCreator('/sloty-saas-appointment-system/docs/getting-started/first-tenant', '6ef'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/sloty-saas-appointment-system/docs/getting-started/installation',
                component: ComponentCreator('/sloty-saas-appointment-system/docs/getting-started/installation', '48a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/sloty-saas-appointment-system/docs/intro',
                component: ComponentCreator('/sloty-saas-appointment-system/docs/intro', '22b'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
