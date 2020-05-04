import * as Joi from '@hapi/joi'
import Action from '../../Core/Route/Action'
import UserService from '../../Service/User/UserService'
import Web3jService from "../../Service/Blockchain/Web3jService";

export default new class LoginAction extends Action {
    async execute(req, res) {
        // const userService = new UserService();
        //
        // const user = await userService.login(req.payload);
        // req.cookieAuth.set(user);
        const walletConnection = new Web3jService();
        //const contractShit = await walletConnection.deploy('UserInteraction', []); TODO: on command
        const contractDeploy = await walletConnection.callContract('UserInteraction', []);


        return {
            err: false,
            res: contractDeploy
        }
    }

    options(): object {
        return {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().min(3),
                    password: Joi.string().min(4).max(4096)
                }).options({ stripUnknown: true })
            }
        };
    }

}
