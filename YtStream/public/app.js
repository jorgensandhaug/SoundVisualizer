const audioContext = new AudioContext()

function loadSound(){
    const request = new XMLHttpRequest()
    request.open("GET", "http://localhost:3000/music", true)
    request.respsoneType = "arraybuffer"
    request.onload = ()=>{
        const data = request.response
        process(data)
    }
    request.send()
}
let source
function process(data){
    source = audioContext.createBufferSource()
    audioContext.decodeAudioData(data, buffer=>{
        source.buffer = buffer
        source.connect(audioContext.destination)
        source.start(audioContext.currentTime)
    })
}

loadSound()