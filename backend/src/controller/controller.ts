class HereMap {
  async discoverAddress(address: string) {
    const baseURL = process.env.DISCOVER_API
    const apiKey = process.env.API_KEY
    const lat = process.env.LATITUDE
    const lng = process.env.LONGITUDE
    try {
      const fetchURL = `${baseURL}discover?at=${lat},${lng}&q=${address}&apiKey=${apiKey}`
      console.log(fetchURL)
      const res = await fetch(fetchURL)
      const data = await res.json()
      if (!res.ok) {
        console.log("not successfull", data)
        return
      }

      return data
    } catch (e) {
      console.log(e)
      return
    }
  }

  async calculateRoute(origin: string, destination: string) {
    const routingURL = process.env.ROUTING_API
    const apiKey = process.env.API_KEY
    try {
      const fetchURL = `${routingURL}routes?transportMode=car&origin=${origin}&destination=${destination}&return=summary&apikey=${apiKey}`
      console.log(fetchURL)
      const res = await fetch(fetchURL)
      const data = await res.json()
      if (!res.ok) {
        console.log("not successfull", data)
        return
      }

      return data
    } catch (e) {
      console.log(e)
      return
    }
  }
}

export default new HereMap