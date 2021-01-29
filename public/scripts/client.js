$(document).ready(function() {

  //Stops XSS by converting the string to a text node
  //returns the innerHTML of that text node 

  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //Returns a new html article to index.html also all-tweets.css works with
  //the created html article

const createTweetElement = function(tweetObj) {
  const $tweet = $('<article>').addClass('tweet');
  const daysAgo = daysSinceTweet(tweetObj["created_at"]);
  
  const innerHTML = `
  <header>
      <img src= ${tweetObj.user.avatars}>
      <span>${tweetObj.user.name}</span>
      <span class="handle">${tweetObj.user.handle}</span>
  </header>
  <span>${escape(tweetObj.content.text)}</span>
  <footer>
    <span>${daysAgo} days ago</span>
    <span class="interactOptions"><i class="fab fa-font-awesome-flag"></i><i class="fas fa-retweet"></i><i class="fas fa-heart"></i></span>
  </footer>
  `;

  $tweet.append(innerHTML);
  return $tweet;
};

//When tweets are created this will calculate the days
//since the tweet was posted 
const daysSinceTweet = function(epochOfTweet) {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const millisecondsInDay = 86400000;

  const timeDifference = currentTime - epochOfTweet;
  const dayDifference = timeDifference / millisecondsInDay;

  return Math.floor(dayDifference);
};

//Goes through a array of objects and runs our createTweetElement function

const renderTweets = function(tweetObjArr) {
  for (const tweet of tweetObjArr) {
    const $tweet = createTweetElement(tweet);
    $('section.all-tweets').prepend($tweet);
  }
};

//Makes a GET request to the database
//Uses the renderTweets function for each array it gets from the database
const loadTweets = function() {
  $.ajax('/tweets/', { method: 'GET' })
    .then(function(allTweets) {
      renderTweets(allTweets);
    });
};

loadTweets();

//If the text box is empty it will give you an error
//If the text box has more then 140 characters it will give you an error
//If the text is under 140 characters and the text box is not empty it will send a POST request 
//It will then make a GET request from the database /tweets/
//Then use the renderTweets function to add the tweet to the page

$('.new-tweet form').on('submit', function(event) {
  event.preventDefault();
  $('.new-tweet p').empty().slideUp();
    const $form = $(this);
    const newTweetTextStr = $form.children('textarea').val();

    if (!newTweetTextStr) {
      $('.new-tweet p').append('<b>Error:</b> You must have atleast one character in your tweet.');
      setTimeout(() => {
        $('.new-tweet p').slideDown();
      }, 500);
    } else if (newTweetTextStr.length > 140) {
      $('.new-tweet p').append("<b>Error:</b> Your tweet is too long.");
      setTimeout(() => {
        $('.new-tweet p').slideDown();
      }, 500);
    } else {
      const tweet = $form.serialize();
      $.ajax({ url: "/tweets/", method: 'POST', data: tweet })
      .then (function(successfulPost) {
        return $.ajax('/tweets/', { method: 'GET' })
      })
      .then (function(allTweetsArr) {
        $form[0].reset();
        $form.children('span').text(140);
        const latestTweet = [allTweetsArr[allTweetsArr.length - 1]];
        renderTweets(latestTweet);
      })
      .fail(function(err) {
        alert(err.responseJSON.error);
      })
    }
  })

  $('#newTweetButton').click(function() {
    $('section.new-tweet').slideToggle("slow");
    $('section.new-tweet textarea').focus();
  });
});