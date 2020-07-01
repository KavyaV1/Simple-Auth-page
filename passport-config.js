const { authenticate } = require('passport')
const bcrypt =  require('bcrypt')

const LocalStrategy = require('passport-local').Strategy

 function initialize(passport,getUserByntid, getUserById){
    const authenticateUser=async(ntid, password, done)=> {
        const user= getUserByntid(ntid)
        if (user == null){
            return done(null, false, {
                message:'No user with the Ntid'
            })
        }
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done(null, false, {
                    message: 'Password incorrect'
                })
            }
        }catch (e){
            return done(e)

        }
    }
    passport.use(new LocalStrategy ({ usernameField:'ntid'},
    authenticateUser))
    passport.serializeUser((user, done)=> done(null, user.id))
    passport.deserializeUser((id, done)=> {
       return done(null,getUserById(id))
    })
}

module.exports = initialize