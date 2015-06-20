// *******************************************
// MAKE IMAGES RETINA
// ******************************************/

// To make images retina, add a class "2x" to the img element
// and add a <image-name>@2x.png image. Assumes jquery is loaded.
 
function isRetina() {
	var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
					  (min--moz-device-pixel-ratio: 1.5),\
					  (-o-min-device-pixel-ratio: 3/2),\
					  (min-resolution: 1.5dppx)";
 
	if (window.devicePixelRatio > 1)
		return true;
 
	if (window.matchMedia && window.matchMedia(mediaQuery).matches)
		return true;
 
	return false;
};
 
 
function retina() {
	
	if (!isRetina())
		return;
	
	$("img.2x").map(function(i, image) {
		
		var path = $(image).attr("src");
		
		path = path.replace(".png", "@2x.png");
		path = path.replace(".jpg", "@2x.jpg");
		
		$(image).attr("src", path);
	});
};

// *******************************************
// SET HERO HEIGHT
// ******************************************/

function heroHeight() {
  function setHeight() {
    var WindowHeight = $(window).innerHeight();
    var AboutHeight = WindowHeight * 0.75;
    $('.hero').css('min-height', WindowHeight);
    $('.about-hero').css('min-height', AboutHeight);
  };
  setHeight();
  
  $(window).resize(function() {
    setHeight();
  });
 }

// *******************************************
// MANAGE HEADER SCROLLING
// ******************************************/

function transformHeader() {
  HeaderHeight = $('.header').height();
  ScrollPos = $(document).scrollTop();

  if (ScrollPos > HeaderHeight) {
  	$('.header').addClass('scrolled');
  }
  else {
  	$('.header').removeClass('scrolled');
  }
 }

 function headerStyle() {
 	transformHeader();
 	
 	$(window).scroll(function() {
 		transformHeader();
 	});
 }

// *******************************************
// RANDOM FEATURE GENERATOR
// ******************************************/

function randomFeature() {
	features = ['Sk8er Boi was a pretty good song',
				'Did somebody say \'fonts\'',
				'(bird noises)',
				'Moving is very difficult'];
	max = features.length;
	i = Math.floor(Math.random() * max);
	result = features[i];

	$('.feature-header').text(result);
}

// *******************************************
// SMOOTH SCROLLING
// https://css-tricks.com/snippets/jquery/smooth-scrolling/
// ******************************************/

$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 800);
        return false;
      }
    }
  });
});

// *******************************************
// CONTACT FORM HANDLER
// ******************************************/

//guestbook sending
function sendMessage() {
	$('#contact').on('submit', function(){
		var nameVal = $('#entry_367070669').val();
		var emailVal = $('#entry_52027613').val();
		var msgVal = $('#entry_1707629466').val();
		
		if (validateInput() == true) { //fix this soon
			var name = encodeURIComponent(nameVal);
			var email = encodeURIComponent(emailVal);
			var msg = encodeURIComponent(msgVal);

			var nameID = "entry.367070669";
			var emailID = "entry.52027613";
			var msgID = "entry.1707629466";

			var baseURL = 'https://docs.google.com/forms/d/1Ol5ykSAqSMjDZ8ykryZ8rEkosA6LtJimGszphld7zz8/formResponse?';

			var submitRef = '&submit=Submit';
			var submitURL = (baseURL + nameID + "=" + name + "&" + emailID + "=" + email + "&" + msgID + "=" + msg + submitRef);
			console.log(submitURL);
			$(this)[0].action = submitURL;
			$(".submit-error").hide();
			$(".submit-confirm").show();
		}
		else return;
	})
}

//input validation
function validateInput(name, message) {
	val = $('.input-val').val();
	if (val == "10") {
		return true;
	}
	else {
		$(".submit-error").show();
	}
}

// *******************************************
// DOCUMENT READY
// ******************************************/

$(document).ready(function() {
	heroHeight();
	randomFeature();
	retina();
	headerStyle();
	sendMessage();
});