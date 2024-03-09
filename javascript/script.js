let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";

  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
  let response = await a.text()
  console.log(response)
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
    
  }

  

  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li><img src="images/icons8-music-library-48.png" class="invert" alt="" height="30" width="30">
                    <div class="info">
                        <div>${song.replaceAll("%20", " ")} </div>
                        <div>XYZ</div>
                    </div> 
                    <div class="playNow">
                        <span>PlayNow</span>
                    <img src="images/icons8-play-50.png" class="invert" alt="" height="30" width="30">
                </div></li>`;
  }
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML)
    })
  })
  return songs
}
const playMusic = (track, pause = false) => {

  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play()
    play.src = "images/icons8-pause-50.png"
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track)
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/audio/`)
  let response = await a.text()
  console.log(response)
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    
    if (e.href.includes("/audio/")) {
      let folders = (e.href.split("/").slice(-1)[0])
      //  getting the meta data of the folder
      let a = await fetch(`http://127.0.0.1:5500/audio/${folders}/info.json`)
      let response = await a.json()
      console.log(response)
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folders}" class="card">
      <div class="play">
          <img src="images/vecteezy_green-play-button_1186943.png" alt="">
      </div>
      <img src="/audio/${folders}/cover.jpg" alt="">
      <h3>${response.title}</h3>
      <p>${response.description}</p>
  </div>`
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getSongs(`audio/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])

    })
  })

}

async function main() {

  //we recieve the list of songs through the fetch api method and async,await method
  await getSongs("audio/english");
  playMusic(songs[0], true)

  // Displaying the album
  displayAlbums()

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "images/icons8-pause-50.png"
    }
    else {
      currentSong.pause()
      play.src = "images/icons8-play-50.png"
    }
  })

  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songTime").innerHTML = `${secondsToMinutes(currentSong.currentTime)}/${secondsToMinutes(currentSong.duration)}`
    document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%";
  })

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
  })

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  })
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%";
  })

  document.getElementById("previous").addEventListener("click", () => {
    console.log("previous clicked")
    console.log(currentSong)
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

    console.log(songs, index)
    if ((index - 1 >= 0)) {

      playMusic(songs[index - 1])
    }
  })
  document.getElementById("next").addEventListener("click", () => {
    console.log("next clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

    console.log(songs, index)
    if ((index + 1 < songs.length)) {

      playMusic(songs[index + 1])
    }
  })


  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

    currentSong.volume = parseInt(e.target.value) / 100
  })

  document.querySelector(".container-round>img").addEventListener("click",e=>{
    if(e.target.src.includes("images/icons8-volume-50.png")){
      e.target.src= e.target.src.replace("icons8-volume-50.png","mute.png")
      currentSong.volume = 0
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0
    }
    else{
      currentSong.volume = 0.10
     
      e.target.src=  e.target.src.replace("mute.png","icons8-volume-50.png")
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10
    }
  })

  
}
main()