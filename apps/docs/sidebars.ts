import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main documentation sidebar
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/configuration',
        'getting-started/first-tenant',
        'getting-started/deployment',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/monorepo-structure',
        'architecture/data-model',
        'architecture/multi-tenancy',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'concepts/tenants-users',
        'concepts/providers-locations',
        'concepts/services-specialties',
        'concepts/appointments-booking',
        'concepts/parameters-dependencies',
        'concepts/slot-engine',
      ],
    },
    {
      type: 'category',
      label: 'Authentication & Authorization',
      items: [
        'auth/overview',
        'auth/next-auth',
        'auth/role-based-access',
        'auth/tenant-isolation',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/overview',
        'api/tenants',
        'api/providers',
        'api/services',
        'api/appointments',
        'api/availability',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/setup',
        'development/testing',
        'development/contributing',
        'development/troubleshooting',
      ],
    },
  ],
};

export default sidebars;
