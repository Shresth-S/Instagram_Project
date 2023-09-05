let imageContainer = document.querySelector('.imageContainer');
let image_index = 0;

slideshow = () => {
    let images = imageContainer.querySelectorAll('.images');
    console.log(images);
    images.forEach(i => {
        i.classList.remove('active');
    })

    if (image_index + 1 === images.length) {
        image_index = 0;
    }
    else {
        image_index = image_index + 1;
    }
    images[image_index].classList.add('active');
}

setInterval(slideshow, 3000);