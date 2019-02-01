<template>
	<div class="small">
		<radar-chart :chart-data="datacollection" :options="options"></radar-chart>
	</div>
</template>

<script>
	import RadarChart from 'common/js/echart';

	export default {
		props: {
			data: {
				type: Array,
				default: []
			}
		},

		components: {
			RadarChart
		},

		data () {
			return {
				datacollection: null,
				options: null,
				max: 0,
				text: [],
				scroce: []
			}
		},

		watch: {
			data(newVal) {
				this.getScore(newVal);
				this.fillData();
			}
		},

		methods: {
			fillData () {
				this.datacollection = {
					labels: this.text,
					datasets: [
						{
							"label": "",
							"data": this.scroce,
							"fill": true,
							"backgroundColor": "rgba(167,207,254,0.8)",
							"pointRadius": 0,
						}
					]
				};
				this.options = {
					scale: {
						ticks: {
							//最小刻度 最大刻度 刻度的步长(长度)
							suggestedMin: 0,
							suggestedMax: this.max || 100
						}
					}
				};
			},

			getText(type) {
				type = parseInt(type);
				if(type === 1) {
					return '生活习惯';
				}
				if(type === 2) {
					return '行为习惯';
				}
				if(type === 3) {
					return '作业质量';
				}
				if(type === 4) {
					return '学习习惯';
				}
				if(type === 5) {
					return '文明礼仪';
				}
			},

			getMax() {
				this.data.forEach((item, index) => {
					this.max = Math.max(this.max, item.integral);
				})
			},

			getScore(data) {
				data.forEach((item, index) => {
					this.text.push(this.getText(item.type));
					this.scroce.push(item.integral);
				})
			}
		},

		created() {
			this.getMax();
		},

		mounted () {
			this.fillData();
		}
	}
</script>

<style>
	.small {
		height: 18.75rem;
		margin: 0 auto;
	}
</style>