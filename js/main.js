$(document).ready(function() {
  $('.selectpicker').selectpicker();
  $('#language-selector').change(function() {
    if($(this).val() == "en") {
      $('.en').show();
      $('.it').hide();
    } else {
      $('.en').hide();
      $('.it').show();
    }
  });
  $('.en').hide();

  $(window).scroll(function() {
    $('.hide-me').each(function(i) {
      var objCenter = $(this).position().top + ($(this).outerHeight() / 2);
      var windowBottom = $(window).scrollTop() + $(window).height();
      /* If the object is half visible in the window, fade it in */
      if(windowBottom > objCenter) {
        $(this).animate({ 'opacity': '1' }, 1500);
      }
    });
  });
});
