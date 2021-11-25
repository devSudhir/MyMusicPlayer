//html elements
const forward_btn = document.querySelector(".forward-track");
const volume_slider = document.querySelector(".volume_slider");
const curr_time = document.querySelector(".current-time");
const total_duration = document.querySelector(".total-duration");
const canvas = document.getElementById("myCanvas");

//global variables
let isPlaying = true;
let updateTimer;
const min = 20;
const max = 100;
let values = [];

function draw() {
  //generating array of random values to show the height of bar graph
  values = new Array(50).fill(min).map((ele) => {
    let num = Math.floor(Math.random() * max);
    if (num + ele > max) {
      return num + ele - 10;
    } else {
      return num + ele;
    }
  });

  canvas.addEventListener("click", colorBar);
  let ctx = canvas.getContext("2d");
  let width = 7; //bar width
  let X = 0; // first bar position
  let base = 100;

  for (let i = 0; i < values.length; i++) {
    ctx.fillStyle = "teal";
    let h = values[i];
    ctx.fillRect(X, canvas.height - h, width, h);

    X += width + 1;
    /* text to display Bar number */
    ctx.fillStyle = "#4da6ff";
    //ctx.fillText('Bar '+i,X-50,canvas.height - h -10);
  }
  /* Text to display scale */
  ctx.fillStyle = "#000000";
  ctx.fillText("Scale X : " + canvas.width + " Y : " + canvas.height, 800, 10);
}
function reset() {
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//creating the track
let curr_track = document.createElement("AUDIO");

//loading a new track
function loadTrack() {
  //clearing the Interval which is continuesly running in every second to show time
  clearInterval(updateTimer);
  resetValues();
  /* the audio is going to play if it is playable */
  if (curr_track.canPlayType("audio/mpeg")) {
    curr_track.setAttribute("src", "mySong.mp3");
  }

  curr_track.setAttribute("autoplay", "autoplay");

  updateTimer = setInterval(seekUpdate, 1000);
  // Move to the next track if the current finishes playing
  curr_track.addEventListener("ended", loadTrack);
}

//function will trigger when user want to play or pause the audio
function playPause() {
  if (!isPlaying) {
    curr_track.play();
    isPlaying = true;
  } else {
    curr_track.pause();
    isPlaying = false;
  }
}

// forwardButton function
function forwardAudio() {
  curr_track.currentTime += 10;
}

//Reseting the timer in song timebar
function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
}
// function to get the limit to which I hav to change the color
function getUpperLimit() {
  return Math.ceil(
    (curr_track.currentTime / curr_track.duration) * values.length
  );
}
//setting color of the bar according to current time of the song
function colorBar(e) {
  curr_track.currentTime =
    (e.x / (window.innerWidth * 0.9)) * curr_track.duration;
  let ctx = canvas.getContext("2d");
  let width = 7; //bar width
  let X = 0; // first bar position
  let base = 200;
  let upperLimit = getUpperLimit();
  for (let i = 0; i < upperLimit; i++) {
    ctx.fillStyle = "aqua";
    let h = values[i];
    ctx.fillRect(X, canvas.height - h, width, h);

    X += width + 1;
    /* text to display Bar number */
    ctx.fillStyle = "#4da6ff";
    //ctx.fillText('Bar '+i,X-50,canvas.height - h -10);
  }
  /* Text to display scale */
  ctx.fillStyle = "#000000";
  ctx.fillText("Scale X : " + canvas.width + " Y : " + canvas.height, 800, 10);
}

// Set the volume according to the percentage of the volume slider set
volume_slider.addEventListener("change", function () {
  curr_track.volume = volume_slider.value / 100;
});

function seekUpdate() {
  let ctx = canvas.getContext("2d");
  let width = 7; //bar width
  let X = 0; // first bar position
  let base = 200;
  let upperLimit = getUpperLimit();
  for (let i = 0; i < upperLimit; i++) {
    ctx.fillStyle = "aqua";
    let h = values[i];
    ctx.fillRect(X, canvas.height - h, width, h);

    X += width + 1;
    /* text to display Bar number */
    ctx.fillStyle = "#4da6ff";
    //ctx.fillText('Bar '+i,X-50,canvas.height - h -10);
  }
  for (let i = upperLimit; i < values.length; i++) {
    ctx.fillStyle = "teal";
    let h = values[i];
    ctx.fillRect(X, canvas.height - h, width, h);

    X += width + 1;
    /* text to display Bar number */
    ctx.fillStyle = "#4da6ff";
    //ctx.fillText('Bar '+i,X-50,canvas.height - h -10);
  }
  /* Text to display scale */
  ctx.fillStyle = "#000000";
  ctx.fillText("Scale X : " + canvas.width + " Y : " + canvas.height, 800, 10);
  var seekPosition = 0;

  // Check if the current track duration is a legible number
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    //seek_slider.value = seekPosition;

    // Calculate the time left and the total duration
    var currentMinutes = Math.floor(curr_track.currentTime / 60);
    var currentSeconds = Math.floor(
      curr_track.currentTime - currentMinutes * 60
    );
    var durationMinutes = Math.floor(curr_track.duration / 60);
    var durationSeconds = Math.floor(
      curr_track.duration - durationMinutes * 60
    );

    // Add a zero to the single digit time values
    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    // Display the updated duration
    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

loadTrack();

//showing volume up-down range on hover
function showVolumeRange(show = 1) {
  if (show) {
    document.getElementsByClassName("volume_slider")[0].style.display =
      "inline";
  } else {
    document.getElementsByClassName("volume_slider")[0].style.display = "none";
  }
}
