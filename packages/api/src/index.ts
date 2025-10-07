import { createApp } from './server.js'

const port = process.env.PORT ? Number(process.env.PORT) : 3000
const app = createApp()

app.listen(port, () => {
  console.log(`API server listening on port ${port}`)
})
