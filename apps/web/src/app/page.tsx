import { prisma } from '@/lib/prisma'

async function getData() {
  try {
    const tenant = await prisma.tenant.findFirst({
      include: {
        locations: {
          where: { isActive: true },
          select: { name: true, city: true }
        },
        specialties: {
          where: { isActive: true },
          select: { name: true }
        },
        services: {
          where: { isActive: true },
          select: { name: true, defaultDurationMinutes: true }
        }
      }
    })

    const totalAppointments = await prisma.appointment.count()
    const activeProviders = await prisma.provider.count({
      where: { isActive: true }
    })

    return {
      tenant,
      stats: {
        totalAppointments,
        activeProviders,
        totalLocations: tenant?.locations.length || 0,
        totalServices: tenant?.services.length || 0
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      tenant: null,
      stats: {
        totalAppointments: 0,
        activeProviders: 0,
        totalLocations: 0,
        totalServices: 0
      }
    }
  }
}

export default async function Home() {
  const { tenant, stats } = await getData()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to&nbsp;
          <code className="font-mono font-bold">{tenant?.name || 'sloty'}</code>
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6">
            Welcome to{' '}
            <span className="text-blue-600">sloty</span>
          </h1>
          {tenant && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {tenant.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {tenant.timezone} • {tenant.defaultCurrency}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            {stats.activeProviders} Provider{stats.activeProviders !== 1 ? 's' : ''}{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Active healthcare providers ready to serve patients.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            {stats.totalServices} Service{stats.totalServices !== 1 ? 's' : ''}{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Different medical services available for booking.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            {stats.totalLocations} Location{stats.totalLocations !== 1 ? 's' : ''}{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Physical locations where appointments can be scheduled.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            {stats.totalAppointments} Appointment{stats.totalAppointments !== 1 ? 's' : ''}{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50 text-balance">
            Total appointments scheduled in the system.
          </p>
        </div>
      </div>

      {tenant && tenant.specialties.length > 0 && (
        <div className="mt-16 w-full max-w-2xl">
          <h3 className="text-xl font-semibold mb-4 text-center">Available Specialties</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {tenant.specialties.map((specialty) => (
              <span
                key={specialty.name}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {specialty.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
