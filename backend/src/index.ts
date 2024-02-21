import { Hono } from 'hono'
import { cors } from 'hono/cors'
import HereMap from "./controller/controller"

const app = new Hono()

app.use('/api/*', cors())

app.get("/api/discover/:address",
  async (c) => {
    const address = c.req.param("address")
    return c.json(await HereMap.discoverAddress(address))
  }
)

app.get("/api/routing/:origin/:destination",
  async (c) => {
    const origin = c.req.param("origin")
    const destination = c.req.param("destination")
    return c.json(await HereMap.calculateRoute(origin, destination))
  }
)

export default app
