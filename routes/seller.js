const router = require('express').Router();
const Product = require('../models/product');
const faker = require('faker');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY
    },
    region: 'us-east-2'
})

const checkJWT = require('../middlewares/check-jwt');


const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'amazoncloneangular',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        },

    })
});

router.route('/products')
    .get(checkJWT, (req, res, next) => {
        Product.find({ owner: req.decoded.user._id })
            .populate('owner')
            .populate('category')
            .exec((err, products) => {
                if (products) {
                    res.json({
                        success: true,
                        message: 'Products',
                        products: products
                    });
                }
            });
    })

    .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.file.location;
        product.save();
        res.json({
            success: true,
            message: 'Successfully Added the product'
        });
    });

/*Fake data for testing porpouse */
router.get('/faker/test', (req, res, next) => {
    for (let i = 0; i < 20; i++) {
        let product = new Product();
        product.category = '5d64118c58fcab3710d430b6';
        product.owner = '5de1620b3634530bec276c5b';
        product.image = faker.image.fashion();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();
        product.save();
    }
    res.json({
        message: "Successfully added 20 products"
    })
})



module.exports = router