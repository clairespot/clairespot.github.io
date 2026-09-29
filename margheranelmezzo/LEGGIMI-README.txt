MARGHERA NEL MEZZO - lighter images + location data removed
=============================================================

Everything in this folder is a drop-in replacement: same names and same
folders as in your repo (clairespot.github.io/margheranelmezzo/).

WHAT CHANGED
- 21 images resized for screens and re-saved with ALL metadata removed
  (camera info, edit history, and the GPS coordinates in IMAGES/photo6.JPG).
- VIDEO/video1.mp4 (aerial view): 4K -> 720p, 61 MB -> 13 MB, metadata removed.
- IMAGES/photo3.jpg and IMAGES/photo5.jpg replace photo3.png / photo5.png
  (they are photos, so JPEG is ~6x lighter). archive.json points to the new names.
- archive.js, random.html, progetto.html: images now load only when scrolled
  into view (loading="lazy"); videos only fetch a preview until played.
- progetto.html, index.html, search.html: fixed unbalanced { } brackets in
  the page styles (the "} expected" warning). The pages look the same.

HOW TO UPLOAD (GitHub website)
1. Open the repo > margheranelmezzo folder > "Add file" > "Upload files".
2. Drag in the CONTENTS of this folder (IMAGES, GRAPHICS, VIDEO and the 6 files).
   Files with the same name are overwritten.
3. Commit. The site updates within a few minutes (hard-refresh to check).

(With GitHub Desktop: copy the contents over your local margheranelmezzo
folder, commit, push.)

AFTERWARDS YOU CAN DELETE (no longer used)
- IMAGES/photo3.png
- IMAGES/photo5.png
- Do NOT upload this LEGGIMI-README.txt file.

IF YOU EDITED archive.json SINCE 28 SEPT 2026
Don't overwrite it - just change "IMAGES/photo3.png" to "IMAGES/photo3.jpg"
and "IMAGES/photo5.png" to "IMAGES/photo5.jpg".
