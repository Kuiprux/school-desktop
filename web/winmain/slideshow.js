const fs = require("fs");

let updatee;
let timeoutt;

function turnOffSlideshow() {
  clearTimeout(timeoutt);
}

function turnOnSlideshow() {
  updatee();
}

window.onload = function() {
  const slideshowContainer = document.getElementById("slideshow-container");

  const interval = 2000;

  let slideIndex = 0;
  let fileName = "";

  updatee = update;
  update();

  async function update() {
    let isNameSet = await updateIndex();
    if(isNameSet) {
      loadImage(base64_encode('imgs/'+fileName));
      showSlides();
    }
    timeoutt = setTimeout(update, interval);
  }

  async function updateIndex() {
    let isNextSet = false;
    const files = await fs.promises.readdir('imgs');
    if(files.length == 0) return false;
    if(fileName != "") {
      for (let i = 0; i < files.length; i++) {//  console.log('test1 ',i);
        if(fileName === files[i]) {
          if(i >= files.length-1) {
            slideIndex = 0;//  console.log('test2 ');
          } else {
            slideIndex = i+1;//  console.log('test3 ',slideIndex);
          }
          isNextSet = true;
          break;
        }
      }
    }
    if(!isNextSet) {
      if(slideIndex >= files.length-1) {
        slideIndex = 0;//  console.log('test4 ');
      } else {
        ;//  console.log('test5 ',slideIndex);
      }
    }
    fileName = files[slideIndex];

    //console.log(fileName);
    return true;
  }

  function base64_encode(file) {
      //console.log(file);
      let bitmap = fs.readFileSync(file);
      return new Buffer(bitmap).toString('base64');
  }

  function loadImage(image) {
    let img = document.createElement('img');
    img.src = 'data:image/png;base64,'+image;
    img.classList.add('slide-image');
    img.classList.add('fadeIn');
    img.addEventListener('animationend', (event) => {
      if(event.animationName == 'fadeIn') {
        event.target.classList.remove('fadeIn');
      } else if(event.animationName == 'fadeOut') {
        event.target.parentNode.removeChild(event.target);
      }
    });
    slideshowContainer.appendChild(img);
  }

  // TODO: edit this
  function showSlides() {
    var slides = document.getElementsByClassName("slide-image");
    //console.log(slides);
    if(slides.length >= 2) {
      slides[0].classList.add('fadeOut');
    }
  }


  /*
  function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 2000); // Change image every 2 seconds
  }
  */
}
