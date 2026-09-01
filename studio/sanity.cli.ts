import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'pcb497o9',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: 'r6didbovupxxnrbxdmvwa902',
  },
  typegen: {
    enabled: true,
    path: '../src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../sanity.types.ts',
    overloadClientMethods: true,
  },
})
