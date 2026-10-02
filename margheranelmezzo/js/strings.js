// All interface text, in Italian (it) and English (en).
// Pages carry the Italian text in their HTML too, so they still read fine without JavaScript;
// elements marked data-i18n="section.key" are filled from here when the page loads or the language changes.

window.MNM_T = {
  it: {
    common: {
      navGallery: 'Galleria', navProject: 'Progetto', navResearch: 'Ricerca', navContact: 'Contatti', textOnly: 'Solo testo', thanks: 'Ringraziamenti',
      privacy: 'Privacy', skip: 'Vai al contenuto', menu: 'Menu', mainNav: 'Menu principale', footerNav: 'Link utili',
      switchLang: 'Switch to English', otherLang: 'EN', otherLangCode: 'en',
      type: { Photo: 'Foto', Video: 'Video', Audio: 'Musica', Text: 'Testo', Illustration: 'Disegno', Other: 'Altro' },
      types: { Photo: 'Foto', Video: 'Video', Audio: 'Musica', Text: 'Testi', Illustration: 'Disegni', Other: 'Altro' },
      photos: 'foto', noYear: 'anno sconosciuto', anon: 'Anonimo', untitled: 'Senza titolo',
      addTitle: 'Aggiungi la tua opera', addSub: 'Gratis e aperto a tutti. Bastano pochi minuti.',
      ctaTitle: 'Hai una foto, un disegno, una canzone o un racconto su Marghera?',
      symbols: ['Foto', 'Video', 'Musica', 'Testo', 'Disegno'],
      loadError: 'Non riusciamo a caricare le opere in questo momento. Riprova tra poco.'
    },
    home: {
      docTitle: 'Marghera nel Mezzo · Una galleria d’arte comunitaria',
      kicker: 'Una galleria d’arte comunitaria', h1: 'Marghera raccontata da chi la vive',
      lede: 'Foto, video, musica, testi e disegni del quartiere, di ieri e di oggi. Aperta a tutti: guarda le opere o aggiungi la tua.',
      seeTitle: 'Guarda la galleria', seeSub: 'Foto, video, musica e racconti di Marghera',
      galTitle: 'Dalla galleria', galSub: 'Una selezione diversa a ogni visita.', shuffle: 'Mescola', archive: 'Tutto l’archivio',
      walkAlt: 'Una passeggiata di ricerca lungo Via Fratelli Bandiera',
      aboutTitle: 'Cos’è Marghera nel Mezzo',
      about1: 'Un progetto di ricerca partecipativa: con abitanti, artisti, ricercatori e realtà del quartiere abbiamo fatto interviste, passeggiate di ricerca e mappature collettive per far emergere storie, ricordi e desideri di Marghera oggi.',
      about2: 'Da lì è nata questa galleria, che cresce con le opere di chi vive il quartiere. “Nel mezzo”, perché vuole stare tra gli estremi e gli stereotipi: un luogo d’incontro tra generazioni, culture e memorie.',
      aboutLink: 'La storia del progetto', pressLink: 'Leggi la ricerca'
    },
    gallery: {
      docTitle: 'Galleria · Marghera nel Mezzo',
      h1: 'Galleria', lede: 'Tutte le opere di Marghera nel Mezzo. Cerca, filtra per tipo o ordina per anno.', add: 'Aggiungi la tua opera',
      searchLabel: 'Cerca', filters: 'Filtri', typeLabel: 'Tipo', searchPh: 'Cerca un titolo o un autore', searchPhShort: 'Titolo o autore', sortLabel: 'Ordina', filterLabel: 'Filtra per tipo',
      viewLabel: 'Vista', grid: 'Griglia', list: 'Elenco',
      sorts: { new: 'Anno: dal più recente', old: 'Anno: dal più vecchio', author: 'Autore A–Z', title: 'Titolo A–Z' },
      sortsShort: { new: 'dal più recente', old: 'dal più vecchio', author: 'autore A–Z', title: 'titolo A–Z' },
      all: 'Tutte', count: n => (n === 1 ? '1 opera' : `${n} opere`),
      colTitle: 'Titolo', colAuthor: 'Autore', colYear: 'Anno', colType: 'Tipo',
      emptyTitle: 'Nessuna opera trovata', emptyBody: 'Prova con un’altra parola o togli i filtri.', reset: 'Mostra tutte le opere'
    },
    detail: {
      docTitle: 'Opera · Marghera nel Mezzo',
      back: 'Torna alla galleria', by: 'di', prevImg: 'Foto precedente', nextImg: 'Foto successiva', allPhotos: 'Tutte le foto',
      photoN: (i, n) => `Foto ${i} di ${n}`,
      bond: 'Legame con Marghera', place: 'Luogo', share: 'Condividi', copied: 'Link copiato ✓', random: 'Sorprendimi',
      addQ: 'Anche tu hai qualcosa di Marghera?', addCta: 'Aggiungi la tua opera', moreNav: 'Altre opere',
      zoomLabel: 'Foto ingrandita', zoomIn: 'Ingrandisci', zoomOut: 'Riduci', close: 'Chiudi', zoomHint: 'Clicca per ingrandire',
      prevWork: 'Opera precedente', nextWork: 'Opera successiva',
      notFoundTitle: 'Opera non trovata', notFoundBody: 'Forse il link è sbagliato, oppure l’opera non è più nella galleria.',
      listenFull: 'Ascolta la canzone intera su Spotify', textError: 'Non riusciamo a caricare il testo in questo momento.', videoFallback: 'Il tuo browser non riesce a mostrare questo video.'
    },
    upload: {
      docTitle: 'Aggiungi la tua opera · Marghera nel Mezzo',
      h1: 'Aggiungi la tua opera', lede: 'Una foto, un video, una canzone, un racconto o un disegno su Marghera, di ieri o di oggi. È gratis e aperto a tutti.',
      stepsLabel: 'Passaggi', steps: ['Scegli il tipo', 'Raccontaci l’opera', 'Fatto'],
      typeQ: 'Che cosa vuoi condividere?', typeHint: 'Scegli una voce. Potrai cambiarla dopo.',
      types: {
        Photo: ['Foto', 'Una o più fotografie'], Video: ['Video', 'Un link YouTube o un file breve'], Audio: ['Musica o audio', 'Un file o un link Spotify'],
        Text: ['Testo', 'Racconto, poesia, ricordo'], Illustration: ['Disegno', 'Disegni, dipinti, grafiche'], Other: ['Altro', 'Qualcosa di diverso']
      },
      change: 'Cambia', formTitle: 'Form per inviare l’opera', loading: 'Caricamento del modulo…',
      altShort: 'Preferisci mandarla su WhatsApp o per email?', altLink: 'Ecco come', privLink: 'Leggi l’informativa completa',
      videoNote: 'Il modulo accetta file fino a 10 MB: per i video incolla un link (YouTube, Google Drive…) oppure mandalo su WhatsApp.',
      thanksTitle: 'Grazie! Abbiamo ricevuto la tua opera.',
      thanksBody: 'La guardiamo entro una settimana. Se abbiamo domande ti scriviamo, poi la pubblichiamo nella galleria.',
      again: 'Aggiungi un’altra opera', toGallery: 'Torna alla galleria',
      altTitle: 'Preferisci mandarla in un altro modo?',
      altBody: 'Mandaci l’opera su WhatsApp o per email, con il tuo nome e l’anno. Al resto pensiamo noi.',
      nextTitle: 'Cosa succede dopo',
      next: ['Ti scriviamo per confermare che l’abbiamo ricevuta.', 'Guardiamo l’opera entro una settimana.', 'La pubblichiamo nella galleria con il nome che hai scelto.'],
      privTitle: 'La tua privacy, in breve',
      priv: ['Email e telefono servono solo a noi per contattarti.', 'Pubblichiamo l’opera con titolo, anno, descrizione, luogo, il tuo legame con Marghera e il nome che scegli.', 'Puoi chiederci di toglierla quando vuoi.']
    },
    progetto: {
      docTitle: 'Progetto · Marghera nel Mezzo',
      kicker: 'Progetto', h1: 'Marghera, raccontata insieme',
      lede1: 'Un esperimento di ricerca partecipativa e co-design che vuole esplorare, raccontare e valorizzare le identità sociali, culturali e urbane del quartiere di Marghera.',
      lede2: 'È un percorso aperto e collettivo: abitanti, artisti, ricercatori e realtà del territorio insieme, per ascoltare, raccogliere memorie e immaginare il futuro.',
      walkCredit: 'Foto di Bruno Mameli, 2023.', walkAlt: 'Un gruppo di persone cammina per Marghera',
      walkCap: 'Un momento di una passeggiata di ricerca lungo Via Fratelli Bandiera, Marghera.',
      howTitle: 'Come abbiamo lavorato',
      howText: 'Un questionario e una serie di attività partecipative per far emergere le storie, i vissuti, i desideri e le criticità che abitano Marghera oggi.',
      facts: [['128', 'risposte al questionario'], ['3', 'interviste'], ['2', 'passeggiate di ricerca'], ['6', 'mappature collettive']],
      steps: [
        ['01', 'Questionario', 'Il passo che ha coinvolto più persone: 128 risposte a domande come “C’è un luogo in cui ti senti parte della comunità di Marghera?” e “C’è un posto a Marghera in cui non sei mai andato ma che vorresti visitare?”'],
        ['02', 'Interviste', 'Con Laura Boato, StorieStorte e ViviAmo Marghera: da queste conversazioni sono emerse le prime dualità, come memoria e speranza, iniziative dall’alto e dal basso.'],
        ['03', 'Passeggiate di ricerca', 'Da via Fratelli Bandiera alla chiesetta della Rana e ritorno, lungo il confine tra industria e residenza: attività partecipative per raccogliere testimonianze, poi un buffet in giardino.'],
        ['04', 'Mappature collettive', 'Dai temi e luoghi più citati nel questionario, residenti, expat ed esperti di comunità hanno creato le coppie luogo–tema per i portali.']
      ],
      seeIg: 'Guarda su Instagram', newTab: '(si apre in una nuova scheda)',
      mapAlt: 'Illustrazione del percorso delle passeggiate di ricerca',
      leafFront: 'Volantino di una passeggiata di ricerca, fronte', leafBack: 'Volantino di una passeggiata di ricerca, retro',
      leafCap: 'Il volantino di una passeggiata di ricerca.',
      galTitle: 'Perché una galleria',
      galText: 'Durante le passeggiate di ricerca ci siamo accorti che Marghera cambia nel tempo, ma anche a seconda di chi la guarda. Per questo è importante condividere ricordi e sguardi sul quartiere: perché Marghera non sia raccontata solo da chi non la vive, spesso attraverso stereotipi.',
      galText2: 'Così è nata l’idea di una galleria d’arte comunitaria, aperta a tutti, per raccontare Marghera insieme come abbiamo fatto camminando: qui puoi guardare foto, video, musica, testi e disegni di chi abita il quartiere, e aggiungere i tuoi.',
      galCta: 'Guarda la galleria',
      whyTitle: 'Perché “nel mezzo”',
      whyText: 'Perché sta tra gli estremi e gli stereotipi, come luogo d’incontro tra generazioni, culture, memorie e futuri possibili. Un esperimento collettivo di narrazione urbana, dove l’arte aiuta ad abitare il presente e a progettare insieme il futuro del quartiere.',
      logoAlt: 'Logo di Marghera nel Mezzo', pressLink: 'Leggi la ricerca',
      addSub: 'Gratis e aperto a tutti. Bastano pochi minuti.'
    },
    contatti: {
      docTitle: 'Contatti · Marghera nel Mezzo',
      h1: 'Contatti', lede: 'Hai una curiosità, un’idea o vuoi collaborare? Scrivici.',
      emailLabel: 'Email', emailText: 'Per domande sul progetto, collaborazioni e ricerca. Rispondiamo di solito entro qualche giorno.',
      write: 'Scrivi un’email', copy: 'Copia indirizzo', copied: 'Copiato ✓',
      igSub: '@margheranelmezzo', fbSub: '@margheranelmezzo', waSub: 'Per mandarci un’opera o una domanda veloce', waNote: 'Il numero è inglese perché Chiara, che coordina il progetto, vive a Londra.',
      addQ: 'Vuoi aggiungere un’opera?', addLink: 'Usa il modulo', pressQ: 'Ti interessa la ricerca?', pressLink: 'Leggi la ricerca'
    },
    ricerca: {
      docTitle: 'Ricerca · Marghera nel Mezzo',
      h1: 'Ricerca', lede: 'Tra i mondi della periferia di Venezia: da dove nasce Marghera nel Mezzo, come abbiamo lavorato e che cosa abbiamo scoperto.'
    },
    privacy: {
      docTitle: 'Privacy · Marghera nel Mezzo', h1: 'Privacy',
      lede: 'Come trattiamo i dati di chi visita il sito e di chi ci manda un’opera, in parole semplici.'
    },
    thanks: {
      docTitle: 'Ringraziamenti · Marghera nel Mezzo',
      h1: 'Ringraziamenti', lede: 'Marghera nel Mezzo esiste grazie a tante persone. Grazie di cuore a:'
    },
    testo: {
      docTitle: 'Solo testo · Marghera nel Mezzo',
      toggle: 'English', navAdd: 'Aggiungi un’opera', galTitle: 'Galleria',
      note: 'Questa è la versione solo testo di Marghera nel Mezzo: niente immagini, contenuto completo.', fullSite: 'Vai al sito completo con immagini', count: n => (n === 1 ? 'C’è 1 opera.' : `Ci sono ${n} opere.`),
      by: 'di', place: 'Luogo', bond: 'Legame con Marghera', series: n => `Serie di ${n} foto`,
      open: 'Apri la pagina dell’opera', listen: 'Ascolta su Spotify', watchYT: 'Guarda su YouTube', watchFile: 'Guarda il video',
      galLede: 'Tutte le opere della galleria, divise per tipo. Ogni titolo porta alla sua pagina in versione solo testo.',
      social: 'Social e WhatsApp', howSend: 'Come mandarla', formLink: 'Compila il modulo online', formNote: '(una pagina semplice, senza immagini)',
      viewWork: 'Vedi l’opera con le immagini', altPoetry: 'AltText Poetry', photos: 'Le foto', backToGallery: 'Torna alla galleria',
      titles: { home: 'Solo testo · Marghera nel Mezzo', galleria: 'Galleria · Solo testo · Marghera nel Mezzo', opera: 'Opera · Solo testo · Marghera nel Mezzo',
        progetto: 'Progetto · Solo testo · Marghera nel Mezzo', ricerca: 'Ricerca · Solo testo · Marghera nel Mezzo', contatti: 'Contatti · Solo testo · Marghera nel Mezzo',
        aggiungi: 'Aggiungi la tua opera · Solo testo · Marghera nel Mezzo', grazie: 'Ringraziamenti · Solo testo · Marghera nel Mezzo', privacy: 'Privacy · Solo testo · Marghera nel Mezzo' }
    }
  },

  en: {
    common: {
      navGallery: 'Gallery', navProject: 'Project', navResearch: 'Research', navContact: 'Contact', textOnly: 'Text only', thanks: 'Thanks',
      privacy: 'Privacy', skip: 'Skip to content', menu: 'Menu', mainNav: 'Main menu', footerNav: 'Useful links',
      switchLang: 'Passa all’italiano', otherLang: 'IT', otherLangCode: 'it',
      type: { Photo: 'Photo', Video: 'Video', Audio: 'Music', Text: 'Text', Illustration: 'Drawing', Other: 'Other' },
      types: { Photo: 'Photos', Video: 'Videos', Audio: 'Music', Text: 'Texts', Illustration: 'Drawings', Other: 'Other' },
      photos: 'photos', noYear: 'year unknown', anon: 'Anonymous', untitled: 'Untitled',
      addTitle: 'Add your work', addSub: 'Free and open to all. It only takes a few minutes.',
      ctaTitle: 'Got a photo, drawing, song or story about Marghera?',
      symbols: ['Photo', 'Video', 'Music', 'Text', 'Drawing'],
      loadError: 'We can’t load the works right now. Please try again shortly.'
    },
    home: {
      docTitle: 'Marghera nel Mezzo · A community art gallery',
      kicker: 'A community art gallery', h1: 'Marghera, told by the people who live it',
      lede: 'Photos, videos, music, writing and drawings of the neighbourhood, past and present. Open to everyone: browse the works or add your own.',
      seeTitle: 'Browse the gallery', seeSub: 'Photos, videos, music and stories of Marghera',
      galTitle: 'From the gallery', galSub: 'A different selection every visit.', shuffle: 'Shuffle', archive: 'Full archive',
      walkAlt: 'A research walk along Via Fratelli Bandiera',
      aboutTitle: 'What is Marghera nel Mezzo',
      about1: 'A participatory research project: with residents, artists, researchers and local groups we held interviews, research walks and collective mapping to bring out the stories, memories and hopes of Marghera today.',
      about2: 'This gallery grew out of that work, and keeps growing with pieces by the people who live here. “In the middle”, because it sits between extremes and stereotypes: a meeting place for generations, cultures and memories.',
      aboutLink: 'The project story', pressLink: 'Read the research'
    },
    gallery: {
      docTitle: 'Gallery · Marghera nel Mezzo',
      h1: 'Gallery', lede: 'Every work in Marghera nel Mezzo. Search, filter by type or sort by year.', add: 'Add your work',
      searchLabel: 'Search', filters: 'Filters', typeLabel: 'Type', searchPh: 'Search a title or author', searchPhShort: 'Title or author', sortLabel: 'Sort', filterLabel: 'Filter by type',
      viewLabel: 'View', grid: 'Grid', list: 'List',
      sorts: { new: 'Year: newest first', old: 'Year: oldest first', author: 'Author A–Z', title: 'Title A–Z' },
      sortsShort: { new: 'newest first', old: 'oldest first', author: 'author A–Z', title: 'title A–Z' },
      all: 'All', count: n => (n === 1 ? '1 work' : `${n} works`),
      colTitle: 'Title', colAuthor: 'Author', colYear: 'Year', colType: 'Type',
      emptyTitle: 'No works found', emptyBody: 'Try another word or clear the filters.', reset: 'Show all works'
    },
    detail: {
      docTitle: 'Work · Marghera nel Mezzo',
      back: 'Back to the gallery', by: 'by', prevImg: 'Previous photo', nextImg: 'Next photo', allPhotos: 'All photos',
      photoN: (i, n) => `Photo ${i} of ${n}`,
      bond: 'Connection to Marghera', place: 'Place', share: 'Share', copied: 'Link copied ✓', random: 'Surprise me',
      addQ: 'Got something from Marghera too?', addCta: 'Add your work', moreNav: 'More works',
      zoomLabel: 'Enlarged photo', zoomIn: 'Zoom in', zoomOut: 'Zoom out', close: 'Close', zoomHint: 'Click to enlarge',
      prevWork: 'Previous work', nextWork: 'Next work',
      notFoundTitle: 'Work not found', notFoundBody: 'The link may be wrong, or the work is no longer in the gallery.',
      listenFull: 'Listen to the full song on Spotify', textError: 'We can’t load the text right now.', videoFallback: 'Your browser can’t play this video.'
    },
    upload: {
      docTitle: 'Add your work · Marghera nel Mezzo',
      h1: 'Add your work', lede: 'A photo, video, song, story or drawing about Marghera, past or present. It’s free and open to everyone.',
      stepsLabel: 'Steps', steps: ['Choose the type', 'Tell us about it', 'Done'],
      typeQ: 'What would you like to share?', typeHint: 'Pick one. You can change it later.',
      types: {
        Photo: ['Photo', 'One or more photos'], Video: ['Video', 'A YouTube link or a short file'], Audio: ['Music or audio', 'A file or a Spotify link'],
        Text: ['Text', 'Story, poem, memory'], Illustration: ['Drawing', 'Drawings, paintings, graphics'], Other: ['Other', 'Something different']
      },
      change: 'Change', formTitle: 'Form to send your work', loading: 'Loading the form…',
      altShort: 'Rather send it on WhatsApp or by email?', altLink: 'Here’s how', privLink: 'Read the full privacy notice',
      videoNote: 'The form accepts files up to 10 MB: for videos, paste a link (YouTube, Google Drive…) or send it on WhatsApp.',
      thanksTitle: 'Thank you! We’ve received your work.',
      thanksBody: 'We’ll look at it within a week. If we have questions we’ll get in touch, then we’ll publish it in the gallery.',
      again: 'Add another work', toGallery: 'Back to the gallery',
      altTitle: 'Rather send it another way?',
      altBody: 'Send us your work on WhatsApp or by email, with your name and the year. We’ll take care of the rest.',
      nextTitle: 'What happens next',
      next: ['We write to you to confirm we’ve received it.', 'We look at your work within a week.', 'We publish it in the gallery under the name you chose.'],
      privTitle: 'Your privacy, in short',
      priv: ['Your email and phone are only for us to contact you.', 'We publish the work with its title, year, description, place, your connection to Marghera and the name you choose.', 'You can ask us to remove it at any time.']
    },
    progetto: {
      docTitle: 'Project · Marghera nel Mezzo',
      kicker: 'Project', h1: 'Marghera, told together',
      lede1: 'Marghera nel Mezzo is a participatory research and co-design project. It sets out to explore, tell and celebrate the social, cultural and urban identity of the Marghera neighbourhood.',
      lede2: 'It is an open, collective process: residents, artists, researchers and local groups together, listening, gathering memories and imagining the future.',
      walkCredit: 'Photography by Bruno Mameli, 2023.', walkAlt: 'A group of people walking through Marghera',
      walkCap: 'A moment from a research walk along Via Fratelli Bandiera, Marghera.',
      howTitle: 'How we worked',
      howText: 'A survey and a series of participatory activities to bring out the stories, experiences, hopes and problems that shape Marghera today.',
      facts: [['128', 'survey responses'], ['3', 'interviews'], ['2', 'research walks'], ['6', 'collective mappings']],
      steps: [
        ['01', 'Survey', 'The step that involved the most people: 128 answers to questions like “Is there a place where you feel part of the Marghera community?” and “Is there a place in Marghera you’ve never been to but would like to visit?”'],
        ['02', 'Interviews', 'With Laura Boato, StorieStorte and ViviAmo Marghera: these conversations revealed the first dualities, like memory and hope, top-down and bottom-up.'],
        ['03', 'Research walks', 'From Via Fratelli Bandiera to the chiesetta della Rana and back, along the line between industry and homes: participatory activities to gather stories, then a buffet in the garden.'],
        ['04', 'Collective mapping', 'From the themes and places mentioned most in the survey, residents, expats and community experts paired each place with a theme for the portals.']
      ],
      seeIg: 'See on Instagram', newTab: '(opens in a new tab)',
      mapAlt: 'Illustration of the research walk route',
      leafFront: 'Research walk leaflet, front', leafBack: 'Research walk leaflet, back',
      leafCap: 'A research walk leaflet.',
      galTitle: 'Why a gallery',
      galText: 'During the research walks we noticed that Marghera changes over time, but also depending on who is looking at it. That is why sharing memories and perspectives on the neighbourhood matters: so that Marghera is not described only by people who don’t live there, often through stereotypes.',
      galText2: 'That gave us the idea of a community art gallery, open to everyone, where we can tell Marghera’s story together just as we did while walking: here you can see photos, videos, music, writing and drawings by the people of the neighbourhood, and add your own.',
      galCta: 'See the gallery',
      whyTitle: 'Why “in the middle”',
      whyText: 'Because it sits between the extremes and the stereotypes, as a meeting place for generations, cultures, memories and possible futures. A collective experiment in urban storytelling, where art helps us live in the present and plan the neighbourhood’s future together.',
      logoAlt: 'Marghera nel Mezzo logo', pressLink: 'Read the research',
      addSub: 'Free and open to everyone. It only takes a few minutes.'
    },
    contatti: {
      docTitle: 'Contact · Marghera nel Mezzo',
      h1: 'Contact', lede: 'Curious, got an idea or want to collaborate? Get in touch.',
      emailLabel: 'Email', emailText: 'For questions about the project, collaborations and research. We usually reply within a few days.',
      write: 'Write an email', copy: 'Copy address', copied: 'Copied ✓',
      igSub: '@margheranelmezzo', fbSub: '@margheranelmezzo', waSub: 'To send us a work or a quick question', waNote: 'It’s a UK number because Chiara, who coordinates the project, lives in London.',
      addQ: 'Want to add a work?', addLink: 'Use the form', pressQ: 'Interested in the research?', pressLink: 'Read the research'
    },
    ricerca: {
      docTitle: 'Research · Marghera nel Mezzo',
      h1: 'Research', lede: 'In-between the worlds of Venice’s suburb: where Marghera nel Mezzo comes from, how we worked and what we found.'
    },
    privacy: {
      docTitle: 'Privacy · Marghera nel Mezzo', h1: 'Privacy',
      lede: 'How we handle the data of people who visit the site and people who send us a work, in plain words.'
    },
    thanks: {
      docTitle: 'Thanks · Marghera nel Mezzo',
      h1: 'Thanks', lede: 'Marghera nel Mezzo exists thanks to many people. Heartfelt thanks to:'
    },
    testo: {
      docTitle: 'Text only · Marghera nel Mezzo',
      toggle: 'Italiano', navAdd: 'Add a work', galTitle: 'Gallery',
      note: 'This is the text-only version of Marghera nel Mezzo — no images, full content.', fullSite: 'View the full visual site', count: n => (n === 1 ? 'There is 1 work.' : `There are ${n} works.`),
      by: 'by', place: 'Place', bond: 'Connection to Marghera', series: n => `Series of ${n} photos`,
      open: 'Open the work’s page', listen: 'Listen on Spotify', watchYT: 'Watch on YouTube', watchFile: 'Watch the video',
      galLede: 'Every work in the gallery, grouped by type. Each title leads to its own text-only page.',
      social: 'Social media and WhatsApp', howSend: 'How to send it', formLink: 'Fill in the online form', formNote: '(a simple page, no images)',
      viewWork: 'See the work with images', altPoetry: 'AltText Poetry', photos: 'The photos', backToGallery: 'Back to the gallery',
      titles: { home: 'Text only · Marghera nel Mezzo', galleria: 'Gallery · Text only · Marghera nel Mezzo', opera: 'Work · Text only · Marghera nel Mezzo',
        progetto: 'Project · Text only · Marghera nel Mezzo', ricerca: 'Research · Text only · Marghera nel Mezzo', contatti: 'Contact · Text only · Marghera nel Mezzo',
        aggiungi: 'Add your work · Text only · Marghera nel Mezzo', grazie: 'Thanks · Text only · Marghera nel Mezzo', privacy: 'Privacy · Text only · Marghera nel Mezzo' }
    }
  }
};
