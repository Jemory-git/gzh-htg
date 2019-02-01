import Vue from 'vue'
import Router from 'vue-router'
import vueResource from 'vue-resource';

import store from '@/store';

const index = (resolve) => {
	import('components/index/index').then((module) => {
		resolve(module);
	})
}

const growth = (resolve) => {
	import('components/growth/growth').then((module) => {
		resolve(module);
	})
}

const campus = (resolve) => {
	import('components/campus/campus').then((module) => {
		resolve(module);
	})
}

const mine = (resolve) => {
	import('components/mine/mine').then((module) => {
		resolve(module);
	})
}

const sign_in = (resolve) => {
	import('components/sign-in/sign-in').then((module) => {
		resolve(module);
	})
}

const leave = (resolve) => {
	import('components/leave/leave').then((module) => {
		resolve(module);
	})
}

const recipes = (resolve) => {
	import('components/recipes/recipes').then((module) => {
		resolve(module);
	})
}

const monitor = (resolve) => {
	import('components/monitor/monitor').then((module) => {
		resolve(module);
	})
}

const teacher_intro = (resolve) => {
	import('components/teacher-intro/teacher-intro').then((module) => {
		resolve(module);
	})
}

const personal = (resolve) => {
	import('components/personal/personal').then((module) => {
		resolve(module);
	})
}

const modify_pwd = (resolve) => {
	import('components/modify-pwd/modify-pwd').then((module) => {
		resolve(module);
	})
}

const change = (resolve) => {
	import('components/change/change').then((module) => {
		resolve(module);
	})
}

const licence = (resolve) => {
	import('components/licence/licence').then((module) => {
		resolve(module);
	})
}

const login = (resolve) => {
	import('components/login/login').then((module) => {
		resolve(module);
	})
}

const forget_pwd = (resolve) => {
	import('components/forget-pwd/forget-pwd').then((module) => {
		resolve(module);
	})
}

const env_pic = (resolve) => {
	import('components/org-env-pic/org-env-pic').then((module) => {
		resolve(module);
	})
}

const code_login = (resolve) => {
	import('components/code-login/code-login').then((module) => {
		resolve(module);
	})
}

const daily_review = (resolve) => {
	import('components/daily-review/daily-review').then((module) => {
		resolve(module);
	})
}

const integral = (resolve) => {
	import('components/integral/integral').then((module) => {
		resolve(module);
	})
}

const integral_history = (resolve) => {
	import('components/integral-history/integral-history').then((module) => {
		resolve(module);
	})
}

const integral_exchange = (resolve) => {
	import('components/integral-exchange/integral-exchange').then((module) => {
		resolve(module);
	})
}

const integral_detail = (resolve) => {
	import('components/integral-detail/integral-detail').then((module) => {
		resolve(module);
	})
}

const integral_rank = (resolve) => {
	import('components/integral-rank/integral-rank').then((module) => {
		resolve(module);
	})
}

const enter = (resolve) => {
	import('components/enter/enter').then((module) => {
		resolve(module);
	})
}

const video = (resolve) => {
	import('components/video-play/video-play').then((module) => {
		resolve(module);
	})
}

const course_review = (resolve) => {
	import('components/course-review/course-review').then((module) => {
		resolve(module);
	})
}

const feedback = (resolve) => {
	import('components/feedback/feedback').then((module) => {
		resolve(module);
	})
}

const recipesPush = (resolve) => {
	import('components/recipes-push/recipes-push').then((module) => {
		resolve(module);
	})
}

const dailyPush = (resolve) => {
	import('components/daily-push/daily-push').then((module) => {
		resolve(module);
	})
}

const coursePush = (resolve) => {
	import('components/course-push/course-push').then((module) => {
		resolve(module);
	})
}

const signPush = (resolve) => {
	import('components/sign-push/sign-push').then((module) => {
		resolve(module);
	})
}

const baoxiandan = (resolve) => {
	import('components/baoxiandan/baoxiandan.vue').then((module) => {
		resolve(module);
	})
}

const baoxianxiangqing = (resolve) => {
	import('components/baoxianxiangqing/baoxianxiangqing.vue').then((module) => {
		resolve(module);
	})
}

const jigouchaxun_minnan = (resolve) => {
	import('components/jigouchaxun-minnan/jigouchaxun-minnan.vue').then((module) => {
		resolve(module);
	})
}


Vue.use(Router)
Vue.use(vueResource)

let router = new Router({
	mode: 'history', //当你使用 history 模式时，URL 就像正常的 url  更好看
	routes: [
		{path: '/', redirect: '/login'},
		//首页
		{path: '/index', name: 'index', component: index, meta: { title: '首页', keepAlive: true}},
		//成长
		{path: '/growth', name: 'growth', component: growth, meta: {title: '动态', keepAlive: false}},
		//校区
		{path: '/campus', name: 'campus', component: campus, meta: {title: '校区', keepAlive: true}},
		//我的
		{path: '/mine', name: 'mine', component: mine, meta: {title: '我的', keepAlive: false}},
		//签到记录
		{path: '/sign_in', name: 'sign_in', component: sign_in, meta: {title: '签到记录', keepAlive: false}},
		//请假
		{path: '/leave', name: 'leave', component: leave, meta: {title: '请假', keepAlive: false}},
		//食谱
		{path: '/recipes', name: 'recipes', component: recipes,  meta: {title: '食谱', keepAlive: false}},
		//校园监控
		{path: '/monitor', name: 'monitor', component: monitor, meta: {title: '校园监控', keepAlive: false}},
		//教师介绍
		{path: '/teacher_intro', name: 'teacher_intro', component: teacher_intro, meta: {title: '教学师资', keepAlive: false}},
		//修改个人信息
		{path: '/personal', name: 'personal', component: personal, meta: {title: '设置个人信息', keepAlive: false}},
		//修改密码
		{path: '/modify_pwd', name: 'modify_pwd', component: modify_pwd, meta: {title: '修改密码', keepAlive: false}},
		//切换页面
		{path: '/change', name: "change", component: change, meta: {title: '切换机构/孩子', keepAlive: true}},
		// 机构环境
		{path: '/env_pic', name: 'env_pic', component: env_pic, meta: {title: '机构环境', keepAlive: false}},
		//机构许可证
		{path: '/licence', name: 'licence', component: licence, meta: {title: '机构许可证', keepAlive: true}},
		// 登录页面
		{path: '/login', name: 'login', component:login, meta: {title: '登录', keepAlive: false}},
		// 验证码登录
		{path: '/code_login', name: 'code_login', component: code_login, meta: {title: '验证码登录', keepAlive: false}},
		// 忘记密码
		{path:'/forget_pwd',name: 'forget_pwd', component: forget_pwd, meta: {title: '忘记密码', keepAlive: false}},
		// 每日点评
		{path: '/daily_review', name:'daily_review', component: daily_review, meta: {title: '每日点评', keepAlive: false}},
		// 积分首页
		{path: '/integral', name:'integral', component: integral, meta: {title: '积分', keepAlive: false}},
		// 积分历史
		{path: '/integral_history', name:'integral_history', component: integral_history, meta: {title: '积分历史', keepAlive: false}},
		// 积分兑换
		{path: '/integral_exchange', name:'integral_exchange', component: integral_exchange, meta: {title: '积分兑换', keepAlive: false}},
		// 积分详情
		{path: '/integral_detail', name:'integral_detail', component: integral_detail, meta: {title: '积分详情', keepAlive: false}},
		// 积分排名
		{path: '/integral_rank', name:'integral_rank', component: integral_rank, meta: {title: '积分排名', keepAlive: false}},
		// 进入页
		{path: '/enter', name:'enter', component: enter, meta: {title: '欢迎', keepAlive: true}},
		// 监控播放页
		{path: '/video', name:'video', component: video, meta: {title: '监控播放', keepAlive: false}},
		// 课程点评列表页
		{path: '/course_review', name:'course_review', component: course_review, meta: {title: '课程点评', keepAlive: false}},
		// 家长反馈页
		{path: '/feedback', name:'feedback', component: feedback, meta: {title: '家长反馈', keepAlive: false}},
		// 食谱推送页
		{path: '/recipes_push', name:'recipesPush', component: recipesPush, meta: {title: '好托管微官网--食谱详情', keepAlive: false}},
		// 每日点评推送页
		{path: '/daily_push', name:'dailyPush', component: dailyPush, meta: {title: '好托管微官网--点评详情', keepAlive: false}},
		// 课程推送页
		{path: '/course_push', name:'coursePush', component: coursePush, meta: {title: '好托管微官网--课程详情', keepAlive: false}},
		// 签到推送页
		{path: '/sign_push', name:'signPush', component: signPush, meta: {title: '好托管微官网--签到详情', keepAlive: false}},
		// // 保险单
		{
		  path: '/baoxiandan',
		  name: 'baoxiandan',
			component: baoxiandan,
		  meta: {
		    title: '保险单',
		    keepAlive: false
		  }
		},
		// // 保险单详情
		{
			path: '/baoxianxiangqing',
			name: 'baoxianxiangqing',
			component: baoxianxiangqing,
			meta: {
				title: '保险详情',
				keepAlive: false
			}
		},
		// // 机构查询
		{
			path: '/jigouchaxun_minnan',
			name: 'jigouchaxun_minnan',
			component: jigouchaxun_minnan,
			meta: {
				title: '机构查询',
				keepAlive: false
			}
		},
	]
})


	router.beforeEach((to, from, next) => {
		/* 路由发生变化修改页面title */
		store.dispatch('updateIsloading', true);
		if (to.meta.title) {
			document.title = to.meta.title;
		}

		next();
	})

	router.afterEach ((to, from) => {
		store.dispatch('updateIsloading', false);
	})

	export default router;