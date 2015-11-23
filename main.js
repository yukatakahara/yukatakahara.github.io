$(document).ready(function() {

  $('.activities').hide();

  $('.activities-link').click(function(event){
     $('.activities').toggle('fast', function() {
    });
    return false;
  });

});
