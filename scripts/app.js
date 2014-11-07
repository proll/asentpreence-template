$(function() {
	var $body = $('body'),
		$window = $(window);

	// Main .menu
	$('.header__menu').on('touchstart click', function(e) {
			if(e && e.preventDefault) {
				e.preventDefault();
			}
			$body.toggleClass('menu-visible');
			return false;
		}
	);

	// Contact page
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

	// Collection pages
	// we counts on this is a product carousel
	var ProductGallery = function () {
		var $overlay,
			$slides_cont,
			$slides = [],
			product_id = 0,
			num = 0,
			count = 0,
			slider,
			hrefs = [],
			jqxhr,
			first_open = true;

		function init(new_hrefs, prod_id) {
			if(!prod_id) {
				prod_id = 0
			}
			product_id = prod_id;

			if(!$overlay) {
				$overlay = $('<div class="overlay dark-bg"/>')
				$overlay.append(
					'<div class="overlay__slides-cont"><div class="overlay__slides"></div></div>'+
					'<a href="close" class="overlay__close"><i class="i i-close"></i></a>'+
					'<span href="prev" class="overlay__prev"><i class="i i-al"></i></span>'+
					'<span href="next" class="overlay__next"><i class="i i-ar"></i></span>');
				$overlay.find('.overlay__close').on('click', _.bind(hidePopup, this));
				$overlay.find('.overlay__prev').on('click', _.bind(prevSlide, this))
				$overlay.find('.overlay__next').on('click', _.bind(nextSlide, this))
				$slides_cont = $overlay.find('.overlay__slides-cont');
				$body.append($overlay);
			}
			if(first_open) {
				$slides = [];
				hrefs = new_hrefs;
				first_open = false;
				loadPopup(hrefs);
			} else {
				num = getNumFromID(product_id);
				toggleSlide(num);
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

		function loadPopup(hrefs) {
			$slides_cont.toggleClass('loading', true);
			$slides_cont.find('.overlay__slides').html('');

			if(jqxhr) jqxhr.abort();

			var ajax_objects = [];
			_.forEach(hrefs, function(href) {
				ajax_objects.push($.get(href));
			})

			jqxhr = 
				$.when.apply($, ajax_objects)
					.done(function() {
						_.forEach(arguments, function(result) {
							$slides_cont.find('.overlay__slides').append(result[0]);
							$slides = $slides_cont.find('.overlay__slide');

							num = getNumFromID(product_id);
							count = $slides.length;

							activateSwiper();
						})
					})
					.fail(function() {
					})
					.always(function() {
						$slides_cont.toggleClass('loading', false);
					});
		}


		function getNumFromID(p_id) {
			var l = $slides.length;
			if(l) {
				for (var i = 0; i < l; i++) {
					if($slides.eq(i).data('id') == p_id) {
						return i;
					}
				};
			}
			return 0;
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
				disableScroll:  false,
				stopPropagation: false,
				callback: _.bind(swipeEnd, this)
				// transitionEnd: function(index, elem) {}
			});

		}

		function prevSlide() {
			if((num - 1) >= 0) {
				num--;
			}
			toggleSlide(num);
		}

		function nextSlide() {
			if((num + 1) < count) {
				num++;
			}
			toggleSlide(num);
		}

		return {
			init: init
		}
	}


	var ItemMark = function() {
		var mark_template = '' +
		'<div class="collection__item-mark" style="top:{{top}}%; left:{{left}}%">' + 
			'<a href="{{href}}" data-id="{{id}}" class="collection__item-mark-a"><i class="i i-plus"></i></a>'+
		'</div>';
		function init($item) {
			var $item_body,
				marks,
				t='';
			if($item.length) {
				$item_body = $item.find('.collection__grid-itm-body');
				if($item_body.length && !!$item_body.text()) {
					marks = JSON.parse($item_body.text());
					_.forEach(marks, function(mark) {
						if(!!mark.id) {
							t = mark_template
									.replace('{{href}}', $item.data('href'))
									.replace('{{id}}', mark.id)
									.replace('{{top}}', mark.top*100)
									.replace('{{left}}', mark.left*100)
							$item.append(t);
						}
					})
				}

			}
		}

		return {
			init: init
		}
	}

	_.forEach($('.collection__grid-itm'), function(item) {
		var $item = $(item);
		if(!!$item.data('href')) {
			(new ItemMark()).init($item);
		}
	})

	var pg = new ProductGallery(),
		$marks = $('.collection__item-mark-a'),
		hrefs = _.uniq(_.map( $marks, function(mark) {
			return $(mark).attr('href');
		}));

	$marks.on('click', function(e) {
		e.preventDefault();
		var $mark = $(e.currentTarget);
		pg.init(hrefs, $mark.data('id'));
		return false;
	})
})