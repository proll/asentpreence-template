$(function() {
	var $overlay = $('.overlay'),
		$body = $('body'),
		$window = $(window);
	// $overlay.find('.overlay__close').on('touchstart click', function(e) {
	// 		if(e && e.preventDefault) {
	// 			e.preventDefault();
	// 		}
	// 		$body.toggleClass('overlay-visible', false);
	// 		return false;
	// 	}
	// );

	$('.collection__item-mark-a').on('touchstart click', function(e) {
			if(e && e.preventDefault) {
				e.preventDefault();
			}
			$body.toggleClass('overlay-visible', true);
			return false;
		}
	);

	$('.header__menu').on('touchstart click', function(e) {
			if(e && e.preventDefault) {
				e.preventDefault();
			}
			$body.toggleClass('menu-visible');
			return false;
		}
	);

	// contact - edits
	// consol
	$('.field-element[name=email]')
		.on('focus', function(e) {
			var $edit = $(e.currentTarget),
				txt = $edit.attr('placeholder');
			if(!!txt) {
				$edit
					.data('placeholder', txt)
					.attr('placeholder', '');
			}
			return true;
		})
		.on('blur', function(e) {
			var $edit = $(e.currentTarget),
				placeholder_text = $edit.data('placeholder');
			$edit.attr('placeholder', placeholder_text);
			return true;
		})

	var $collections,
		$collection,
		$marks,
		$mark,
		iw = 768,				// w of image
		ih = 1004,				// h of image
		cw,						// w of collection
		ch,						// h of collection
		kw,						// cw/iw
		kh,						// ch/ih
		ki = iw/ih,				// w/h for image
		kc,						// w/h for collection
		k = 0,					// K for scaling coordinates
		translate = '',			// string with css translate for mark
		mx, 					// mark x translate
		my,						// mark y translate
		mmargin = 10;			// margin from end of container

	function positionMark() {
		// _.forEach($collections, function(collection, i) {
		// 	$collection = $(collection);
		// 	cw = $collection.outerWidth();
		// 	ch = $collection.outerHeight();
		// 	kw = cw/iw;
		// 	kh = ch/ih;
		// 	kc = cw/ch;

		// 	if(kc>=ki) {
		// 		k = kw;
		// 	} else {
		// 		k = kh;
		// 	}

		// 	$marks = $collection.find('.collection__item-mark');
		// 	_.forEach($marks, function(mark, i) {
		// 		$mark = $(mark);
		// 		mx = k*($mark.data('x')-iw/2);
		// 		my = k*($mark.data('y')-ih/2);
		// 		if(mx < -cw/2 + mmargin) {
		// 			mx = -cw/2 + mmargin;
		// 		} else if(mx > cw/2 - mmargin) {
		// 			mx = cw/2 - mmargin;
		// 		}
		// 		if(my < -ch/2 + mmargin) {
		// 			my = -ch/2 + mmargin;
		// 		} else if(my > ch/2 - mmargin) {
		// 			my = ch/2 - mmargin;
		// 		}

		// 		translate = 'translate(' + mx + 'px, ' + my + 'px)'; 
		// 		$mark.css({
		// 			'-webkit-transform': translate,
		// 			   '-moz-transform': translate,
		// 			    '-ms-transform': translate,
		// 			     '-o-transform': translate,
		// 			        'transform': translate
		// 		})
		// 	});
		// });

		var $marks = $('.collection__item-mark');
		_.forEach($marks, function(mark, i) {
			$mark = $(mark);
			mx = (100*$mark.data('x')/iw).toPrecision(4);
			my = (100*$mark.data('y')/ih).toPrecision(4);
			$mark.css({
				top:  mx + '%',
				left: my + '%'
			})
		});
	}

	// if it is "collection" site
	if(location.href.indexOf('/collection')!==-1) {
		$collections = $('.collection__grid-itm');
		positionMark();
		// $window.on('resize', _.throttle(_.bind(positionMark, this), 500));

	}

	// we counts on this is a product carousel
	var ProductGallery = function () {
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
				$overlay = $('<div class="overlay"/>')
				$overlay.append(
					'<div class="overlay__slides-cont"></div>'+
					'<a href="close" class="overlay__close"><i class="i i-close"></i></a>'+
					'<span href="prev" class="overlay__prev"><i class="i i-al"></i></span>'+
					'<span href="next" class="overlay__next"><i class="i i-ar"></i></span>');
				$overlay.find('.overlay__close').on('.touchstart click', _.bind(hidePopup, this));
				$slides_cont = $overlay.find('.overlay__slides-cont');
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
				$.get(href)
					.done(function(result) {
						$slides_cont.html(result);
						$slides = $slides_cont.find('.overlay__slide');

						num = 0;
						count = $slides.length;

						activateSwiper();
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
			this.slider =  new Swipe($slides_cont.get(0), {
				startSlide: num,
				speed: 400,
				continuous: 	false,
				disableScroll: false,
				stopPropagation: false,
				callback: _.bind(swipeEnd, this)
				// transitionEnd: function(index, elem) {}
			});

			$overlay.find('.overlay__prev', _.bind(prevSlide, this))
			$overlay.find('.overlay__next', _.bind(nextSlide, this))
		}

		function prevSlide() {
			console.log(num, count);
			if((num - 1) >= 0) {
				num--;
			}
			toggleSlide(num);
		}

		function nextSlide() {
			console.log(num, count);
			if((num + 1) < count) {
				num++;
			}
			toggleSlide(num);
		}

		return {
			init: init
		}
	}

	var pg = new ProductGallery();
	$('[data-target=popup]').on('touchstart click', function(e) {
		e.preventDefault();
		var href = $(e.currentTarget).attr('href');
		pg.init(href);
		return false;
	})


})