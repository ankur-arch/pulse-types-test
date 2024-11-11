import 'dotenv/config'
import { PrismaClient, User } from '@prisma/client'
import { PulseCreateEvent, withPulse } from '@prisma/extension-pulse'

process.on('SIGINT', () => {
  process.exit(0)
})

type Model = {
  modelName: string;
  id: string;
  action: 'create'
  created: User
}

const apiKey: string = process.env.PULSE_API_KEY ?? ''
const prisma = new PrismaClient().$extends(
  withPulse({ apiKey: apiKey })
)

async function main() {
  const stream = await prisma.user.stream({
    create: {}
  })

  process.on('exit', (code) => {
    stream.stop()
  })

  for await (const event of stream) {

    const x:Model = event;

    console.log('just received an event:', x)
  }
}

main()
