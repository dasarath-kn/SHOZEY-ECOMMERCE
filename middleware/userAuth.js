const is_Login = async(req,res,next)=> {
    try {
        if(req.session.userId){
            next()
        }else{
            res.redirect('/')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const is_Logout = async(req,res,next) => {
    try {
        if(!req.session.userId){
            next()
        }else{
            res.redirect('/home')
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    is_Login,
    is_Logout
}