$(function() {
	var $body = $('body'),
		$window = $(window);

	// we counts on this is a product carousel
	var GalleryAdmin = function () {
		var $overlay,
			$slides_cont,
			$slides,
			num = 0,
			count = 0,
			slider,
			href = '',
			jqxhr;

		function init(new_href) {
			if(!$overlay) {
				$overlay = $('<div class="galleryadmin-overlay"/>')
				$overlay.append(
					'<div class="galleryadmin-overlay__slides-cont"></div>'+
					'<a href="close" class="galleryadmin-overlay__close"><i class="i i-closew"></i></a>');
				$overlay.find('.galleryadmin-overlay__close').on('.touchstart click', _.bind(hidePopup, this));
				$slides_cont = $overlay.find('.galleryadmin-overlay__slides-cont');
				$body.append($overlay);
			}
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
			$body.toggleClass('overlay-visible', true);
			return false;
		}

		function hidePopup(e) {
			if(e && e.preventDefault) {
				e.preventDefault();
			}
			$body.toggleClass('overlay-visible', false);
			return false;
		}

		function loadPopup(href) {
			$slides_cont.toggleClass('loading', true);
			$slides_cont.html('');

			if(jqxhr) jqxhr.abort();
			jqxhr = 
				$.getJSON(href)
					.done(function(result) {
						// $slides_cont.html(result);
						// $slides = $slides_cont.find('.overlay__slide');

						// num = 0;
						// count = $slides.length;

						// activateSwiper();
					})
					.fail(function() {
					})
					.always(function() {
						$slides_cont.toggleClass('loading', false);
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
			slider =  new Swipe($slides_cont.get(0), {
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
		var click_trough_url;
		e.preventDefault();
		$item = $(e.currentTarget).parents('.summary-item');

		click_trough_url = $item.data('click-through-url');
		if(!!click_trough_url) {
			galadm.init(click_trough_url+'?format=json');
		}
		return false;
	})


})