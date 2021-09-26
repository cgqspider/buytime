import Joi from 'joi';
import { Users, RefreshToken } from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService';
import { REFRESH_SECRET } from '../../config';

const loginController = {
    async login(req, res, next) {
        // Validation
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });
        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            //If user is not available 
            Users.getByEmail(req.con, req.body.email, async function (err, rows) {
                if (Object.keys(rows).length < 1) {

                    return next(CustomErrorHandler.wrongCredentials());
                }

                // compare the password
                const match = await bcrypt.compare(req.body.password, JSON.parse(JSON.stringify(rows))[0].userpass);
                if (!match) {
                    return next(CustomErrorHandler.wrongCredentials());
                }

                // Token
                const access_token = JwtService.sign({ _id: JSON.parse(JSON.stringify(rows))[0].useremail, role: JSON.parse(JSON.stringify(rows))[0].userrole });
                // const refresh_token = JwtService.sign({ _id: JSON.parse(JSON.stringify(rows))[0].useremail, role: JSON.parse(JSON.stringify(rows))[0].userrole }, '1y', REFRESH_SECRET);
                
                 // database whitelist
                // await RefreshToken.create({ token: refresh_token });
                res.json({ access_token });
               
            })
           
            

        } catch (err) {
            return next(err);
        }

    },
    async logout(req, res, next) {
        // validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });
        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            await RefreshToken.deleteOne({ token: req.body.refresh_token });
        } catch (err) {
            return next(new Error('Something went wrong in the database'));
        }
        res.json({ status: 1 });
    }
};


export default loginController;