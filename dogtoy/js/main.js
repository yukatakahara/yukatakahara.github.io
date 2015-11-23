var index = 1;

$(document).ready(function() {
  setTimeout(changeImage, 10000);
});

var changeImage = function(){
  index = index+1;
  if(index === 16){ index = 1};

  var image = $("#image img");
  
  console.log(index);

  var src = "images/images/dog_" + index.toString() + ".jpg";
  image.attr('src', src);
  setTimeout(changeImage, 5000);
}



