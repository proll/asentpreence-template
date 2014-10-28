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
					'<a href="code" class="galleryadmin-overlay__code"><i class="i i-code"></i></a>'+
					'<div class="galleryadmin-overlay__code-cont"><textarea></textarea></div>'+
					'<a href="close" class="galleryadmin-overlay__close"><i class="i i-closew"></i></a>');
				$overlay.find('.galleryadmin-overlay__add').on('.touchstart click', _.bind(addItem, this));
				$overlay.find('.galleryadmin-overlay__code').on('.touchstart click', _.bind(toggleCode, this));
				$overlay.find('.galleryadmin-overlay__close').on('.touchstart click', _.bind(hidePopup, this));
				$overlay.find('textarea').on('.touchstart click', _.bind(selectTextarea, this));
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


						if(!!description) {
							addOldItems();
						}
					})
					.fail(function() {
					})
					.always(function() {
						$cont.toggleClass('loading', false);
					});
		}

		function addItem(e) {
			if(e && e.preventDefault) {
				e.preventDefault()
			}
			if(num < count) {
				renderItem(items_arr[num], .5, .5);
				num++;
			}
			return false;
		}

		function addOldItems() {
			var old_items_arr = JSON.parse(description),
				new_items_arr = [],
				item;
			if(!!old_items_arr && old_items_arr.length) {
				for (var i = 0; i < items_arr.length; i++) {
					item = _.find(old_items_arr, {id: items_arr[i].id})
					if(!!item && !_.isEmpty(item.top) && !_.isEmpty(item.left)) {
						renderItem(items_arr[i], item.top, item.left)
					} else {
						new_items_arr.push(items_arr[i]);
					}
				}
				items_arr = new_items_arr;
			}
		}

		function renderItem(item_obj, left, top) {
			var $item = $(item_template).appendTo($cont);
			$item.data('id', item_obj.id);
			$item.find('.galleryadmin-overlay__item-thumb').css({
				'background-image': 'url(' + item_obj.assetUrl + '?format=100w)',
				left: left*100 + '%',
				top: top*100 + '%'
			});
			$item.draggable();
		}

		function generateCode() {
			var iw = $cont.find('img').width(),
				ih = $cont.find('img').height(),
				$items = $cont.find('.galleryadmin-overlay__item'),
				result_arr = [],
				$item;

			_.forEach($items, function(item) {
				$item = $(item);
				result_arr.push({
					id: $item.data('id'),
					left: 	($item.position().left/iw).toPrecision(3),
					top: 	($item.position().top/ih).toPrecision(3)
				});
			})

			return result_arr;
		}

		function toggleCode(e) {
			if(e && e.preventDefault) {
				e.preventDefault()
			}
			var $this = $(e.currentTarget);
			$overlay.toggleClass('code');
			$this.find('textarea')
				.val(generateCode())
				.click();
			return false;
		}

		function selectTextarea(e) {
			$(e.currentTarget).select();
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