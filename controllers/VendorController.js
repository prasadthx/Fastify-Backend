import { compare, genSaltSync, hash } from 'bcrypt';
import Vendor from '../models/Vendor';
import Image from '../models/Image';
import sendEmail from '../config/smtp';
import RazorpayInstance from '../utils/payment';
import * as crypto from 'crypto';

export const signUp = async (fastify, req, res) => {
    try {
        let { name, email, password } = req.body;
        password = await hashPassword(password)

        const vendor = new Vendor({name, email, password});
        await vendor.save();

        name = name || 'User';

        let token = await fastify.jwt.sign({email});

        return await sendEmail(email, name, token, 'vendor', res);
    }
    catch (error) {
        return res.status(400).send({ error: `${error}` })
    }
}

export const login = async (fastify, req, res) => {
    try {
        let { email, password } = req.body;
    
        const vendor = await Vendor.findOne({ email });
    
        if (!vendor) {
          return res.status(401).send({ error: 'Invalid email' });
        }

        if (!vendor.verified) {
            return res.status(401).send({ error: 'Unverified Account, verify yourself' });
        }
    
        if (!(await comparePassword(password, vendor.password))) {
          return res.status(401).send({ error: 'Invalid password' })
        }
    
        let { password: pass1, _id: pass2, __v: pass3, ...user } = {id:vendor._doc._id, ...vendor._doc};

        return res.send({
            data: { vendor: user , accessToken: fastify.jwt.sign({user}) },
        })
      } catch (error) {
        return res.status(500).send({ error: `${error}` })
      }
}

export const sendVerificationToken = async (fastify, req, res) => {
    const email = req.body.email;
    if (!email) {
      return res.status(401).send({ error: 'Provide Email' });
    }
    const vendor = await Vendor.findOne({ email });
    if(!vendor) {
      return res.status(401).send({ error: 'Invalid Token' })
    }

    let name = vendor.name;

    let token = await fastify.jwt.sign({email});
    return await sendEmail(email, name, token, 'vendor', res);
}

export const verifyVendorEmail = async (fastify, req, res) => {
    const email = fastify.jwt.decode(req.query.verify, { complete: false }).email;
    if (!email) {
      return res.status(401).send({ error: 'Invalid Token' });
    }
    const vendor = await Vendor.findOne({ email });
    if(!vendor) {
      return res.status(401).send({ error: 'Invalid Token' })
    }
    vendor.verified = true;
    await vendor.save();
    return res.code(200).send({success : "Email Verified"});
}

export const uploadProfilePhoto = async (req, res) => {
  const vendor = await Vendor.findOne({ email: req.user.user.email });
  if(!vendor) {
    return res.status(401).send({ error: 'Invalid Token' })
  }
  const image = new Image({
    filename: req.file.filename,
    originalname: req.file.originalname,
    url: req.file.path
  });
  const data = await image.save();
  vendor.photo = data;
  await vendor.save();
  return res.code(200).send({success : "Photo uploaded"});
}

export const createSubsciption = async (req, res) => {
  const vendor = await Vendor.findOne({ email: req.user.user.email });
  
  if(!vendor) {
    return res.status(401).send({ error: 'Invalid Token' })
  }
  
  let {amount, currency} = req.body;

  if (!amount || !currency) {
    return res.status(400).send({ error: 'Amount and currency must be provided' });
  }

  if(amount !== 699 && amount !== 999){
    amount = 999;
  }

  let options = {
    amount: amount * 100,  
    currency: currency,
    receipt: `receipt_id_${vendor._id}`
  };

  try{
    const response = await RazorpayInstance.orders.create(options);

    vendor.subscription.order_id = response.id;

    await transaction.save();
    
    return res.status(200).send({
        order_id : response.id,
        currency : response.currency,
        amount : response.amount
    });
  }
  catch(err){
      return res.status(400).send({error: err});
  }
}

export const verifyPayment = async (req, res) => {
  const vendor = await Vendor.findOne({ email: req.user.user.email });
  
  if(!vendor) {
    return res.status(401).send({ error: 'Invalid Token' })
  }

  const order_id = vendor.subscription.order_id;

  const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

  const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
  let body = order_id + "|" + razorpay_payment_id;

  if(!razorpay_order_id && !razorpay_payment_id && !razorpay_signature) {
    return res.status(401).send({ error: 'Insufficient Data' });
  }
  
  let expectedSignature = crypto.createHmac('sha256', RAZORPAY_SECRET)
                                .update(body.toString())
                                .digest('hex');

  if(expectedSignature === req.body.response.razorpay_signature){
      const payment = await instance.payments.fetch(razorpay_payment_id);
      if(payment.status === 'captured'){
        vendor.isSubscribed = true;
        vendor.subscription.time = Date.now();
        vendor.subscription.payment_id = razorpay_payment_id;
        res.code(200).send({Success: 'Vendor subscribed successfully'});
      }
  }
  else{
    res.code(400).send({Error: 'Invalid Signature'});
  }                                
}

const hashPassword = async (password) => {
  let salt = genSaltSync(10)
  return new Promise(res => {
          hash(password, salt, (err, saltedPassword) => {
          res(saltedPassword)
      })
  })
}

const comparePassword = (password, hashedPassword) => {
    return new Promise(res => {
      compare(password, hashedPassword, (err, same) => {
        if (err) res(false)
        else res(same)
      })
    })
}

