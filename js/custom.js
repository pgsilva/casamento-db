(function ($) {
	"use strict";

	/* ..............................................
		OAuth Init 
		................................................. */
	$(window).on('load', function () {
		console.log("teste")
		fetch(getUri() + "user/auth/register", {
			method: "POST",
			mode: 'cors',
			cache: 'default',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user: "pgsilva0698@gmail.com",
				senha: "123"
			}),
		}).then(function (response) {
			return response.json();
		}).then(function (res) {
			console.log("Token recebido com sucesso!")
			localStorage.setItem('client', JSON.stringify(res))
		}).catch(function () {
			alert("Unexpected error OAuth");
		});
	});

	/* ..............................................
	Loader 
	................................................. */

	$(window).on('load', function () {
		$('.preloader').fadeOut();
		$('#preloader').delay(550).fadeOut('slow');
		$('body').delay(450).css({ 'overflow': 'visible' });
	});

	/* ..............................................
	Navbar Bar
	................................................. */

	$('.navbar-nav .nav-link').on('click', function () {
		var toggle = $('.navbar-toggler').is(':visible');
		if (toggle) {
			$('.navbar-collapse').collapse('hide');
		}
	});

	/* ..............................................
	Fixed Menu
	................................................. */

	$(window).on('scroll', function () {
		if ($(window).scrollTop() > 50) {
			$('.top-header').addClass('fixed-menu');
		} else {
			$('.top-header').removeClass('fixed-menu');
		}
	});

	/* ..............................................
	Gallery
	................................................. */

	$(document).ready(function () {
		$('#processando').css("display", "none");

		$('.popup-gallery').magnificPopup({
			delegate: 'a',
			type: 'image',
			tLoading: 'Loading image #%curr%...',
			mainClass: 'mfp-img-mobile',
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
			},
			image: {
				tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
				titleSrc: function (item) {
					return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
				}
			}
		});

		$("#money").maskMoney({
			prefix: 'R$ ',
			allowNegative: true,
			thousands: '.',
			decimal: ','
		});

		$('form#contactForm').submit(function () {
			$('#processando').css("display", "block");
			$('#submit').css("display", "none");


			var x = $("#money").val().replace("R$ ", "");
			var orderData = {
				quantity: 1,
				description: $("#message").val(),
				price: parseFloat(x.replace(",", "."))
			};
			console.log(orderData)

			fetch(getUri() + "cash/create_preference", {
				method: "POST",
				mode: 'cors',
				cache: 'default',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(orderData),
			}).then(function (response) {
				return response.json();
			}).then(function (preference) {
				createCheckoutButton(preference.id);
			}).catch(function () {
				alert("Unexpected error");
				$('#submit').css("display", "block");
				$('#button-checkout').css("display", "none");
				$('#processando').css("display", "none");
			});
		});
	});

	/* ..............................................
	Smooth Scroll
	................................................. */

	$('a[href*="#"]:not([href="#"])').on('click', function () {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top - 65,
				}, 1000);
				return false;
			}
		}
	});

}(jQuery));

//Create preference when click on checkout button
function createCheckoutButton(preference) {
	$('#submit').css("display", "none");
	$('#processando').css("display", "none");

	var script = document.createElement("script");

	// The source domain must be completed according to the site for which you are integrating.
	// For example: for Argentina ".com.ar" or for Brazil ".com.br".
	script.src = "https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js";
	script.type = "text/javascript";
	script.dataset.preferenceId = preference;
	document.getElementById("button-checkout").innerHTML = "";
	document.querySelector("#button-checkout").appendChild(script);

}

function getUri() {
	var x = window.location.href;
	console.log(x)
	return x.includes('pgsilva.github.io') == true ? 'https://api-casamento-db.herokuapp.com/' : 'http://localhost:3000/'
}