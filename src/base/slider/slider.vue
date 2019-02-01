<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<slot></slot>
		</div>
		<div class="dots">
			<span class="dot" :class="{'active':currentPageIndex === index}" v-for="(item,index) in dots" :key="item" @click="_navToPage(navable,index)"></span>
		</div>
	</div>
</template>

<script type="tect/javascript">
	import BScroll from 'better-scroll';
	import {addClass} from 'common/js/dom.js';

	export default {
		props: {
			loop: {
				type: Boolean,
				default: true
			},
			autoPlay: {
				type: Boolean,
				default: true
			},
			interval: {
				type: Number,
				default: 4000
			},
			navable: {
				type:Boolean,
				default: true
			}
		},

		data() {
			return {
				dots:[],
				currentPageIndex: 0,
				wid: 0,
				widtot: 0
			}
		},

		methods: {
			// 设置轮播图的总宽度
			_setSliderWidth(isActive) {
				this.children = this.$refs.sliderGroup.children;
				let sliderWidth = window.innerWidth;
				let width = sliderWidth * this.children.length;
				for(let i = 0; i < this.children.length; i++) {
					let child = this.children[i];
					addClass(child, 'slider-item');
					child.style.width = sliderWidth + 'px';
				}

				if( this.loop && !isActive && this.children.length > 1) {
					width += 2 * sliderWidth;
				}
				this.$refs.sliderGroup.style.width = width + 'px';
			},
			//初始化dots
			_initDots(){
				this.dots = new Array(this.children.length);
			},
			// 初始化BScroll
			_initBScroll(){
				this.slider = new BScroll(this.$refs.slider, {
					scrollX: true,
					scrollY: false,
					momentum: false,
					snap: {
						loop: this.loop,
						threshold: 0.3,
						speed: 400
					},
					click: false
				})

				this.slider.on('beforeScrollStart', () => {
					if (this.autoPlay) {
						clearTimeout(this.timer);
					}
				})

				this.slider.on('scrollEnd', () => {
					let pageIndex = this.slider.getCurrentPage().pageX;
					this.currentPageIndex = pageIndex;
					if(this.autoPlay) {
						this._play();
					}
				})
			},

			continue() {
				this.slider && this.slider.next(400);
				this._play();
			},

			//自动轮播
			_play() {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.slider.next(400);
				},this.interval);
			},

			//点击导航点跳到对应的图片
			_navToPage(navable,index) {
				if(navable) {
					this.slider.goToPage(index,0,400);
					this.currentPageIndex = index;
					if(this.autoPlay) {
						this._play();
					}
				}
			}
		},

		mounted() {
			setTimeout(() => {
				this._setSliderWidth();
				this._initDots();
				this._initBScroll();

				if(this.autoPlay) {
					this._play();
				}
			},0);

			// 监听页面窗口改变 重新设置宽度和刷新BScroll
			window.addEventListener('resize', () => {
				if(!this.slider) {
					return;
				}
				this._setSliderWidth(true);
				this.slider.refresh();
			});
		},

		activated() {
			if(this.autoPlay) {
				this.slider.refresh();
			}
		},

		destoryed() {
			clearTimeout(this.timer);
		}
	}
</script>

<style scoped lang="less">

	.slider {
		position: relative;
		min-height: 0.05rem;

		.slider-group {
			position: relative;
			overflow: hidden;
			white-space: nowrap;
		}
	}

	.slider-item {
		float: left;
		box-sizing: border-box;
		overflow: hidden;
		text-align: center;

		a {
			display: block;
			width: 100%;
			overflow: hidden;
			text-decoration: none;
		}

		img {
			display: block;
			width: 100%;
		}
	}

	.dots {
		position: absolute;
		right: 0;
		left: 0;
		bottom: 0.6rem;
		text-align: center;
		font-size: 0;

		.dot {
			display: inline-block;
			margin: 0 0.2rem;
			width: 0.4rem;
			height: 0.4rem;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.5);
		}

		.active {
			width: 1.0rem;
			border-radius: 0.25rem;
			background: rgba(255, 255, 255, 0.8);
		}
	}
</style>