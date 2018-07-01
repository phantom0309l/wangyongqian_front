const BaseTemplate = {
    template: '<router-view></router-view>',
};

export default [
    {
        path: '/login',
        name: 'login',
        component: resolve => require(['../pages/Login.vue'], resolve),
        meta: {
            requireBind: false
        }
    },
    {
        path: '/my/',
        name: 'my',
        component: BaseTemplate,
        children: [
            {
                path: 'info',
                name: 'my-info',
                component: resolve => require(['../pages/my/Info.vue'], resolve)
            },
        ]
    },
    {
        path: '/rpt_market/',
        name: 'rpt_market',
        component: BaseTemplate,
        children: [
            {
                path: 'newpatient',
                name: 'rpt_market-newpatient',
                component: resolve => require(['../pages/rpt/market/CancerNewPatient.vue'], resolve)
            },
            {
                path: 'order',
                name: 'rpt_market-order',
                component: resolve => require(['../pages/rpt/market/CancerOrder.vue'], resolve)
            }
        ]
    },
    {
        path: '/performance_market/',
        name: 'performance_market',
        component: BaseTemplate,
        children: [
            {
                path: 'cancerrank',
                name: 'performance_market-cancerrank',
                component: resolve => require(['../pages/performance/market/CancerRank.vue'], resolve)
            },
        ]
    },
    {
        path: '/error',
        name: 'error',
        component: resolve => require(['../pages/basic/Error.vue'], resolve),
        meta: {
            requireBind: false
        }
    },
    {
        path: '/',
        name: 'empty',
        // redirect: '/error',
        component: resolve => require(['../pages/basic/Empty.vue'], resolve),
        meta: {
            requireBind: false
        }
    },
    {
        path: '*',
        // redirect: '/error',
        redirect: to => {
            sessionStorage.setItem('_errorurl_', to.path);
            localStorage.setItem('_errorwxuErl_', to.path);
            localStorage.setItem('_errorhref_', window.location.href);
            return '/error';
        }
    }
]
