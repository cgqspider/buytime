import Joi from 'joi';
import { User, Users, RefreshToken } from '../../models';
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import { REFRESH_SECRET, APP_URL } from '../../config';
import registerSchema from '../../validators/userValidator'

import sendMail from '../../services/EmailService';

const registerController = {
    async register(req, res, next) {
        // CHECKLIST
        // [ ] validate the request
        // [ ] authorise the request
        // [ ] check if user is in the database already
        // [ ] prepare model
        // [ ] store in database
        // [ ] generate jwt token
        // [ ] send response

        // Validation
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        try {
            // check if user is in the database already
            Users.getByEmail(req.con, req.body.email, async function (err, rows) {

                if (Object.keys(rows).length > 0) {

                    return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
                }

                // if user is not available in the database, then proceed for registeration
                else {
                    const { name, email, password } = req.body;

                    // Hash password
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);

                    // prepare the model
                    const user = {
                        name,
                        email,
                        password: hashedPassword
                    };

                    //Creating a new user
                    sendMail({
                        from: 'cgqspider@gmail.com',
                        to: email,
                        subject: 'Please Confirm Your Account',
                        text: `Account Confirmation`,
                        html: require('../../Templates/EmailTemplate')({
                            emailFrom: email,
                            name,
                            confirmLink: `${APP_URL}/api/register/activate/` + JwtService.sign(user),
                            // size: ' KB',
                            expires: '5 Minutes'
                        })
                    }).then(() => {
                        return res.json({ message: "Verification Email Sent!!" });
                        //return res.json({success: true});
                    }).catch(err => {
                        console.log(err);
                        return res.status(500).json({ error: err });
                    });


                }
            });

        } catch (err) {
            return next(err);
        }


        // let access_token;
        // let refresh_token;
        // try {
        //     //    Users.create_user(req.con,req.body, function(err, rows){
        //     //         res.json("User Created Successfully");
        //     //     });
        //     //res.json("User Created Successfully");
        //     //     });

        //     // Token
        //     // access_token = JwtService.sign({ _id: result._id, role: result.role });
        //     // refresh_token = JwtService.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET);
        //     // // database whitelist
        //     // await RefreshToken.create({ token: refresh_token });
        // } catch (err) {
        //     //return next(err);
        // }

        // res.json({ access_token, refresh_token });
    },

    async activate(req, res, next) {



        try {
            const user= await JwtService.verify(req.params.token)
            console.log(user);
            
            Users.getByEmail(req.con, user.email, async function (err, rows) {
                if (Object.keys(rows).length > 0) {

                    return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
                }

                // if user is not available in the database, then proceed for registeration
                else {
                   
                    Users.create_user(req.con, user, function (err, rows) {
                        if (err) {
                            next(err);
                        }
                        else {

                            return res.json({ message: "User Created Successfully" });
                        }
                    });

                }

            });
        


        } catch (err) {
            return next(CustomErrorHandler.unAuthorized("Confirmation link is Expired, Please register again."));
        }



    }


}


export default registerController;