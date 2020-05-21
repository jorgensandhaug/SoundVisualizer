const youtubeStream = require("youtube-audio-stream")
const express = require("express")
const url = "https://www.youtube.com/embed/RPz75gcHj18&t=23s"

const app = express()
app.use(express.static(__dirname + '/public'))

app.get("/music", (req, res)=>{
    const requestUrl = "https://www.youtube.com/embed/"+req.params.videoId
    res.set({'Content-Type': 'audio/mpeg'});
    try{
        youtubeStream(url).pipe(res)
    }
    catch(exception){
        res.status(500).send(exception)
    }
})

app.listen(3000);

