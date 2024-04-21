const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Sign Image')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})