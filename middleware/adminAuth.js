
//===================================  CHECKING ADMIN IS LOG-IN =====================================//

const checkadminisLogin = async (req, res, next) => {
  try {
    if (req.session.adminId) {
      next();
    }
    else {
      res.redirect('/admin')

    }
  }

  catch (error) {
    console.log(error);
  }

}

//===================================  CHECKING ADMIN IS LOG-OUT =====================================//

const checkadminisLogout = async (req, res, next) => {
  try {
    if (!req.session.adminId) {
      next()
    }
    else {
      res.redirect('/admin/dashboard');
    }
  }
  catch (error) {
   
    console.log(error);
  }
}

module.exports = {
  checkadminisLogin,
  checkadminisLogout
}