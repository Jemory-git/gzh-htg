import { Radar, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
	extends: Radar,
	mixins: [reactiveProp],
	props: ['options'],
	mounted () {
		// this.chartData is created in the mixin
		this.renderChart(this.chartData, this.options)
	}
}