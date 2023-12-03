const contentData = [
    {
        id: 'the-bridge',
        content: `
            <video width="320" height="240" controls>
                <source src="files/the-bridge-30.mp4" type="video/mp4">
                <source src="files/the-bridge-30.ogg" type="video/ogg">
                Video non supportato.
            </video>
            <p align="left">Author: The Bridge (Lorenzo Lazzari, Luca Boscolo, Marta Grasp, Giova Rossi, Giulio Rossato, Riccardo Vendramin)</p>
            <p align="left">Yeat: 2022</p>
            <p align="left">Description: The Bridge performing at "Concerto contro la guerra" (Concert against the war). WAR IS NEVER THE SOLUTION.</p>
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
            <p align="left">Author: La Vicky</p>
            <p align="left">Year: 2023</p>
            <p align="left">Description: Marghera at night-time, captured during long explorative walks.</p>
        `
    },
    {
        id: 'vale',
        content: `
            <p>
                I grew up<br/>
                Calling home<br/>
                Violence and drugs<br/>
                Needles and whores<br/>
                A grey place<br/>
                Where dreams<br/>
                Would hardly grow<br/>
                <br/>
                Then why,<br/>
                For fuck's sake,<br/>
                My eyes prickle<br/>
                For blinking lights,<br/>
                Tall trees and fireflies?<br/>
                Echoing laughter<br/>
                And Tears and fears<br/>
                Choking on nostalgia<br/>
                <br/>
                Shining jewels<br/>
                In the form of people<br/>
                Is all I wanna keep<br/>
                Of what I once<br/>
                Called home
            </p>
            <p align="left">Author: Valentina Bolani</p>
            <p align="left">Year: 2023</p>
        `
    },
    {
        id: 'bro',
        content: `
            <video width="320" height="240" controls>
                <source src="files/bro.mp4" type="video/mp4">
                <source src="files/bro.ogg" type="video/ogg">
                Video non supportato.
            </video>
            <p align="left">Author: Bruno Mameli</p>
            <p align="left">Yeat: 2022</p>
            <p align="left">Description: Aerial view of Marghera.</p>
        `
    },
    {
        id: 'elisabetta',
        content: `
            <div class="img-container grid">
                <div class="grid-sizer"></div>
                <div class="grid-item"><img src="files/elisabetta/1.jpeg" alt="Sample Picture"></div>
                <div class="grid-item"><img src="files/elisabetta/2.jpeg" alt="Sample Picture"></div>
                <div class="grid-item"><img src="files/elisabetta/3.jpeg" alt="Sample Picture"></div>
            </div>
            <p align="left">Author: Elisabetta Castellano</p>
            <p align="left">Year: Various</p>
            <p align="left">Description: Glimpses of Marghera.</p>
        `
    },
    {
        id: 'bro2',
        content: `
            <div class="single-image">
                <img src="files/bro2/1.jpg" alt="Sample Picture"></div>
            </div>
            <p align="left">Author: Bruno Mameli</p>
            <p align="left">Year: 2022</p>
            <p align="left">Description: Glimpse of a residential area of Marghera, near via Fratelli Bandiera.</p>
        `
    },
    {
        id: 'michele',
        content: `
            <div class="single-image">
                <img src="files/michele/1.png" alt="Sample Picture"></div>
            </div>
            <p align="left">Author: Michele Cor&#242;</p>
            <p align="left">Year: 1978 or 1980</p>
            <p align="left">Description: Glimpse of Marghera, showing San Michele church framed by some residential buildings.</p>
        `
    },
    {
        id: 'paola',
        content: `
            <div class="single-image">
                <img src="files/paola/1.jpg" alt="Sample Picture"></div>
            </div>
            <p align="left">Author: Paola Cor&#242;</p>
            <p align="left">Year: 2023</p>
            <p align="left">Description: Photo of the vegetation of Piazzale Martiri delle Foibe, typical roundabout in Marghera.</p>
        `
    },
    {
        id: 'lucia',
        content: `
            <div class="single-image">
                <img src="files/lucia/1.jpg" alt="Sample Picture"></div>
            </div>
            <p align="left">Author: Lucia Portinari</p>
            <p align="left">Year: 2023</p>
            <p align="left">Description: Via Frateli Bandiera in the sunlight.</p>
        `
    },
    {
        id: 'denis',
        content: `
            <div class="single-image">
                <img src="files/denis/1.jpg" alt="Sample Picture"></div>
            </div>
            <p align="left">Author: Denis Ughelini</p>
            <p align="left">Year: 2023</p>
            <p align="left">Description: 30175% FROM MARGHERA.</p>
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

    // Update the current content id
    currentContentId = contentData[randomIndex].id;

    // Display the random content
    const randomContent = contentData[randomIndex];
    document.getElementById('content').innerHTML = randomContent.content;

    // If they're images, apply Masonry
    if (currentContentId == 'vicky' || currentContentId == 'elisabetta') {
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
