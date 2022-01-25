import { compare, genSaltSync, hash } from 'bcrypt'
import Vendor from '../models/Vendor';

export const signUp = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        password = await hashPassword(password)

        const vendor = new Vendor({name, email, password});
        await vendor.save();

        let { password: pass, ...data } = vendor;

        res.send({ data: { data } })
    }
    catch (error) {
        res.status(400).send({ error: `${error}` })
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
    
        let { password: pass, ...data } = vendor;

        return res.send({
            data: { user: data, accessToken: fastify.jwt.sign({data}) },
        })
      } catch (error) {
        res.status(500).send({ error: `${error}` })
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
    return res.send({accessToken: fastify.jwt.sign({email})});
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
    res.code(200).send({success : "Email Verified"});
}

export const uploadProfilePhoto = async (req, res) => {
  const vendor = await Vendor.findOne({ email: req.user.data.email });
  if(!vendor) {
    return res.status(401).send({ error: 'Invalid Token' })
  }
  let data = await req.file();
  console.log(data.file);
  if(data.mimetype.split("/")[0] !== 'image'){
    return res.status(401).send({ error: 'Invalid File, upload only Image' })
  }
  data = await data.toBuffer();
  // console.log(data);
  vendor.photo = data;
  await vendor.save();
  res.code(200).send({success : "Photo uploaded"});
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

