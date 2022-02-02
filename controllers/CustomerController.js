import { compare, genSaltSync, hash } from 'bcrypt'
import Customer from '../models/Customer';
import sendEmail from '../config/smtp';

export const signUp = async (fastify, req, res) => {
    try {
        let { name, email, password } = req.body;
        password = await hashPassword(password)

        const customer = new Customer({name, email, password});
        await customer.save();

        name = name || 'User';

        let token = await fastify.jwt.sign({email});

        return await sendEmail(email, name, token, 'customer', res)
    }
    catch (error) {
        return res.status(400).send({ error: `${error}` })
    }
}

export const login = async (fastify, req, res) => {
    try {
        let { email, password } = req.body;
    
        const customer = await Customer.findOne({ email });
    
        if (!customer) {
          return res.status(401).send({ error: 'Invalid email' })
        }

        if (!customer.verified) {
          return res.status(401).send({ error: 'Unverified Account, verify yourself' });
        }
    
        if (!(await comparePassword(password, customer.password))) {
          return res.status(401).send({ error: 'Invalid password' })
        }
    
        let { password: pass, ...data } = customer;

        return res.send({
            data: { user: data, accessToken: fastify.jwt.sign({data}) },
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
  const customer = await Customer.findOne({ email });
  if(!customer) {
    return res.status(401).send({ error: 'Invalid Token' })
  }
  
  let name = customer.name;

  let token = await fastify.jwt.sign({email});
  return await sendEmail(email, name, token, 'customer', res);
}

export const verifyCustomerEmail = async (fastify, req, res) => {
    const email = fastify.jwt.decode(req.query.verify, { complete: false }).email;
    if (!email) {
      return res.status(401).send({ error: 'Invalid Token' });
    }
    let customer = await Customer.findOne({ email });
    if(!customer) {
      return res.status(401).send({ error: 'Invalid Token' })
    }
    customer.verified = true;
    await customer.save();
    console.log(customer);
    return res.code(200).send({success : "Email Verified"});
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

