/* ==============================================
		 Loader
	============================================== */

 //setTimeout(function (){
 //                preloader.style.display = "none"; 
 //                document.querySelector(".body").style.visibility = "visible";          
 //              }, 5000);

// var preloader = document.querySelector("#preloader");
// document.onreadystatechange = function() {
//     if (document.readyState !== "complete") { 
//         document.querySelector("body").style.visibility = "hidden"; 
//         preloader.style.visibility = "visible"; 
//     } else {
//         setTimeout(function (){
//             preloader.style.display = "none"; 
//             document.querySelector("body").style.visibility = "visible";          
//           }, 5000);
//     } 
// }; 

// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
// window.onscroll = function() {scrollFunction()};

// function scrollFunction() {
//   if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
//     document.getElementById("navbar").style.padding = "0px 0px";
//   } else {
//     document.getElementById("navbar").style.padding = "20px 0px";
//   }
// }

/* ==============================================
		 Menu
	============================================== */
function openNav() {
	document.getElementById("mySidenav").style.width = "250px";
	//document.querySelector(".body").style.opacity = "0.7";
}
function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
	//document.querySelector(".body").style.opacity = "1";
}


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function openMenu() {
	document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
	if (!event.target.matches('.dropbtn')) {
		var dropdowns = document.getElementsByClassName("dropdown-content");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
	else if (event.target.matches('#mdlUserMenu')){
		openNav();
    }
}

/* ==============================================
  Fixed menu
=============================================== */
$(window).on('scroll', function () {
	if ($(window).scrollTop() > 150) {
		$('.topMenu').addClass('fixed-menu');
	} else {
		$('.topMenu').removeClass('fixed-menu');
	}
});

/* ==============================================
	  Get Translated text from database
  ============================================== */
function getTranslatedText(keyword) {
	$.ajax({
		url: window.location.origin.concat("/lookup/GetLkpDetails/").concat(keyword + '/').concat(language),
		type: 'GET',
		data: {},
		success: function (result) {
			TranslatorList = result;
			result.forEach(label => {
				let Array = document.querySelectorAll(`[data-label='${label.keyword}']`);
				if (Array.length > 0) {
					Array.forEach(item => {
						item.innerHTML = label.lookupDetailsDescription;
					});
				}
			});
		},
		error: function () {
			alert('error');
		}
	});
}
getTranslatedText('HomeText');
/* ==============================================
	  Stats counter
  ============================================== */
$(document).ready(function () {
	function count($this) {
		var current = parseInt($this.html(), 10);
		// var increment = parseInt($this.getAttribute('data-counter'));
		var increment = 50;
		current = current + increment;
		$this.html(++current);
		if (current > $this.data('count')) {
			$this.html($this.data('count'));
		} else {
			setTimeout(function () {
				count($this)
			}, 100);
		}
	}
	$(".stat_count").each(function () {
		$(this).data('count', parseInt($(this).html(), 10));
		$(this).html('0');
		count($(this));
	});
});
/* ==============================================
	   Reviews slideshow
  ============================================== */

function plusDivs(n) {
	showDivs(slideIndex += n);
}

function showDivs(n) {
	var i;
	var x = document.getElementsByClassName("quotes");
	if (n > x.length) { slideIndex = 1 }
	if (n < 1) { slideIndex = x.length };
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
		// x[i].classList.addClass();
	}
	x[slideIndex - 1].style.display = "grid";
}
/* ==============================================
	Scroll to top  
============================================== */

if ($('#scroll-to-top').length) {
	var scrollTrigger = 100, // px
		backToTop = function () {
			var scrollTop = $(window).scrollTop();
			if (scrollTop > scrollTrigger) {
				$('#scroll-to-top').addClass('show');
			} else {
				$('#scroll-to-top').removeClass('show');
			}
		};
	backToTop();
	$(window).on('scroll', function () {
		backToTop();
	});
	$('#scroll-to-top').on('click', function (e) {
		$('html,body').animate({
			scrollTop: 0
		}, 700);
	});
}