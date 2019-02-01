<template>
	<div class='tab'>
		<router-link class='tab-item' to='/index'>
			<div class="tab_icon icon_index"></div>
			首页
		</router-link>
<!-- 		<router-link class='tab-item' to='/growth'>
			<div class="tab_icon icon_dynamic"></div>
			动态
		</router-link> -->
		<router-link class='tab-item' to='/campus'>
			<div class="tab_icon icon_campus"></div>
			校区
		</router-link>
		<router-link class='tab-item' to='/mine'>
			<div class="tab_icon icon_mine"></div>
			我的
		</router-link>
	</div>
</template>
<script type="text/javascript">
export default {

}

</script>
<style scoped lang="less">
	.tab {
		z-index: 9;
		position: absolute;
		display: flex;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2.5rem;
		background: #fff;
		border-top: 1px solid #eee;

		.tab-item {
			flex: 1;
			text-align: center;
			font-size: .5rem;
			color: rgb(77, 85, 93);
		}

		.tab_icon {
			width: 1.25rem;
			height: 1.25rem;
			margin: .3rem auto .2rem;
			background-size: 1.25rem 1.25rem;
		}

		.icon_index {
			background-image: url('./home.png');
		}

		.icon_dynamic {
			background-image: url('./dynamic.png');
		}

		.icon_campus {
			background-image: url('./school.png');
		}

		.icon_mine {
			background-image: url('./mine.png');
		}

		.router-link-active {
			color: #ffc54a;

			.icon_index {
				background-image: url('./home_active.png');
			}

			.icon_dynamic {
				background-image: url('./dynamic_active.png');
			}

			.icon_campus {
				background-image: url('./school_active.png');
			}

			.icon_mine {
				background-image: url('./mine_active.png');
			}
		}
	}

</style>
