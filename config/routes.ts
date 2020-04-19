import RegisterAction from '../src/Action/User/RegisterAction'
import LoginAction from '../src/Action/User/LoginAction'
import UserGetAction from '../src/Action/User/UserGetAction'

const routes = {
    'ws.user.register': {
        path: '/user/register',
        action: RegisterAction,
        method: 'POST'
    },
    'ws.user.login': {
        path: '/user/login',
        action: LoginAction,
        method: 'POST'
    },
    'ws.user.get': {
        path: '/user/get',
        action: UserGetAction,
        method: 'GET'
    }
};

export { routes }
