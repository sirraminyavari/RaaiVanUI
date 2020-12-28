import Home from 'views/Home/Home';
import Test from 'views/Test/Test';

const routes = [
    {
        path: '/',
        name: 'HomePage',
        exact: true,
        component: Home
    },
    {
        path: '/test',
        name: 'TestPage',
        exact: true,
        component: Test
    }
]

export default routes;