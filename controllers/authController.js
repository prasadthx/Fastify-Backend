import { compare, genSaltSync, hash } from 'bcrypt'

export const signUp = async (prismaClient, req, res) => {
    try {
        let { name, email, password } = req.body;
        password = await hashPassword(password)
        
        let { password: pass, ...user } = await prismaClient.user.create({
            data: { name, email, password },
        })

        res.send({ data: { user } })
    }
    catch (error) {
        res.status(400).send({ error: `${error}` })
    }
}

export const login = async (fastify, req, res) => {
    try {
        let { email, password } = req.body;
    
        let user = await fastify.prisma.user.findUnique({ 
            where: { email } 
        })
    
        if (!user) {
          return res.status(401).send({ error: 'Invalid email' })
        }
    
        if (!(await comparePassword(password, user.password))) {
          return res.status(401).send({ error: 'Invalid password' })
        }
    
        let { password: pass, ...data } = user

        console.log(data);
        return res.send({
            data: { user: data, accessToken: fastify.jwt.sign({data}) },
        })
      } catch (error) {
        res.status(500).send({ error: `${error}` })
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

