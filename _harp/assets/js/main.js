// *******************************************
// MAKE IMAGES RETINA
// ******************************************/

// To make images retina, add a class "2x" to the img element
// and add a <image-name>@2x.png image. Assumes jquery is loaded.
 
function isRetina() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1)); 
    }
};
 
 
function retina() {
    if (!isRetina()) {
      return;
    }
    
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
    var AboutHeight = WindowHeight * 0.4;
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
  headerHeight = $('.header').height();
  scrollPosition = $(document).scrollTop();

  if (scrollPosition > headerHeight) {
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
    $('#contact').submit(function (e) {
      e.preventDefault();
      $.ajax({
        url: '//formspree.io/sarah@sarahlim.com',
        method: 'POST',
        data: $(this).serialize(),
        dataType: 'json',
        beforeSend: function() {
          $('.submit-process').show();
        },
        success: function(data) {
          $('.submit-error').hide();
          $('.submit-process').hide();
          $('.submit-confirm').show();
        },
        error: function(err) {
          $('.submit-error').show();
        }
      });
    });
}

// *******************************************
// DOCUMENT READY
// ******************************************/

$(document).ready(function() {
    heroHeight();
    retina();
    headerStyle();
    sendMessage();
});