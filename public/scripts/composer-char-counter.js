$(document).ready(function() {
//Counts the charactersunder the textarea
//Number turns red when you go under 0 characters left

  const remainingChars = document.getElementById('my-remaining-chars');
  $('#my-textarea').on('input', function() {
    const theCounter = $(this).siblings().children('.counter');
    const remaining = 140 - $(this).val().length;

    if (remaining < 0) {
      theCounter.addClass('redcounter'); 
    } else if (remaining >= 0) {
      theCounter.removeClass('redcounter');
    }

    remainingChars.textContent = `${remaining}`;
  });
 
});
