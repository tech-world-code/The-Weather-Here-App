const { request, response } = require("express")
const express = require("express")
const nedb = require("nedb")
const app = express()
require("dotenv").config()
const port = 5000

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})

const database = new nedb("allweather.db")
database.loadDatabase()

app.use(express.static("public"))
app.use(express.json({ limit: "1mb" }))


app.post("/api", async (request, response) => {
    const getWeather = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${request.body.lat}, ${request.body.lon}?unitGroup=metric&key=${process.env.API_KEY}&contentType=json`)
    const returnedWeather = await getWeather.json()

    let storeData = request.body
    storeData.weather = returnedWeather
    storeData.timestamp = Date.now()

    console.log(request.body)
    database.insert(storeData)

    response.send("Success @/api POST (Redricting to results page)")
})

app.get("/api", (request, response) => {
    database.find({}, (err, data) => {
        response.json(data)
        console.log(data)
    })
})