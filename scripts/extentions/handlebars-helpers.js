/**
 * Helper for i10n support for Handlebars 
 */
Handlebars.smiles = [
	{s:':)',		c:'😊',		i:'00'},
	{s:':D',		c:'😃',		i:'01'},
	{s:';)',		c:'😉',		i:'02'},
	{s:';P',		c:'😜',		i:'03'},
	{s:':P',		c:'😛',		i:'04'},
	{s:'(love)',	c:'❤', 		i:'05'},
	{s:'o_o',		c:'😳',		i:'06'},
	{s:';(',		c:'😢',		i:'07'},
	{s:':(',		c:'😕',		i:'08'},
	{s:'>_<',		c:'😝',		i:'09'},
	{s:'(happy)',	c:'😀',		i:'10'},
	{s:'(angry)',	c:'😡',		i:'11'},
	{s:'(sleep)',	c:'😴',		i:'12'},
	{s:'(y)',		c:'👍',		i:'13'},
	{s:'(peace)',	c:'✌',		i:'14'},
	{s:'(ok)',		c:'👌',		i:'15'},
	{s:'(clap)',	c:'👏',		i:'16'},
	{s:'(strong)',	c:'💪',		i:'17'},
	{s:'(eyes)',	c:'👀',		i:'18'},
	{s:'(flower)',	c:'🌷',		i:'19'},
	{s:':*',		c:'💋',		i:'20'},
	{s:'(angel)',	c:'😇',		i:'21'},
	{s:'D:',		c:'😨',		i:'22'}
];

Handlebars.stickers = {
	'0': 'girl',
	'1': 'mouse',		
	'2': 'lemur',		
	'3': 'belka',		
	'4': 'abstract'
};

Handlebars.registerHelper('_empty_img', function(){
	return new Handlebars.SafeString('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGZJREFUeNrs0AEBAAAEAzD073w92CKsk9RnU88JECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgIALVgABBgBVtgN9LAL2xAAAAABJRU5ErkJggg==');
});

Handlebars.registerHelper('_ulink', function(user_obj){
	var lnk = ''
	if(!!user_obj) {
		if(!!user_obj.nick) {
			lnk = '/' + user_obj.nick;
		} else {
			lnk = '/user/' + user_obj.id;
		}
	}
	return new Handlebars.SafeString(lnk);
});

Handlebars.registerHelper('_uname', function(user_name){
	if(!user_name || !$.trim(user_name)) {
		user_name = 'Unnamed user'
	}
	return new Handlebars.SafeString(user_name);
});


// l10n
Handlebars.registerHelper('_', function(phrase, context){
	var phr = phrase;
	if(!!aspe.l10n[context] && !!aspe.l10n[context][phrase]) {
		phr = aspe.l10n[context][phrase][aspe.language]!='' ? aspe.l10n[context][phrase][aspe.language] || aspe.l10n[context][phrase]['en'] || '(;_;)' : '';
	}

	var l = arguments.length;
	if(l > 3) {
		phr = Handlebars.compile(phr);
		var context = {};
		for (var i = 2; i < l-1; i++) {
			context['s'+(i-1)] = arguments[i];
		};
		phr = phr(context);
	}
	return new Handlebars.SafeString(phr);

});

Handlebars.registerHelper('_plural', function(num, formsJSONStr) {
	var processor = aspe.l10n.plural.processors[aspe.language] || aspe.l10n.plural.processors['en'],
		phr = processor(num, Handlebars.helpers._(formsJSONStr, 'plural'))

	return new Handlebars.SafeString(phr);
});


// itunes link hack
Handlebars.registerHelper('_itunes_link', function() {
	var link = 'https://itunes.apple.com/us/app/we-heart-pics/id488515478';
	if(_.browser.ioschrome) {
		link = 'itms://itunes.apple.com/ru/app/we-heart-pics-quick-image/id488515478?l=en&mt=8'
	}
	return new Handlebars.SafeString(link);
});

/**
 * Helper timegap Handlebars 
 * sample {{_timegap 12312312}}
 */
Handlebars.registerHelper('_timegap', function(timestamp) {
	timestamp*=1000;
	var incomingDate = new Date(timestamp);
	today = new Date();
	
	var delta = today-incomingDate;
	
	var yD = parseInt(delta / 1000 / 60 / 60/ 24 / 365 );
	var dD = parseInt(delta / 1000 / 60 / 60/ 24 );
	var hD = parseInt(delta / 1000 / 60/ 60 );
	var mD = parseInt(delta / 1000 / 60 );
	var sD = parseInt(delta / 1000 );
	
	
	if (sD<60) {
		return "< 1"+Handlebars.helpers._("m", 'time').toString();
	} else if (mD<60) {
		return mD+Handlebars.helpers._("m", 'time').toString();
	} else if (hD<24) {
		return hD+Handlebars.helpers._("h", 'time').toString();
	} else if (dD<365) {
		return dD+Handlebars.helpers._("d", 'time').toString();;
	} else {
		return yD+Handlebars.helpers._("y", 'time').toString();;
	}
	
	return Handlebars.helpers._("long time", 'time').toString();;
});



/**
 * Helper iso8901 Handlebars 
 * sample {{_dateISO8901 12312312}}
 * 2010-12-29
 */
Handlebars.registerHelper('_dateISO8901', function(timestamp) {
	return JSON.parse(JSON.stringify(new Date(timestamp*1000))).split('T')[0];
});



// equal if
Handlebars.registerHelper('ifEq', function(v1, v2, options) {
  if(v1 == v2) {
	return options.fn(this);
  }
  return options.inverse(this);
});

// 3 or if
Handlebars.registerHelper('ifOR', function(v1, v2, v3, options) {
  if(v1 || v2 || v3) {
	return options.fn(this);
  }
  return options.inverse(this);
});



Handlebars.hasSmile = function(str) {
	var l = Handlebars.smiles.length;
	for (var i = 0; i < l; i++) {
		var smile = Handlebars.smiles[i];
		if(str.indexOf(smile.s) !== -1) {
			return true;
		}
	};
	return false
};


Handlebars.hasSticker = function(str) {
	var re = new RegExp("([0-4])\\.([0-9])+", "gi");
	if (str.search(re) !== -1){
		return true;
	};
	return false
};

/**
 * Helper for hash and mentions for Handlebars 
 */
Handlebars.registerHelper('_uinput', function(str) {
	str = str.toString();
	var re = false;

	// #hashes
	// var re = new RegExp("\\B#(\\S+)", "gi"),
	// str = str.replace(re, function(match, hash){
	// 		if(hash)
	// 			return '#' + hash;
	// 			// return "<a class=\"hsh\" href=\"/explore/hash/" + hash + "/\">#" + hash + "</a>";
	// 		return match;
	// 	});

	// urls
	re = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	str = str.replace(re, "<a target=\"_blank\" href=\"$1\">$1</a>"); 


	re = new RegExp("\\[id(\\S+)\\|([^\\]]+)\\]", "gi");
	str = str.replace(re, function(match, id, user_name){
			if(id && user_name)
				return "<a class=\"unm\" href=\"/user/" + id + "\">" + user_name + "</a>";
			return match;
		});

	return new Handlebars.SafeString(str);
});


Handlebars.registerHelper('_uinputsmile', function(str) {
	str = str.toString();
	var re = false;

	// urls
	re = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	str = str.replace(re, "<a target=\"_blank\" href=\"$1\">$1</a>"); 
	

	// #hashes
	// var re = new RegExp("\\B#(\\S+)", "gi"),
	// str = str.replace(re, function(match, hash){
	// 		if(hash)
	// 			return '#' + hash;
	// 			// return "<a class=\"hsh\" href=\"/explore/hash/" + hash + "/\">#" + hash + "</a>";
	// 		return match;
	// 	});

	// smiles
	var l = Handlebars.smiles.length;
	for (var i = 0; i < l; i++) {
		var smile = Handlebars.smiles[i],
			pattern = new RegExp(smile.s.replace(/([\(\)\[\]\{\}\.\?\^\$\|\-\*])/g, "\\$1"), "gi");
		str = str.replace(pattern, '<i class="emo emo-'+smile.i+'"></i>');
	};

	// stickers
	re = new RegExp("([0-4])\\.([0-9]+)", "gi");
	str = str.replace(re, function(match, pack_id, sticker_id){
		var pack = Handlebars.stickers[pack_id];
		if(!pack) {
			return match;
		} else {
			// console.log(sticker_id);
			sticker_id = parseInt(sticker_id) + 1;
			var sticker = (sticker_id < 10) ? ("0" + sticker_id) : ("" + sticker_id);
			return '<img class=\"stkr\" src=\"http:\/\/img.weheartpics.com\/stickers\/iosnoretina\/'+pack+'\/'+pack+'_'+sticker+'.png\"/>'
		}
	});




	re = new RegExp("\\[id(\\S+)\\|([^\\]]+)\\]", "gi");
	str = str.replace(re, function(match, id, user_name){
			if(id && user_name)
				return "<a class=\"unm\" href=\"/user/" + id + "\">" + user_name + "</a>";
			return match;
		});

	return new Handlebars.SafeString(str);
});



/**
 * Helper <tag> wrap Handlebars 
 */
Handlebars.registerHelper('_tagWrap', function(str, sub_string, tag) {
	if(!str) return '';
	if(!sub_string) return str;

	var re = new RegExp(sub_string, 'gi'),
		str = str.replace(re, function(match){
				return '<'+tag+'>'+match+'</'+tag+'>';
		});

	return new Handlebars.SafeString(str);
});

/**
 * Helper for clear mentions for Handlebars 
 */
Handlebars.registerHelper('_mention_clear', function(str) {
	if(!str) return '';
	var re = new RegExp("\\[id(\\S+)\\|([^\\]]+)\\]", "gi"),
	str = str.replace(re, function(match, id, user_name){
			if(id && user_name)
				return user_name;
			return match;
		});

	return new Handlebars.SafeString(str);
});

/**
 * Helper for clear mentions for Handlebars 
 */
Handlebars.registerHelper('_uncache', function(url) {
	return new Handlebars.SafeString(url + '?r=' + Math.round(Math.random()*900000000));
});



/**
 * Helper for form url of photo photo 
 */
Handlebars.registerHelper('_uphoto', function(url, size) {
	if(!url) {
		url = 'http://img.weheartpics.com/photo/SIZEX/764000.jpg';
	}
	return new Handlebars.SafeString(url.replace('SIZEX', size));
});

Handlebars.registerHelper('_prephoto', function(size, id) {
	return new Handlebars.SafeString('http://img.weheartpics.com/photo/'+size+'/'+id+'.jpg');
});

/**
 * Helper for form url of photo photo 
 */
Handlebars.registerHelper('_storyhref', function(story) {
	var href = ''
	if(story.type === 'DAILY') {
		href = '/explore/daily/'+story.id+'/date/all/';
	} else if(story.type === 'STORY') {
		href = '/explore/'+story.storycat.id+'/'+story.id+'/date/all/';
	}
	return new Handlebars.SafeString(href);
});