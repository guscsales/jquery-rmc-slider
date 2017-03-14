# jQuery RMC Slider (Beta Version)
Simple slider builded on jQuery for your website :)

## Download

```bash
git clone https://github.com/hebsix/jquery-rmc-slider.git
```

## Demo
[http://www.cots.adv.br/](http://www.cots.adv.br/)

[http://www.bhhscalifornia.com/](http://www.bhhscalifornia.com/)


## Usage

```html
<div class="rmc-slider">
	
	<div class="rmc-slide">
		<img class="rmc-bg" data-src="/lib/media/Banner/image.png" />
		<div class="rmc-container">
			<div class="rmc-layer rmc-valign-center" 
			data-delay="1300" 
			data-effect="bottom(40)"  
			data-valign-center="true">
				<h2>Title</h2>
				<p>Some Content</p>
				<a class="btn btn-transparent" href="#">Link</a>
			</div>
		</div>
	</div>
	
	<div class="rmc-slide">
		<img class="rmc-bg" data-src="/lib/media/Banner/image.png" />
		<div class="rmc-container">
			<div class="rmc-layer rmc-valign-center" 
			data-delay="1300" 
			data-effect="bottom(40)"  
			data-valign-center="true">
				<h2>Title</h2>
				<p>Some Content</p>
				<a class="btn btn-transparent" href="#">Link</a>
			</div>
		</div>
	</div>
	
</div>
```

```javascript
$('.rmc-slider').rmcSlider({
    fullwidth: true,
    dots: {},
    autoplay:5000
});
```

### Default values
```javascript
{
    width: 1132,
    height: 558,
    fullwidth: false,
    prefix: 'rmc',
    speed: 500,
    dots: null,
    startIndex: 0,
    autoplay: 7000,
    easing: 'easeInCubic',
    cssTransitions: true
}
```


##  Attributes

### data-delay

- Time to execute

```html
data-delay="1300"
```

### data-effect
- Type of effect

```html
data-effect="bottom(40)"
```

### data-valign-center

- Vertical align

```html
data-valign-center="true"
```


### data-src
```html
data-src="/lib/media/Banner/2560576a.png"
```

### data-{size}-src
```html
data-1366-src="/lib/media/Banner/1366768a.png" 
data-1600-src="/lib/media/Banner/19001600a.png" 
data-320-src="/lib/media/Banner/320433a.png" 
data-375-src="/lib/media/Banner/375667a.png" 
data-414-src="/lib/media/Banner/414736aa.png" 
data-480-src="/lib/media/Banner/480390a.png" 
data-568-src="/lib/media/Banner/320568a.png" 
data-667-src="/lib/media/Banner/375667a.png" 
data-736-src="/lib/media/Banner/414736a.png" 
data-768-src="/lib/media/Banner/768567a.png" 
```


### data-position
- For adjust according each size of device
```json
"{'320': ['40%', 0], '375': ['40%', 0], '414': ['40%', 0], '480': ['50%', 0], '568': ['50%', 0], '667': ['50%', 0], '736': ['50%', 0], '768': ['50%', 0], '1024': ['50%', 0], '1200': ['50%', 0], '1366': ['50%', 0], '1600': ['50%', 0]}"
```
 
## Notes
    1. "data-jss-effect" is required.
    2. in example "usage" the values are defaults (Except "data-jss-effect").
    3. spaceBetween is defined in plugin options, but can be defined in element.

## Aditional Plugins:

Required if using jQuery Animation: jQuery Easing (By gdsmith, https://github.com/gdsmith/jquery.easing, thanks :D)

## About
- Author: Gustavo Sales (http://github.com/hebsix)


## Contact
- Skype: guustavosales

## Changelog

### 0.5
- Fixed mobile settings 

### 0.4
- Fixed jQuery Animations

### 0.3
- Fixed layers' bugs on change slide

### 0.2
- Fixed the transitions performance

### 0.1
- The build with basic resources


