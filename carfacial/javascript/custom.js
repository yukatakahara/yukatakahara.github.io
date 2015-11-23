$(document).ready(function() {

  var cookie_array = "";

	jQuery('#mycarousel').jcarousel({
  	size: 38,
    visible: 8,
		scroll: 8 
	});

	$("#qty").val(1);
	$("#hiddenModalContent").hide();
	$("#checkout_page").hide();
	$("#mirror_checkbox").attr("checked",false)

	$("#mycarousel img").addClass("selected_color2");
    
  //if cookie exist populate json cart object and total items on screen
  ReadCookieAndUpdateCart();

  function ReadCookieAndUpdateCart(){

    cookie = readCookie("carfacial");
    if(cookie){
      cookie_array = cookie.split(" ");
    
      var cookie_item = "";

      for(i=0;i<cookie_array.length;i++){
        cookie_item = cookie_array[i].split(",");
        cart.push( { car_num: cookie_item[0], qty: cookie_item[1], color: cookie_item[2], mirror: cookie_item[3] } );
        total_price += mycars[cart[i].car_num].price * cart[i].qty; 
        num_of_items += parseInt(cart[i].qty);
      }
      
      //update total items on screen
      $("#num_of_items").text(num_of_items + " items");

      //update total price
      $("#total_price").text("$" + total_price.toFixed(2));
      
      createCookie("carfacial",cookie,7);

    }
    else{
      cookie = "";
    }

  }

 	$("#mycarousel img").click(function() {
			
			var big_image;	
			big_image = UpdateCarImage(this);
			UpdateCarInfo(big_image);
		  	

			$("#qty").val(1);
		
			$("#colors a img").removeClass("selected_color");
			$("#color_black").addClass("selected_color");

      //if mirror exist - show mirror checkbox
      if(mycars[current_car].mirror=="yes"){
        $("#mirror").show();
      }
      else{
        $("#mirror").hide();
      }

	    $("#mirror_checkbox").attr("checked",false)

   });


	function UpdateCarImage(element)
	{
			var big_image = "big_" + $(element).attr("src");
			big_image = big_image.replace("big_images/","big_");
			big_image = big_image.replace("png","jpg");
	 	 	$("#main_pic").attr('src',"images/" + big_image);
		
			return big_image;
	}	
	
	function UpdateCarInfo(big_image)
	{
			var start_car_number = big_image.indexOf("car");

			start_car_number = start_car_number + 3;
			var finish_car_number = big_image.indexOf(".");
			
			car_number = big_image.substring(start_car_number,finish_car_number) - 1;
			current_car = car_number;

			var name = mycars[car_number].name;
			var price = mycars[car_number].price;
			var size = mycars[car_number].size;
//			var qty = $("#qty").val();

			$("#name").text(name);
			$("#price").text("$" + price);
			$("#size").text(size);

			current_price = price;
	}


	$("#add_to_cart").click(function() {

		var current_qty =parseInt($("#qty").val());

		 if ($("#mirror_checkbox").is(":checked"))
        {
          isMirror = true;
        }
    else
        {     
          isMirror = false;
        }

		UpdateNumItemOnScreen(current_qty);
		UpdateCart(current_qty);
		UpdateTotalPrice(current_qty);
	  SaveCookie();

		$("#cart_status").effect("highlight", {color: "#ffffff"}, 1000);


  });



  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }


  //pop up

  //LOADING POPUP
  //Click the button event!
  $(".popuptest").click(function(){
      //centering with css
      centerPopup();
      //load popup
      loadPopup();
      UpdateCartPage();
      });


  $("#checkout_nav").click(function(){
      $("#contactArea").hide();
      $("#checkout_page").show();
      $("#popup_title").text('Checkout');

      PopulateGoogleForm();
      UpdateCartPage();
      UpdateCheckoutPage();
      });

  function PopulateGoogleForm(){
    var i;
    var google_str="";
    var paypal_str="";
    var mirror = "";
    var description = "";

    for (i=0;i<cart.length;i++){		


      if (cart[i].mirror===true)
      {
        mirror = " (Mirror image).";
      }
      else
      {
        mirror = "";
      }

      description = mycars[cart[i].car_num].name + ", " + cart[i].color + mirror;

      google_str += "<input type=\"hidden\" name=\"item_name_" +  String(i+1)  + "\" value=\"" + description + "\"/>";
      google_str += "<input type=\"hidden\" name=\"item_description_" + String(i+1) + "\" value=\"" + mycars[cart[i].car_num].size + " Car Sticker" + ". Color: " + cart[i].color + "\"/>";
      google_str += "<input type=\"hidden\" name=\"item_quantity_" + String(i+1) + "\" value=\"" + cart[i].qty + "\"/>";
      google_str += "<input type=\"hidden\" name=\"item_price_" + String(i+1) + "\" value=\"" + mycars[cart[i].car_num].price + "\"/>";

      paypal_str += "<input type=\"hidden\" name=\"item_name_" +  String(i+1)  + "\" value=\"" + description + "\">";
      paypal_str += "<input type=\"hidden\" name=\"amount_" + String(i+1) + "\" value=\"" + mycars[cart[i].car_num].price + "\">";
      paypal_str += "<input type=\"hidden\" name=\"quantity_" +  String(i+1)  + "\" value=\"" + cart[i].qty + "\">";
    }

    $("#google_form").append(google_str);
    $("#paypal_form").append(paypal_str);
  }

  $("#back_to_checkout_nav").click(function(){
      $("#contactArea").show();
      $("#checkout_page").hide();
      $("#popup_title").text('Please review your order');
      });

  $("#continue_shopping").click(function(){
      disablePopup();
      });

  //CLOSING POPUP
  //Click the x event!
  $("#popupContactClose").click(function(){
      disablePopup();
      });
  //Click out event!
  $("#backgroundPopup").click(function(){
      disablePopup();
      });
  //Press Escape event!
  $(document).keypress(function(e){
      if(e.keyCode==27 && popupStatus==1){
      disablePopup();
      }
      });

  $("#update_cart").click(function(){

      var i;
      var old_qty;
      var new_qty;
      var total_price_change=0;

      for (i=0;i<cart.length;i++){		
      old_qty = parseInt(cart[i].qty);
      new_qty = parseInt(document.getElementById("cart_row_qty" + i).value);

      //non numerical. in this case it can only be empty field.
      if (isNaN(new_qty)) {new_qty = 0;}

      total_price_change += (new_qty - old_qty) * mycars[cart[i].car_num].price;
      update_unit(i,new_qty-old_qty);
      if (new_qty==0) RemoveItemfromCart(i);

      }

      UpdateTotalPriceOnScreen(total_price_change);	
      UpdateCartPage();	
  });

  $("#colors a img").click(function() {
      var color = $(this).attr("src");

      $("#colors a img").removeClass("selected_color");
      $(this).addClass("selected_color");

      color = extract_color_from_image_name(color);		
      current_color = color;
      color = "Select a color: " + color;

      $("#color_selection").text(color);

      });

  function extract_color_from_image_name(image_name){

    image_name = image_name.replace("images/","");
    image_name = image_name.substring(0,1).toUpperCase() + image_name.substring(1,image_name.length-4);

    return image_name;
  }




});


/* public vars */ //{

var mycars = [
{"name": "Three Swirl", "size": "20\"x10\"", "price": "12.99", "mirror": "yes"},
{"name": "Hana", "size": "20\"x15\"", "price": "12.99", "mirror": "yes"},
{"name": "Dragon", "size": "8\"x8\"", "price": "9.99", "mirror": "yes"},
{"name": "Blossom", "size": "14\"x8\"", "price": "12.99", "mirror": "yes"},
{"name": "Deco", "size": "8\"x8\"", "price": "9.99", "mirror": "no"},
{"name": "Outline Swirl", "size": "20\"x10\"", "price": "12.99", "mirror": "yes"},
{"name": "Grapevine", "size": "20\"x8\"", "price": "12.99", "mirror": "yes"},
{"name": "Cherry", "size": "6\"x6\"", "price": "9.99", "mirror": "yes"},
{"name": "Disco", "size": "12\"x8\"", "price": "9.99", "mirror": "yes"},
{"name": "Kona", "size": "15\"x10\"", "price": "12.99", "mirror": "yes"},
{"name": "Fairy", "size": "20\"x20\"", "price": "12.99", "mirror": "yes"},
{"name": "Aki", "size": "12\"x6\"", "price": "12.99", "mirror": "yes"},
{"name": "Guardian Angel", "size": "10\"x10\"", "price": "9.99", "mirror": "yes"},
{"name": "Curly Leaves", "size": "20\"x15\"", "price": "12.99", "mirror": "yes"},
{"name": "Madam", "size": "14\"x7\"", "price": "9.99", "mirror": "no"},
{"name": "Autumn", "size": "12\"x8\"", "price": "9.99", "mirror": "yes"},
{"name": "Ribbon", "size": "20\"x15\"", "price": "12.99", "mirror": "yes"},
{"name": "Five Leaf", "size": "5\"x5\"", "price": "9.99", "mirror": "yes"},
{"name": "Skel", "size": "15\"x5\"", "price": "12.99", "mirror": "yes"},
{"name": "Splash", "size": "15\"x8\"", "price": "9.99", "mirror": "yes"},
{"name": "Clove", "size": "9\"x5\"", "price": "9.99", "mirror": "yes"},
{"name": "Sage", "size": "20\"x10\"", "price": "12.99", "mirror": "yes"},
{"name": "Wings", "size": "8\"x8\"", "price": "9.99", "mirror": "yes"},
{"name": "Tribal", "size": "20\"x7\"", "price": "12.99", "mirror": "yes"},
{"name": "Gift", "size": "20\"x10\"", "price": "12.99", "mirror": "yes"},
{"name": "Tripulp", "size": "20\"x10\"", "price": "12.99", "mirror": "yes"},
{"name": "Multi Swirl", "size": "20\"x16\"", "price": "12.99", "mirror": "yes"},
{"name": "Elize", "size": "25\"x20\"", "price": "12.99", "mirror": "yes"},
{"name": "Riley", "size": "17\"x10\"", "price": "9.99", "mirror": "yes"},
{"name": "Estelle", "size": "20\"x20\"", "price": "12.99", "mirror": "yes"},
{"name": "Circ", "size": "10\"x6\"", "price": "9.99", "mirror": "yes"},
{"name": "Single Fall Leaf", "size": "12\"x8\"", "price": "9.99", "mirror": "yes"},
{"name": "Autumn Leaves", "size": "20\"x15\"", "price": "12.99", "mirror": "yes"},
{"name": "Retro", "size": "15\"x12\"", "price": "12.99", "mirror": "yes"},
{"name": "Jazz", "size": "23\"x20\"", "price": "12.99", "mirror": "yes"},
{"name": "Illusion", "size": "20\"x15\"", "price": "12.99", "mirror": "yes"},
{"name": "Shrub", "size": "20\"x10\"", "price": "12.99", "mirror": "yes"},
{"name": "Fall Leaf", "size": "12\"x8\"", "price": "9.99", "mirror": "yes"}
];

var cart = [];
var num_of_items=0;
var total_price=0;
var current_car=0;	
var current_price=20;	
var current_color="Black";
var shipping = 6.99;
var isMirror = false;
var cookie = "";
//}

function UpdateCartPage(){
  var str="";
  var i=0;
  var item_info;
  var item_qty;
  var item_unit_price;
  var item_total;
  var mirror = "";

  if(cart.length > 0){
    str += "<table class=\"cart_table\">";
    str += "<tr class=\"table_top_row\"><td class=\"table_item\">Item Name</td><td class=\"table_price\">Price</td><td></td><td class=\"table_qty\">Quantity</td><td></td><td class=\"table_total\">Total</td><td></td></tr>";
    for (i=0;i<cart.length;i++){
      if(cart[i].mirror===true)
      {
        mirror = " (Mirror image)";
      }

      item_info =  mycars[cart[i].car_num].name  + ", " + cart[i].color + mirror;
      item_qty = cart[i].qty;
      item_unit_price = mycars[cart[i].car_num].price;
      item_total = item_unit_price * item_qty;
      item_total = item_total.toFixed(2);

      str += "<tr id=\"cart_row" + i +  "\"><td>" + item_info + "</td>";
      str += "<td class=\"table_price2\">$" + item_unit_price + "</td>";
      str += "<td>X</td>";
      str += "<td class=\"table_qty2\"><input type=\"text\" onKeyUp=\"javascript:DeleteNonNumeric(event," + i + ");true\" id=\"cart_row_qty" + i + "\" size=\"1\" maxlength=\"2\" value=\"" + item_qty + "\" /></td>";
      str += "<td class=\"table_equal_sign\" >=</td>";
      str += "<td class=\"table_total2\">$" + item_total  + "</td>";
      str += "<td class=\"table_remove\"><a style=\"text-decoration:underline;\" onClick=\"javascript:RemoveItemfromCart(" + i + ");return true\">remove</a></td></tr>";
    }

    str += "</table>";
    $("#cartarea").html("");
    $("#cartarea").append(str);
    $(".sub_total").text("$" + total_price.toFixed(2));
    $(".shipping").text("$" + shipping);
    $(".total").text("$" + parseFloat(total_price + shipping).toFixed(2));

    $(".totals").show();
    $("#update_cart").show();
    $("#checkout_nav").show();

    SaveCookie();
  }
  else{
    $("#popup_title").text("Your cart is empty");
    $(".cart_table").hide();
    $(".totals").hide();
    $("#update_cart").hide();
    $("#checkout_nav").hide();

    createCookie("carfacial","",-1);

  }
}


function UpdateCheckoutPage(){
  var str="";
  var i=0;
  var item_info;
  var item_qty;
  var item_unit_price;
  var item_total;
  var mirror = "";

    str += "<table class=\"cart_table\">";
    str += "<tr class=\"table_top_row\"><td class=\"table_item\">Item Name</td><td class=\"table_price\">Price</td><td></td><td class=\"table_qty\">Quantity</td><td></td><td class=\"table_total\">Total</td><td></td></tr>";
    for (i=0;i<cart.length;i++){
      if(cart[i].mirror===true)
      {
        mirror = " (Mirror image)";
      }

      item_info =  mycars[cart[i].car_num].name  + ", " + cart[i].color + mirror;
      item_qty = cart[i].qty;
      item_unit_price = mycars[cart[i].car_num].price;
      item_total = item_unit_price * item_qty;
      item_total = item_total.toFixed(2);

      str += "<tr class=\"cart_row" + i +  "\"><td>" + item_info + "</td>";
      str += "<td class=\"table_price2\">$" + item_unit_price + "</td>";
      str += "<td>X</td>";
      str += "<td class=\"table_qty2\">" + item_qty + "</td>";
      str += "<td class=\"table_equal_sign\" >=</td>";
      str += "<td class=\"table_total2\">$" + item_total  + "</td>";
      str += "<td id=\"table_remove\"></td></tr>";
    }

    str += "</table>";
    $("#cartarea2").html("");
    $("#cartarea2").append(str);
    $("#sub_total").text("$" + total_price.toFixed(2));
    $("#shipping").text("$" + shipping);
    $("#total").text("$" + parseFloat(total_price + shipping).toFixed(2));

    $(".totals").show();
}

function UpdateNumItemOnScreen(qty)
{
  num_of_items = qty + num_of_items;
  $("#num_of_items").text(num_of_items + " items");
}

function UpdateTotalPriceOnScreen(price)
{
  total_price += price;
  $("#total_price").text("$ " + total_price.toFixed(2));
}

function UpdateCart(qty, ItemFoundInCart)
{ 
  var ItemFoundInCart = -1;

  ItemFoundInCart = IsItemInCart();
  if (ItemFoundInCart > -1){
    cart[ItemFoundInCart].qty += qty;
  }
  else{
    cart.push( { car_num: current_car, qty: qty, color: current_color, mirror: isMirror } );
	}

}

function UpdateTotalPrice(current_qty){
	
			total_price +=parseFloat(current_price) * current_qty;
			$("#total_price").text("$" + total_price.toFixed(2));

}

//iterate on cart items and seek for current_car
function IsItemInCart()
{
		var i;	
	
     for (i=0;i<cart.length;i++){
			if(cart[i].car_num === current_car &&  cart[i].color === current_color && cart[i].mirror === isMirror){ return i;}
		}

	return -1;

}


//POP UP
/***************************/
//@Author: Adrian "yEnS" Mato Gondelle
//@website: www.yensdesign.com
//@email: yensamg@gmail.com
//@license: Feel free to use it, but keep this credits please!					
/***************************/

//SETTING UP OUR POPUP
//0 means disabled; 1 means enabled;
var popupStatus = 0;

//loading popup with jQuery magic!
function loadPopup(){
	//loads popup only if it is disabled
	if(popupStatus==0){
		$("#qty").hide();
		$("#backgroundPopup").css({
			"opacity": "0.7"
		});
		$("#backgroundPopup").show();
		$("#popupContact").show();
		popupStatus = 1;
	}
}

//disabling popup with jQuery magic!
function disablePopup(){
	//disables popup only if it is enabled
	if(popupStatus==1){
		$("#qty").show();
		$("#backgroundPopup").hide();
		$("#popupContact").hide();
		$("#contactArea").show();
		$("#checkout_page").hide();
		$("#popup_title").text('Please review your order');
		popupStatus = 0;
	}
}

//centering popup
function centerPopup(){
	//request data for centering
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
	var popupHeight = $("#popupContact").height();
	var popupWidth = $("#popupContact").width();
	//centering
	$("#popupContact").css({
		"position": "absolute",
		"top": windowHeight/2-popupHeight/2,
		"left": windowWidth/2-popupWidth/2
	});
	//only need force for IE6
	
	$("#backgroundPopup").css({
		"height": windowHeight
	});
	
}

function RemoveItemfromCart(item_num)
{	//remove from UI
	$("#cart_row" + item_num).remove();

	//deduct total items from UI
	UpdateNumItemOnScreen((cart[item_num].qty) * -1);	
	UpdateTotalPriceOnScreen(cart[item_num].qty * mycars[cart[item_num].car_num].price * -1);

	//remove from cart object
	cart.splice(item_num, 1);

	UpdateCartPage();	
} 

function update_unit(item_num,qty)
{	
	//add unit to total items from UI
	UpdateNumItemOnScreen(qty);	

	//add unit to cart object
	  cart[item_num].qty = parseInt(cart[item_num].qty) + qty;
}
 
function DeleteNonNumeric(e,item_num){
	var keynum;
	var keychar;
	var numcheck;
	var new_qty;

	if(window.event) // IE
		{
		keynum = e.keyCode;
		}
	else if(e.which) // Netscape/Firefox/Opera
		{
		keynum = e.which;
		}
	keychar = String.fromCharCode(keynum);
	numcheck = /\d/;
	if (!numcheck.test(keychar)){
		//delete last char
		new_qty = document.getElementById("cart_row_qty" + item_num).value;
		new_qty = stripAlphaChars(new_qty);
		//update qty textbox
		document.getElementById("cart_row_qty" + item_num).value = new_qty;
		
	}
}

function stripAlphaChars(pstrSource) { 
	var m_strOut = new String(pstrSource); 
  m_strOut = m_strOut.replace(/[^0-9]/g, ''); 

  return m_strOut; 
}


function SaveCookie(){
  //iterate over cart and add to string
  //save cookie

  var i;

  cookie = "";
  for (i=0;i<cart.length;i++){		
    cookie += cart[i].car_num + "," +  cart[i].qty + "," +  cart[i].color + "," +  cart[i].mirror + " ";
  }

  createCookie("carfacial",cookie,7);
}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}


function preloader() {

  heavyImage = new Image(); 
  heavyImage.src = "../images/big_car2.jpg";
  heavyImage.src = "../images/big_car3.jpg";
  heavyImage.src = "../images/big_car4.jpg";
  heavyImage.src = "../images/big_car5.jpg";
  heavyImage.src = "../images/big_car6.jpg";
  heavyImage.src = "../images/big_car7.jpg";
  heavyImage.src = "../images/big_car8.jpg";

}
