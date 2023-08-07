ScrollTrigger.create({
  trigger: '#item1',
  start: 'top center',
  onEnter: () => {
    map.flyTo([-54, 87], 4);
    gsap.to('#text1', {
      text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor facere aliquid ratione provident <span style="color: red;">maiores</span> magnam, quasi voluptatibus incidunt voluptatem, quibusdam, quas volupta   s doloribus. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.',
      autoAlpha: 1,
      ease: 'power1.in',
      duration: 1,
    });
  },
  markers: true,
});

ScrollTrigger.create({
  trigger: '#item2',
  start: 'top center',
  onEnter: () => {
    map.flyTo([-15, 75.6], 3);
    gsap.to('#text2', {
      text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor facere aliquid ratione provident maiores magnam, quasi voluptatibus incidunt voluptatem, quibusdam, quas volupta   s doloribus. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor facere aliquid ratione provident maiores magnam, quasi voluptatibus incidunt voluptatem, quibusdam, quas volupta   s doloribus. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.',
      autoAlpha: 1,
      ease: 'power1.in',
      duration: 3,
    });
    // Add the image reveal animation
    gsap.to('#img2', {
      autoAlpha: 1, // Make the image visible
      ease: 'power1.in', // Set the ease
      duration: 2, // Animation duration
    });
  },
  markers: true,
  onLeave: () => {
    map.addLayer(polygon3);
  },

  onEnterBack: () => {
    map.flyTo([-54, 87], 4);
  },
});

ScrollTrigger.create({
  trigger: '#item2',
  start: 'top center',
  onEnter: () => {
    map.flyTo([-50, 117], 6);
    gsap.to('#text3', {
      text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor facere aliquid ratione provident maiores magnam, quasi voluptatibus incidunt voluptatem, quibusdam, quas volupta   s doloribus. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor facere aliquid ratione provident maiores magnam, quasi voluptatibus incidunt voluptatem, quibusdam, quas volupta   s doloribus. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.',
      autoAlpha: 1,
      ease: 'power1.in',
      duration: 3,
    });
    // Add the image reveal animation
    gsap.to('#img3', {
      autoAlpha: 1, // Make the image visible
      ease: 'power1.in', // Set the ease
      duration: 2, // Animation duration
    });
  },
  markers: true,

  onEnterBack: () => {
    map.flyTo([-54, 87], 4);
  },
});

function openStoryBox(content, imageUrl) {
  storyContent.innerHTML = content;
  storyImage.src = imageUrl; // Set the source of the image
  storyImage.classList.remove('hidden'); // Make sure the image is visible
  storyBox.style.display = 'block';
}

function closeStoryBox() {
  storyBox.style.display = 'none';
}

// story button
nextButton.addEventListener('click', function (event) {
  event.stopPropagation(); // Stop the click event from propagating to the map
  const content = `
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum at quaerat ad doloremque deleniti nobis odit id ut nulla ratione!
    Expedita adipisci minus enim iusto magnam, reprehenderit cum nam esse facere temporibus molestias fugit mollitia ex recusandae dolore explicabo fuga?
    Culpa cupiditate at eligendi iure. Dicta quod qui tempora doloribus veritatis dignissimos neque nesciunt? Quaerat aut commodi ea error in!
    A nam consequatur hic magnam nemo minima sequi corrupti possimus recusandae. Aliquid voluptate, animi vitae similique inventore officia laborum optio.
    Praesentium rerum porro enim veniam ut tempora pariatur repudiandae veritatis error ipsum, eaque consequuntur non numquam neque nesciunt eum excepturi.</p>
  `;
  const imageUrl = 'espionne.png'; // Replace this with the actual image URL
  openStoryBox(content, imageUrl); // Pass the content and image URL to the function
});

///////////////////////
////STORYMAP///////////
///////////////////////
