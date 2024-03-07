const video = document.querySelector(".player");
const audio = document.querySelector(".snap");
const canvas = document.querySelector(".photo");

const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");

function getVideo() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(localMediaStream => {
            console.log(localMediaStream); /* this accesses the user video data so we can use it on the page) */
            video.srcObject = localMediaStream; 
            video.play();
            }
          )
        
          .catch(err => {
            console.error(`OH NO!!!`, err);
          });
    } else {
        console.error('getUserMedia is not supported in this browser');
    }
    

}

function paintToCanvas() {
    width = video.videoWidth;
    height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // mess with them
        // pixels = redEffect(pixels);
     
     
        pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.8;
     
     
        // pixels = greenScreen(pixels);
        // put them back
        ctx.putImageData(pixels, 0, 0);
      }, 16);
}

function takePhoto() {
    audio.currentTime = 0;
    audio.takePhoto;

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
      pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
      pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
   }
   
   
   function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED
      pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
   }
   
   
   function greenScreen(pixels) {
    const levels = {};
   
   
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
   
   
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
   
   
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
   
   
    return pixels;
   }

   getVideo();
   video.addEventListener("canplay", paintToCanvas);
