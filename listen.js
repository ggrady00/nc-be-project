const app = require("./api/app")
const {PORT = 9090} = process.env

app.listen(PORT, () => console.log(`Listening on ${PORT}...`))