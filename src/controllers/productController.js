let mydocument = {};
import { Product, Products, Test } from '../models';
import multer from 'multer';
import path from 'path';
import CustomErrorHandler from '../services/CustomErrorHandler';
import fs from 'fs';
import Joi from 'joi';
import productSchema from '../validators/productValidator';
import Razorpay from 'razorpay';

const upload = multer({ dest: 'uploads/' }).single("demo_image");


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    },
});

const handleMultipartData = multer({
    storage,
    limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb

const productController = {
    store(req, res, next) {

        // Multipart form data
        handleMultipartData(req, res, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }

            if (!req.file) {
                return next(
                    CustomErrorHandler.notFound('image not available')
                );
            }

            // validation
            const { error } = productSchema.validate(req.body);

            if (error) {
                // Delete the uploaded file
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(
                            CustomErrorHandler.serverError(err.message)
                        );
                    }
                });

                return next(error);
                // rootfolder/uploads/filename.png
            }

            const { name, price, size } = req.body;
            const filePath = 'uploads/' + req.file.filename;
            let document;

            try {
                //If Everything is Validated, Store the product in Database
                Products.create_user(req.con, req.body, filePath, function (err, results) {
                    if (!err) {
                        return res.status(200).json({ Message: "Product Created successfully" })
                    }
                    else {
                        return next(CustomErrorHandler.serverError(err.message));
                    }
                });
            } catch (err) {
                return next(err);
            }

        });
    },
    update(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            let filePath;
            if (req.file) {
                filePath = req.file.path;
                filePath = 'uploads/' + req.file.filename;
            }

            // validation
            const { error } = productSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                if (req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                CustomErrorHandler.serverError(err.message)
                            );
                        }
                    });
                }

                return next(error);
                // rootfolder/uploads/filename.png
            }



            Products.getById(req.con, req.params.id, function (err, results) {

                if (Object.keys(results).length < 1) {

                    return next(CustomErrorHandler.notFound('Product Not Found'));
                }
                const imagePath = results[0].pimage;

                //Case 1; When update request is done with File
                if (req.file) {
                    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
                        if (err) {
                            return next(CustomErrorHandler.serverError());
                        }

                    });

                    //Update Product with File
                    Products.update(req.con, req.body, req.params.id, filePath, function (err, result) {
                        if (!err) {
                            return res.status(200).json({ Message: "Updated successfully!!!" });
                        }
                    });
                }

                else {
                    //Case 2: When UPDATE REQUEST IS Done wihtout file
                    Products.update(req.con, req.body, req.params.id, null, function (err, result) {
                        if (!err) {
                            return res.status(200).json({ Message: "Updated successfully!!!" });
                        }
                    });

                }

            });




            // const { name, price, size } = req.body;
            // let document;
            // try {

            //     // document = await Product.findOneAndUpdate(
            //     //     { _id: req.params.id },
            //     //     {
            //     //         name,
            //     //         price,
            //     //         size,
            //     //         ...(req.file && { image: filePath }),
            //     //     },
            //     //     { new: true }
            //     // );
            // } catch (err) {
            //     return next(err);
            // }
            // res.status(201).json(document);
        });
    },
    async destroy(req, res, next) {
        Products.getById(req.con, req.params.id, function (err, results) {

            if (Object.keys(results).length < 1) {

                return next(CustomErrorHandler.notFound('Product Not Found'));
            }
            const imagePath = results[0].pimage;

            fs.unlink(`${appRoot}/${imagePath}`, (err) => {
                if (err) {
                    return next(CustomErrorHandler.serverError());
                }
                Products.destroy(req.con, req.params.id, function (err, results) {
                    return res.status(200).json({ Message: 'Product Deleted Successfully!!' });
                });

            });

        });

        // const document = await Product.findOneAndRemove({ _id: req.params.id });
        // if (!document) {
        //     return next(new Error('Nothing to delete'));
        // }
        // image delete

        // http://localhost:5000/uploads/1616444052539-425006577.png
        // approot/http://localhost:5000/uploads/1616444052539-425006577.png

    },
    async index(req, res, next) {
        let documents;
        // pagination mongoose-pagination
        try {
            documents = await Product.find()
                .select('-updatedAt -__v')
                .sort({ _id: -1 });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },
    async show(req, res, next) {
        let document;
        try {

            // document = await Product.findOne({ _id: req.params.id }).select(
            //     '-updatedAt -__v'
            // );


            Products.getById(req.con, req.params.id, function (err, results) {
                if (Object.keys(results).length < 1) {

                    return next(CustomErrorHandler.notFound('Product Not Found'));
                }
                return res.status(200).json(results);
            });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        //return res.json(document);
    },

    async getAll(req, res, next) {
        
        try {

            Products.get(req.con, function (err, results) {
                if (Object.keys(results).length < 1) {

                    return next(CustomErrorHandler.notFound('Product Not Found'));
                }
                req.app.io.sockets.emit('update',results);
                return res.status(200).json(results);
            });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        //return res.json(document);
    },

    async getProducts(req, res, next) {

        try {
            console.log(req.body.ids);
            Products.getCart(req.con, req.body.ids, function (err, results) {
                if (!err) {
                    if (Object.keys(results).length < 1) {

                        return next(CustomErrorHandler.notFound('Product Not Found'));
                    }
                    return res.status(200).json(results);
                }
                else {
                    return next(CustomErrorHandler.serverError(err.message));
                }

            });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        // return res.json(documents);
    },

    async checkout(req, res, next) {

        try {
            console.log(req.body);
            var instance = new Razorpay({ key_id: 'rzp_test_YSQkUZ3Uwqglt8', key_secret: 'M0MRQDzBdrNww01ufwdtho2X' })

            var options = {
                amount: req.body.amount,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "order_rcptid_11"
            };
            instance.orders.create(options, function (err, order) {
                res.json(order);
            });

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        // return res.json(documents);
    },


    async verify(req, res, next) {

        try {
            console.log(req.body);
            let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

            var crypto = require("crypto");
            var expectedSignature = crypto.createHmac('sha256', 'M0MRQDzBdrNww01ufwdtho2X')
                .update(body.toString())
                .digest('hex');
            console.log("sig received ", req.body.response.razorpay_signature);
            console.log("sig generated ", expectedSignature);
            var response = { "signatureIsValid": "false" }
            if (expectedSignature === req.body.response.razorpay_signature)
            {
                response = { "signatureIsValid": "true" }
            }
            res.json(response);


        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        // return res.json(documents);
    },
};

export default productController;
