const checkPermission = (permission) => {
    return (req, res, next) => {
      if (req.user.permissions[permission]) {
        return next();
      }
      res.status(403).send({ error: 'Access denied. Insufficient permissions.' });
    };
  };
  
  module.exports = {
    canCreateBooks: checkPermission('createBooks'),
    canUpdateBooks: checkPermission('updateBooks'),
    canDeleteBooks: checkPermission('deleteBooks'),
    canUpdateUsers: checkPermission('updateUsers'),
    canDeleteUsers: checkPermission('deleteUsers')
  };