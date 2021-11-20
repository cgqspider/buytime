import { Users } from '../models';
import CustomErrorHandler from '../services/CustomErrorHandler';

const admin = async (req, res, next) => {
    try {

        Users.getByEmail(req.con, req.user._id, async function (err, rows) {

            if (rows[0].userrole === 'admin') {
                next();
            } else {
                return next(CustomErrorHandler.unAuthorized());
            }


        });
       
    } catch (err) {
        return next(CustomErrorHandler.serverError(err.message));
    }
};

export default admin;
