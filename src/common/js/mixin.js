	// const clientWidth = document.documentElement.clientWidth;
	// const innerHeight = window.innerHeight;
	// const rem = 20 * (clientWidth / 375);
	// const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	// const wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
	// const wechatVersion = wechatInfo[1];

	export const screenHeightMixin = {
	  mounted() {
	    // if(isiOS && wechatVersion >= '6.6.7') {
	    // 	document.getElementById('screenHeight').style.height = innerHeight/rem -2.5 + 'rem';
	    // }
	    // this.$nextTick(() => {
	    //   document.getElementById('screenHeight').style.height = innerHeight / rem - 2.5 + 'rem';
	    // })
	  }
	};

	export const maxHeightMixin = {
	  mounted() {
	    // if(isiOS && wechatVersion >= '6.6.7') {
	    // 	document.getElementById('maxHeight').style.height = innerHeight/rem + 'rem';
	    // }
	    // this.$nextTick(() => {
	    //   document.getElementById('maxHeight').style.height = innerHeight / rem + 'rem';
	    // })
	  }
	};
