function createSong(name){
    let track = new Audio()
    track.src = `./songs/${name}.mp3`
    track.volume = 0.5
    track.controls = true
    track.autoplay = false
    return track
}
const songSelector = document.getElementById("songSelector")
let songs = {}
const socket = io()
socket.on("songList", files =>{
    files.forEach( (src, index) =>{
        let songName = src.slice(0, src.length-4)
        songs[songName] = createSong(songName)
    })
    initSongSelector()
})

function initSongSelector(){
    for(let name in songs){
        if(songs.hasOwnProperty(name)){
            songSelector.innerHTML += `<option value="${name}">${name}</option>`
        }
    }
    songSelector.addEventListener("change",()=>{
        if(songSelector.selectedIndex != 0) initMp3Player(songs[songSelector[songSelector.selectedIndex].value])
    })
}





const canvas = document.querySelector("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const c = canvas.getContext("2d")

let audioContext, analyser, source, fbc_array
window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})



function initMp3Player(audio){
    //lager en kopi for å komme rundt en bug der createMediaElementSource ikke fungerer
    let sound = new Audio()
    sound.src = audio.src
    sound.controls = true
    sound.autoplay = false
    sound.currentTime = 0
    sound.volume = 0.5
    sound.play()
    
    

    const playerDiv = document.getElementById("control")
    
    playerDiv.innerHTML = ""
    playerDiv.appendChild(sound)
    audioContext = new AudioContext()
    analyser = audioContext.createAnalyser()
    source = audioContext.createMediaElementSource(sound)
    source.connect(analyser)
    analyser.connect(audioContext.destination)
    analyser.smoothingTimeConstant = 0.85

    sound.addEventListener("ended", ()=>{
        songSelector.selectedIndex += 1
        initMp3Player(songs[songSelector[songSelector.selectedIndex].value])
    })
}


const bassMaxFreq = 5
function frameLooper(){
    requestAnimationFrame(frameLooper)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    //hvis analyseren har blitt definert gjennom initMp3Player
    if(analyser){
        // console.log(analyser)
        fbc_array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(fbc_array)
        let lowestFreqAmp = fbc_array[0]
        if(lowestFreqAmp < 1) lowestFreqAmp = 1
        let bassAmp = 0
        

        for(let i = 0; i < bassMaxFreq; i++){
            bassAmp += (fbc_array[i]*fbc_array[i]*fbc_array[i])/200000
        }
        const r = (canvas.width/50 + bassAmp*canvas.width/2500)/1.5

        for(let i = 0; i < 360; i++){
            
        
            c.fillStyle = `hsl(${i}, 90%, 40%)`
            const barHeight = fbc_array[Math.floor(i/3+100)]
            const a = i/180 *Math.PI - Math.PI/2
            const pos = {
                x: canvas.width/2 + r*Math.cos(a),
                y: canvas.height/2 + r*Math.sin(a)
            }

            c.save()
            c.translate(pos.x, pos.y)
            c.rotate(Math.PI/2 + a)
            c.fillRect(0, 0, 4, -canvas.width/2000*1.5*barHeight)
            c.restore()
        }
        
        c.beginPath()
        c.moveTo(canvas.width/2 + r, canvas.height/2)
        c.strokeStyle = "white"
        c.arc(canvas.width/2, canvas.height/2, r, 0, Math.PI*2)
        c.stroke()
        c.closePath()
    }
}
frameLooper()