const express = require("express")
const app = express()
const server = require('http').Server(app)
const io = require("socket.io")(server)
const fs = require("fs")
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

io.on("connection", socket=>{
    fs.readdir("public/songs", (err, files) =>{
        if(err){
            console.error(err)
        }
        else{
            socket.emit("songList", files)
        }
    })
}
)
const PORT = process.env.PORT || 3000
server.listen(PORT)
