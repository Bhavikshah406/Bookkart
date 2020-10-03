// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
            res.status(403).json({success:false,error:`User role ${req.user.role} is not authorized to access this route`})
        );
      }
      next();
    };
  };
  