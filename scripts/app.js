$(function() {
	var $overlay = $('.overlay'),
		$body = $('body'),
		$window = $(window);
	$overlay.find('.overlay__close').on('touchstart click', function(e) {
			if(e && e.preventDefault) {
				e.preventDefault();
			}
			$body.toggleClass('overlay-visible', false);
			return false;
		}
	);

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
		.on('touchstart click focus', function(e) {
			var $edit = $(e.currentTarget);
			$edit
				.data('placeholder', $edit.attr('placeholder'))
				.attr('placeholder', '');
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
})