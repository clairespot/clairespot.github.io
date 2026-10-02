// Marghera nel Mezzo — tutte le opere della galleria.
//
// Per aggiungere un'opera: copia uno dei blocchi { ... } qui sotto, incollalo nella lista
// (separato dagli altri da una virgola) e cambia i valori.
//   type:   Photo, Video, Audio, Text, Illustration
//   credit: name (nome), nickname (soprannome), anonymous (anonimo)
//   src:    percorso dell'immagine (o lista di immagini per una serie), del video,
//           oppure il link YouTube / Spotify
//   thumb:  l'immagine di anteprima nella galleria. Serve solo per i video caricati sul sito:
//           YouTube e Spotify la danno in automatico (ma si può sempre scegliere un'immagine)
//   thumbPosition: se l'anteprima viene tagliata, quale parte tenere visibile:
//           "left" (sinistra), "right" (destra), "top" (in alto), "bottom" (in basso).
//   text:   per i testi, scritto tra due accenti gravi ` ... ` (si può andare a capo)
//   alt:    l'AltText Poetry di Valentina Bolani: la poesia che descrive l'immagine, tra accenti gravi ` ... `.
//           Per una serie di foto, una lista con una poesia per foto, nello stesso ordine: [`...`, `...`]
//           (si legge con i lettori di schermo e nelle pagine solo testo)
//   description_en: la descrizione in inglese (se manca, in inglese si vede quella italiana)
//   title:  se l'opera non ha titolo lascia "": il sito scrive «Senza titolo» (in inglese «Untitled»)
//   lang:   la lingua dell'opera se non è l'italiano, per esempio "en" (aiuta i lettori di schermo)
//   id:     (facoltativo) il nome che compare nel link dell'opera; se manca si usa il titolo
//   place, bond, description: si possono lasciare vuoti ""

window.ARCHIVE = [
  {
    "title": "Marghera nel Mezzo",
    "author": "Chiara Portinari",
    "credit": "name",
    "year": "2025",
    "type": "Illustration",
    "src": "GRAPHICS/illustration1.png",
    "description": "Curiosità: Chiara è la persona che ha coordinato la creazione di questa galleria.",
    "description_en": "Fun fact: Chiara is the person who coordinated the creation of this gallery.",
    "place": "",
    "bond": ""
  },
  {
    "title": "Mare nostro",
    "author": "StorieStorte",
    "credit": "name",
    "year": "2019",
    "type": "Audio",
    "src": "https://open.spotify.com/embed/track/3gMAa6S4shjXFiApQKgKwG?utm_source=generator",
    "thumb": "IMAGES/storiestorte-cover.jpg",
    "thumbPosition": "left",
    "description": "StorieStorte raccontano di persone, destini e viaggi contromano. Due chitarre, due bicchieri e una voce del diversamente perfetto.",
    "description_en": "StorieStorte tell stories of people, fates and journeys against the flow. Two guitars, two glasses and a voice of the differently perfect.",
    "place": "",
    "bond": ""
  },
  {
    "title": "Venesia no mor",
    "author": "StorieStorte",
    "credit": "name",
    "year": "2019",
    "type": "Audio",
    "src": "https://open.spotify.com/embed/track/7LYhHIbF4W3cAHoVQlDszU?utm_source=generator",
    "thumb": "IMAGES/storiestorte-cover.jpg",
    "thumbPosition": "left",
    "description": "StorieStorte raccontano di persone, destini e viaggi contromano. Due chitarre, due bicchieri e una voce del diversamente perfetto.",
    "description_en": "StorieStorte tell stories of people, fates and journeys against the flow. Two guitars, two glasses and a voice of the differently perfect.",
    "place": "",
    "bond": ""
  },
  {
    "title": "Marghera notturna",
    "author": "La Vicky",
    "credit": "name",
    "year": "2023",
    "type": "Photo",
    "src": [
      "IMAGES/multi_photo_artist1/img1.jpg",
      "IMAGES/multi_photo_artist1/img2.jpg",
      "IMAGES/multi_photo_artist1/img3.jpg",
      "IMAGES/multi_photo_artist1/img4.jpg",
      "IMAGES/multi_photo_artist1/img5.jpg",
      "IMAGES/multi_photo_artist1/img6.jpg",
      "IMAGES/multi_photo_artist1/img7.jpg",
      "IMAGES/multi_photo_artist1/img8.jpg",
      "IMAGES/multi_photo_artist1/img9.jpg",
      "IMAGES/multi_photo_artist1/img10.jpg",
      "IMAGES/multi_photo_artist1/img11.jpg"
    ],
    "description": "",
    "place": "",
    "bond": ""
  },
  {
    "title": "Marghera",
    "author": "Elisabetta Castellano",
    "credit": "name",
    "year": "",
    "type": "Photo",
    "src": [
      "IMAGES/multi_photo_artist2/submission1.jpeg",
      "IMAGES/multi_photo_artist2/submission2.jpeg"
    ],
    "description": "",
    "place": "",
    "bond": ""
  },
  {
    "title": "30175% de Marghera",
    "author": "Denis Ughelini",
    "credit": "name",
    "year": "2023",
    "type": "Photo",
    "src": "IMAGES/photo1.jpg",
    "description": "",
    "place": "",
    "bond": ""
  },
  {
    "title": "Via Fratelli Bandiera",
    "author": "Lucia Portinari",
    "credit": "name",
    "year": "2023",
    "type": "Photo",
    "src": "IMAGES/photo2.jpg",
    "description": "",
    "place": "",
    "bond": ""
  },
  {
    "title": "Piazzale Radaelli",
    "author": "Paola Corò",
    "credit": "name",
    "year": "1968",
    "type": "Photo",
    "src": "IMAGES/photo3.jpg",
    "description": "",
    "place": "",
    "bond": ""
  },
  {
    "title": "Scorcio sulla chiesa di San Michele Arcangelo",
    "author": "Michele Corò",
    "credit": "name",
    "year": "1978",
    "type": "Photo",
    "src": "IMAGES/photo5.jpg",
    "description": "",
    "place": "",
    "bond": ""
  },
  {
    "title": "Particolare di abitazione",
    "author": "Bruno Mameli",
    "credit": "name",
    "year": "2022",
    "type": "Photo",
    "src": "IMAGES/photo6.JPG",
    "description": "",
    "place": "",
    "bond": ""
  },
  {
    "title": "Vista aerea di Marghera",
    "author": "Bruno Mameli",
    "credit": "name",
    "year": "2022",
    "type": "Video",
    "src": "VIDEO/video1.mp4",
    "thumb": "IMAGES/video1-preview.jpg",
    "description": "",
    "place": "",
    "bond": ""
  },
  {
    "title": "The Bridge per il Concerto contro la Guerra",
    "author": "The Bridge",
    "credit": "name",
    "year": "2022",
    "type": "Video",
    "src": "VIDEO/video2.mp4",
    "thumb": "IMAGES/video2-preview.jpg",
    "description": "Lorenzo Lazzari, Luca Boscolo, Marta Grespi, Giovanna dei Rossi, Giulio Rossato, Riccardo Vendramin",
    "place": "",
    "bond": ""
  },
  {
    "title": "Il Coraggio della Rivoluzione",
    "author": "StorieStorte",
    "credit": "name",
    "year": "2019",
    "type": "Video",
    "src": "https://www.youtube.com/embed/qmQ94i8sYSU",
    "thumb": "IMAGES/youtube-coraggio-preview.jpg",
    "description": "StorieStorte raccontano di persone, destini e viaggi contromano. Due chitarre, due bicchieri e una voce del diversamente perfetto.",
    "description_en": "StorieStorte tell stories of people, fates and journeys against the flow. Two guitars, two glasses and a voice of the differently perfect.",
    "place": "",
    "bond": ""
  },
  {
    "title": "The Sea That Was",
    "author": "Valentina Bolani",
    "credit": "name",
    "year": "2023",
    "type": "Text",
    "description": "Valentina vive ad Amsterdam, mai troppo lontana dall'acqua. Scrive perché può.",
    "description_en": "Valentina lives in Amsterdam, never too far from the water, and writes because she can.",
    "lang": "en",
    "place": "",
    "bond": "",
    "text": `I grew up
Calling home
Violence and drugs
Needles and whores
A grey place
Where dreams
Would hardly grow

Then why,
For fuck's sake,
My eyes prickle
For blinking lights,
Tall trees and fireflies?
Echoing laughter
And Tears and fears
Choking on nostalgia

Shining jewels
In the form of people
Is all I wanna keep
Of what I once
Called home`
  }
];
