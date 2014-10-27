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
			num = 0,
			count = 0,
			description = '',
			items_arr = [],
			jqxhr,
			item_template = '<div class="galleryadmin-overlay__item"><div class="galleryadmin-overlay__item-inner"><i class="i i-plus"></i><div class="galleryadmin-overlay__item-thumb"></div></div></div>';

		function init(new_href, img_url, descr) {
			if(!$overlay) {
				$overlay = $('<div class="galleryadmin-overlay"/>')
				$overlay.append(
					'<div class="galleryadmin-overlay__cont"></div>'+
					'<a href="add" class="galleryadmin-overlay__add"><i class="i i-plus"></i></a>'+
					'<a href="close" class="galleryadmin-overlay__close"><i class="i i-closew"></i></a>');
				$overlay.find('.galleryadmin-overlay__add').on('.touchstart click', _.bind(addItem, this));
				$overlay.find('.galleryadmin-overlay__close').on('.touchstart click', _.bind(hidePopup, this));
				$cont = $overlay.find('.galleryadmin-overlay__cont');
				$body.append($overlay);
			}

			items_arr = [];
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
						items_arr = result.items;

						num = 0;
						count = items_arr.length;
					})
					.fail(function() {
					})
					.always(function() {
						$cont.toggleClass('loading', false);
					});
		}

		function addItem() {
			if(num+1 < count) {
				var $item = $(item_template).appendTo($cont);
				$item.data('id', items_arr[num].id);
				$item.find('.galleryadmin-overlay__item-thumb').css({
					'background-image': 'url(' + items_arr[num].assetUrl + '?format=100w)'
				});
				$item.draggable();
				num++;
			}
			return false;
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