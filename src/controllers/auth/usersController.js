import { User,Users } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const usersController = {
    async me(req, res, next) {
        try {
            Users.getByEmail(req.con, req.user._id, function (err, results){
                if (!results) {
                    return next(CustomErrorHandler.notFound());
                }
                res.json(results);
            })
         
        } catch(err) {
           return next(err);
        }
    }
};

export default usersController;