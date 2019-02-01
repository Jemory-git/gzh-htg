<template>
	<div class="container" id="container">
		<h3 class="feedback">回复</h3>
		<textarea class="textarea" placeholder="输入所需填写的文字..." v-model="text"></textarea>
		<ul class="upload">
			 <li class="upload-item" v-for="(item, index) in imgArr" :key="index" @click="remove(index)">
				<img :src="item" alt="" class="prev-img"/>
			</li>
			<li class="upload-item">
				<a href="javascript:;" class="upload-btn">
				<input type="file"
					:multiple="multiple"
					id="multiple"
					@change="upload"
				/>
				</a>
			</li>
		</ul>
		<div class="button" :class="{disabled: text.length == 0 || imgArr.length == 0}" @click="commit">发表</div>
	</div>
</template>

<script>
	import {mapGetters, mapMutations} from 'vuex';

	export default {
		data() {
			return {
				text: '',
				imgArr: [],
				multiple: true,
				files: [],
				returnImgUrl: [],
				images: '',
				preId: -1
			}
		},

		computed: {
			...mapGetters([
					'user'
				])
		},

		watch: {
			imgArr() {
				if(this.imgArr.length >= 9) {
					this.multiple = false;
				}else {
					this.multiple = true;
				}
			}
		},

		methods: {
			upload(e) {
				var that = this;
				that.files = e.target.files;
				if (!e || !window.FileReader) {			// 看支持不支持FileReader
					return;
				}

				for(let i = 0; i < that.files.length; i++) {
					if(i > 8) {
						return;
					}
					let reader = new FileReader();
					reader.readAsDataURL(that.files[i]) // 这里是最关键的一步，转换就在这里
					reader.onloadend = function () {
						that.imgArr.push(this.result);
					}
				}
			},

			remove(index) {
				this.imgArr.splice(index,1);
			},

			commit() {
				const uploadImgData = new FormData();
				uploadImgData.append('userId', this.user.parentId);
				uploadImgData.append('token', this.user.parent_token);

				for(let i = 0; i < this.files.length; i++) {
					uploadImgData.append('file', this.files[i]);
					this.$http.post(this.GLOBAL.URL + '/v1/Preschool/uploadPic', uploadImgData)
					.then((response) => {
						response = response.body;
						if(response.errcode === this.GLOBAL.ERR_CODE) {
							this.returnImgUrl.push(response.data.picUrl);
							if(this.returnImgUrl.length === this.files.length) {
								this.images = this.returnImgUrl.join(',');
								this.publish();
							}
						}else if(response.errcode === 400003) {
							this.setResultTip({show: true, text: '登录已过期', result: 1});
							setTimeout(() => {
								this.relogin();
							}, 2000);
						}
					})
				}
			},

			publish() {
				const uploadData = new FormData();
				uploadData.append('userId', this.user.parentId);
				uploadData.append('token', this.user.parent_token);
				uploadData.append('preId', this.preId);
				uploadData.append('content', this.text);
				uploadData.append('images', this.images);

				this.$http.post(this.GLOBAL.URL + '/v1/Preschool/commitFeedback', uploadData)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						this.text = '';
						this.imgArr = [];
					}else if(response.errcode === 400003) {
						this.setResultTip({show: true, text: '登录已过期', result: 1});
						setTimeout(() => {
							this.relogin();
							}, 2000);
					}
				})
			},

			...mapMutations({
				setResultTip: 'SET_RESULT_TIP'
			})
		},

		created() {
			this.preId = this.$route.query.preId;
		}
	}
</script>

<style scoped lang="less">
	.container {
		min-height: 100vh;
		padding: 0 0.65rem;
		background: #fff;
	}

	.feedback {
		height: 2rem;
		line-height: 2rem;
		font-size: 0.9rem;
		color: #333;
	}

	.textarea {
		width: 100%;
		height: 4.5rem;
		padding-top: 0.75rem;
		font-size: 0.75rem;
		overflow: hidden;
		resize: none;
		outline: none;
		border: none;

		&::placeholder {
			font-size: 0.75rem;
			color: #adadad;
		}
	}


	.upload {
		max-height: 18rem;
		overflow: hidden;

		.upload-item {
			float: left;
			width:32%;
			height: 5.75rem;
			margin: 0 0.25rem 0.25rem 0;

			&:nth-child(3n) {
				margin-right: 0;
			}
		}

		.prev-img {
			width: 100%;
			height: 100%;
			border: none;
		}
	}

	input[type="file"] {
		display: block;
		width: 100%;
		height: 100%;
		background-color: #fff;
		opacity: 0;
		filter: alpha(opacity=0);
	}

	.upload-btn {
		position: relative;
		display: block;
		height: 5.75rem;
		border: 1px solid #ccc;

		&::before {
			content:"";
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			width: 0;
			height: 60%;
			border-left: 0.1rem solid #ccc;
		}

		&::after {
			content:"";
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			width: 60%;
			height: 0;
			border-top: 0.1rem solid #ccc;
		}
	}

	.button {
		float: right;
		width: 3.75rem;
		height: 1.5rem;
		margin-top: 1.25rem;
		line-height: 1.5rem;
		text-align: center;
		font-size: 0.75rem;
		color: #333;
		background: #ffcc34;
	}

	.disabled {
		color: #fff;
		background: #adadad;
	}
</style>