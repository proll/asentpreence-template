Y.use('node', 'squarespace-gallery-ng', function(Y) {
  Y.on('domready', function() {

    /*
      Ken Burns doesn't work in IE11, so
      this is a crappy browser specific fix.
    */
    var isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
    if (isIE11) {
      Y.one('body').addClass('ie11');
    }

    // center align dropdown menus
    Y.all('#topNav .subnav').each( function(n){
      n.setStyle('marginLeft', -(parseInt(n.getComputedStyle('width'),10)/2) + 'px' );
    });

    textShrink('h1.logo','#logo');

    // GALLERY PAGES ///////////////////////////////////////////////////

    var bodyWidth = function(){
      return parseInt(Y.one('body').getComputedStyle('width'),10);
    };

    if (Y.one('body').hasClass('collection-type-gallery')) {
      gallerySlideshow();
      if (Y.Squarespace.Management) {
        Y.Squarespace.Management.on('tweak', function(f){
          if (f.getName() == 'gallery-auto-play') {
            Y.Squarespace.GalleryManager._galleries[0].set('autoplay', Y.Squarespace.Template.getTweakValue('gallery-auto-play') + "" === "true");
          } else if (f.getName() == 'gallery-style') {
            Y.all('#slideshow .slide img').each(function(image) { 
              refreshImageStyle(image, f.getValue());
            });
          } else if (f.getName() == 'gallerySpeed') {
            Y.Squarespace.GalleryManager._galleries[0].set('designOptions.speed', f.getValue()); 
          } else if (f.getName() == 'autoplaySpeed') {
            Y.Squarespace.GalleryManager._galleries[0].set('autoplayOptions.timeout', f.getValue() * 1000);
          }
        });
      }
      Y.Global.on('tweak:reset', function(){
        slideshow.fire('refresh');
      });
      Y.Global.on('tweak:close', function(){
        setTimeout(function() {
          Y.all('.slide img[data-src]' ).each(function(img) {
            img.fire('refresh');
          });
        }, 2000);
      });

      Y.on('windowresize', function(){
          
          gallerySlideshow();

          Y.all('.slide img[data-src]' ).each(function(img) {
            img.fire('refresh');
          });
        
      });
    }

    // Mobile Nav ///////////////////////////////////

     Y.one('#mobileMenuLink a').on('click', function(e){
       var mobileMenuHeight = parseInt(Y.one('#mobileNav .wrapper').get('offsetHeight'),10);
       if (Y.one('#mobileNav').hasClass('menu-open')) {
         new Y.Anim({ node: Y.one('#mobileNav'), to: { height: 0 }, duration: 0.5, easing: 'easeBoth' }).run();
       } else {
         new Y.Anim({ node: Y.one('#mobileNav'), to: { height: mobileMenuHeight }, duration: 0.5, easing: 'easeBoth' }).run();
       }
       
       Y.one('#mobileNav').toggleClass('menu-open');
     });

    // BLOG PAGES ///////////////////////////////////////////////////

    if (Y.one('body').hasClass('collection-type-blog')) {
      var sidebarEl = Y.one('#sidebarWrapper');
      Y.one('#page').setStyle('minHeight', sidebarEl.get('offsetHeight'));
    }


    // FUNCTIONS

    var slideshow, galleryStyleFit, galleryStyleFill, galleryAutoPlay;

    function galleryStyleConverter(value){
      if (value == 'Fit') {
        galleryStyleFit = true;
        galleryStyleFill = false;
      } else if (value == 'Fill') {
        galleryStyleFit = false;
        galleryStyleFill = true;
      }
    }

    function gallerySlideshow() {
      if (bodyWidth() < 800 && Y.one('body.mobile-style-available')) {

        Y.all('.slide img[data-src]').each(function(img) {
          ImageLoader.load(img, { load: true });
        });

      } else if(!slideshow) {
          
        // get active tweak values
        galleryStyleConverter (Y.Squarespace.Template.getTweakValue('gallery-style'));
        galleryAutoPlay = Y.Squarespace.Template.getTweakValue('gallery-auto-play') + "" === "true";
        galleryTransition = Y.Squarespace.Template.getTweakValue('gallery-transition');
        gallerySpeed = Y.Squarespace.Template.getTweakValue('gallerySpeed');
        gallerySpeed = parseFloat(gallerySpeed) || 0.1;
        gallerySpeed = Math.max(gallerySpeed, 0.1);
        autoplaySpeed = Y.Squarespace.Template.getTweakValue('autoplaySpeed') * 1000;
        autoplaySpeed = parseFloat(autoplaySpeed) || 4000;
        autoplaySpeed = Math.max(autoplaySpeed, 100);

        if (typeof galleryTransition == 'string') {
          galleryTransition = galleryTransition.toLowerCase();
        } else {
          return false;
        }

        if (galleryTransition == 'ken burns') {
          galleryTransition = galleryTransition.replace(' b', 'B');
          galleryAutoPlay = true;
        }

        slideshow = new Y.Squarespace.Gallery2({
          container: Y.one('#slideshow'),
          elements: {
            next: '.next-slide, .gallery-next',
            previous: '.prev-slide, .gallery-prev',
            currentIndex: '.currentIndex',
            totalSlides: '.totalSlides'
          },
          loop: true,
          autoplay: galleryAutoPlay,
          autoplayOptions: {
            timeout: autoplaySpeed
          },
          design: 'stacked',
          designOptions: {
            autoHeight: false,
            speed: gallerySpeed,
            transition: galleryTransition
          },
          historyHash: true,
          loaderOptions: {
            fill: galleryStyleFill,
            fit: galleryStyleFit
          }
        });

      }

    }

    function refreshImageStyle(image, fitOrFill) {
      if (image && image.loader) {
        if (fitOrFill == 'Fit') {
          image.loader.set('mode', 'fit');
        } else if (fitOrFill == 'Fill') {
          image.loader.set('mode', 'fill');
        }
      }
    }

    /* Fix for split nav overlapping centered title.
    ================================================ */

    function detectNavOverlap() {
      if (Y.one('.header-alignment-center') && Y.one('.header-navigation-split')) {
        var navRight = Y.one('.secondary-nav.desktop-nav'),
          navLeft = Y.one('.main-nav.desktop-nav'),
          logo = Y.one('#logo .logo'),
          navRightCoords, navLeftCoords, logoCoords = [];

        if (navLeft && navRight && navLeft.getComputedStyle('display') != 'none') {
          navLeftCoords = navLeft.getX() + navLeft.get('clientWidth');
          navRightCoords = navRight.getX();
          logoCoords.push(logo.getX());
          logoCoords.push(logo.getX() + logo.get('clientWidth'));
            
          if (navRightCoords < logoCoords[1] || navLeftCoords > logoCoords[0]) {
            navLeft.setStyle('marginBottom', '-10px');
            navRight.setStyle('marginBottom', '-10px');
          } else {
            navLeft.setStyle('marginBottom', '');
            navRight.setStyle('marginBottom', '');
          }
        }
      }
    }

    function textShrink(element, ancestor) {
      if(Y.one(element) && Y.one(element).ancestor(ancestor)){
        Y.all(element).each(function(item){
          item.plug(Y.Squarespace.TextShrink, {
            parentEl: item.ancestor(ancestor)
          });
        });
      }
    }

    detectNavOverlap();
    Y.on('windowresize', function() {
      detectNavOverlap();
    });

  });

});