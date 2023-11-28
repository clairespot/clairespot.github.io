const contentData = [
    // {
    //     id: 'picture',
    //     content: '<div class="grid-item"><img src="https://placehold.co/300x200" alt="Sample Picture"></div><p>Sample Picture Description</p>'
    // },
    // {
    //     id: 'video',
    //     content: '<iframe width="300" height="200" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe><p>Sample Video Description</p>'
    // },
    // {
    //     id: 'text',
    //     content: '<p>Sample Full Text Content: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempus mi aliquam risus malesuada consequat. Suspendisse vehicula tempor diam, sit amet consequat est. Cras at lacinia urna. Nam at velit sem. Mauris nec odio aliquet nulla blandit imperdiet. Maecenas ornare erat id felis ornare congue. Morbi fringilla efficitur libero quis lobortis. Pellentesque rhoncus elit at ipsum aliquet varius. Maecenas pretium imperdiet magna eu posuere. Vivamus massa magna, sagittis sit amet sodales sit amet, interdum et eros. Cras ut pretium nisi, a imperdiet velit. Aenean pellentesque sollicitudin lacus vestibulum ultricies. Nulla euismod id purus vel interdum. Aliquam a iaculis ipsum. Sed iaculis, magna a venenatis viverra, risus felis laoreet augue, in egestas ligula augue id libero.</p>'
    // }

    {
        id: 'the-bridge',
        content: `
            <video width="320" height="240" controls>
                <source src="files/the-bridge-30.mp4" type="video/mp4">
                <source src="files/the-bridge.ogg" type="video/ogg">
                Video non supportato.
            </video>
            <p align="left">Autore: John Doe</p>
            <p align="left">Anno: 2023</p>
            <p align="left">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempus mi aliquam risus malesuada consequat. Suspendisse vehicula tempor diam, sit amet consequat est.</p>
        `
    },
    {
        id: 'vicky',
        content: `
            <div class="img-container grid">
                <div class="grid-sizer"></div>
                <div class="grid-item"><img src="files/vicky/tinified/1.jpg" alt="Sample Picture"></div>
                <div class="grid-item"><img src="files/vicky/tinified/2.jpg" alt="Sample Picture"></div>
                <div class="grid-item"><img src="files/vicky/tinified/3.jpg" alt="Sample Picture"></div>
                <div class="grid-item"><img src="files/vicky/tinified/4.jpg" alt="Sample Picture"></div>
                <div class="grid-item"><img src="files/vicky/tinified/5.jpg" alt="Sample Picture"></div>
                <div class="grid-item"><img src="files/vicky/tinified/6.jpg" alt="Sample Picture"></div>
                <div class="grid-item"><img src="files/vicky/tinified/7.jpg" alt="Sample Picture"></div>
                <div class="grid-item"><img src="files/vicky/tinified/8.jpg" alt="Sample Picture"></div>
                <div class="grid-item"><img src="files/vicky/tinified/9.jpg" alt="Sample Picture"></div>
                <div class="grid-item"><img src="files/vicky/tinified/10.jpg" alt="Sample Picture"></div>
                <div class="grid-item"><img src="files/vicky/tinified/11.jpg" alt="Sample Picture"></div>
                <div class="grid-item"><img src="files/vicky/tinified/12.jpg" alt="Sample Picture"></div>
            </div>
            <p align="left">Autore: John Doe</p>
            <p align="left">Anno: 2023</p>
            <p align="left">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempus mi aliquam risus malesuada consequat. Suspendisse vehicula tempor diam, sit amet consequat est.</p>
        `
    }
];

// Initialize the current content id to null
let currentContentId = null;

// Function to display random content excluding the current id
function displayRandomContent() {
    // Generate a random index excluding the current content id
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * contentData.length);
    } while (contentData[randomIndex].id === currentContentId);

    // randomIndex = 1; // TESTING

    // Update the current content id
    currentContentId = contentData[randomIndex].id;

    // Display the random content
    const randomContent = contentData[randomIndex];
    document.getElementById('content').innerHTML = randomContent.content;

    // If they're images, apply Masonry
    if (currentContentId == 'vicky') {
        var grid = document.querySelector('.grid');
        var msnry;
        imagesLoaded(grid, function() {
            // init Isotope after all images have loaded
            msnry = new Masonry(grid, {
                itemSelector: '.grid-item',
                columnWidth: '.grid-sizer',
                percentPosition: true,
            });
        });

        var gridItems = document.querySelectorAll('.grid-item');

        for (var i = 0; i < gridItems.length; i++) {
            gridItems[i].addEventListener('click', function () {
                for (var i = 0; i < gridItems.length; i++) {
                    gridItems[i].classList.remove('large');
                }
                this.classList.add('large');
                msnry.layout();
            });
        };
    }
}

function goToForm() {
    window.location.href = window.location.origin + '/margheranelmezzo/form.html';
}

// Initial content display
displayRandomContent();

// Refresh button click event
document.getElementById('refresh-button').addEventListener('click', displayRandomContent);
