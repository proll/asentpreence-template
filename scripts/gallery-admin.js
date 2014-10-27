$(function() {
	var $body = $('body'),
		$window = $(window);

	// we counts on this is a product carousel
	var GalleryAdmin = function () {
		var $overlay,
			$cont,
			slider,
			href = '',
			image = '',
			description = '',
			jqxhr;

		function init(new_href, img_url, descr) {
			if(!$overlay) {
				$overlay = $('<div class="galleryadmin-overlay"/>')
				$overlay.append(
					'<div class="galleryadmin-overlay__cont"></div>'+
					'<a href="add" class="galleryadmin-overlay__add"><i class="i i-plus"></i></a>'+
					'<a href="close" class="galleryadmin-overlay__close"><i class="i i-closew"></i></a>');
				$overlay.find('.galleryadmin-overlay__close').on('.touchstart click', _.bind(hidePopup, this));
				$cont = $overlay.find('.galleryadmin-overlay__cont');
				$body.append($overlay);
			}

			image = img_url;
			description = descr;

			if(new_href !== href) {
				href = new_href;
				loadPopup(href);
			}
			showPopup();
			// activateSwiper();
		}
		function showPopup(e) {
			if(e && e.preventDefault) {
				e.preventDefault();
			}
			$body.toggleClass('galleryadmin-overlay-visible', true);
			return false;
		}

		function hidePopup(e) {
			if(e && e.preventDefault) {
				e.preventDefault();
			}
			$body.toggleClass('galleryadmin-overlay-visible', false);
			return false;
		}

		function loadPopup(href) {
			$cont.toggleClass('loading', true);
			$cont.html('');

			if(jqxhr) jqxhr.abort();
			jqxhr = 
				$.getJSON(href)
					.done(function(result) {
						$cont.html('<img class="galleryadmin-overlay__img" src="' + image + '">');
						console.log(result);
						// $slides = $cont.find('.overlay__slide');

						// num = 0;
						// count = $slides.length;

						// activateSwiper();
					})
					.fail(function() {
					})
					.always(function() {
						$cont.toggleClass('loading', false);
					});
		}


		function toggleSlide(num) {
			if(slider) {
				slider.slide(num, 400);
			}
		}

		function swipeEnd(index, el) {
			num = index;
		}

		function activateSwiper () {
			slider =  new Swipe($cont.get(0), {
				startSlide: num,
				speed: 400,
				continuous: 	false,
				disableScroll: false,
				stopPropagation: false,
				callback: _.bind(swipeEnd, this)
				// transitionEnd: function(index, elem) {}
			});

		}

		return {
			init: init
		}
	}

	var galadm = new GalleryAdmin(),
		$item;

	$('.summary-item a').on('touchstart click', function(e) {
		e.preventDefault();
		$item = $(e.currentTarget).parents('.summary-item');

		var click_trough_url = $item.data('click-through-url'),
			img_url = $item.find('.summary-thumbnail>img').data('image'),
			description = $item.find('.summary-excerpt p').text();
		if(!!click_trough_url) {
			galadm.init(click_trough_url+'?format=json', img_url, description);
		}
		return false;
	})


})