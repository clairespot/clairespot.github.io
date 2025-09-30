let isScrolling = false;

document.addEventListener("DOMContentLoaded", () => {
  // Look for the arrows globally on the page
  const leftArrow = document.querySelector('.arrow.left');
  const rightArrow = document.querySelector('.arrow.right');
  
  // If the arrows are missing, exit the function
  if (!leftArrow || !rightArrow) return;

  // Identify the scrollable container (either .wall-project or .marghera)
  const container = document.querySelector('.wall-project') || document.querySelector('.marghera');
  
  // If neither container is found, exit the function
  if (!container) return;

  const scrollAmount = window.innerWidth;

  // Function to handle scrolling via arrow clicks
  const handleArrowClick = (direction) => {
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  };

  // Event listener for mouse wheel scroll
  document.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

    e.preventDefault();

    if (isScrolling) return;
    isScrolling = true;

    container.scrollBy({
      left: e.deltaY,
      behavior: 'smooth'
    });

    setTimeout(() => {
      isScrolling = false;
    }, 500);
  }, { passive: false });

  // Add event listeners to the arrows to scroll the container
  leftArrow.addEventListener('click', () => handleArrowClick(-1));
  rightArrow.addEventListener('click', () => handleArrowClick(1));
});
