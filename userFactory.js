

// Lista de correos autorizados como administradores 
const allowedAdminEmails = [
    "admin@ucaldas.edu.co",
    "otroadmin@ucaldas.edu.co",
    "jose.34172688@ucaldas.edu.co",
    //"cristian.llanos40795@ucaldas.edu.co"
    //"luisa.martinez37412@ucaldas.edu.co",
    //"daniel.ospina38767@ucaldas.edu.co"
    //"andres.garcia36704@ucaldas.edu.co"
    

  ];
  
  
  class User {
    constructor(uid, email, name, role) {
      this.uid = uid;
      this.email = email;
      this.name = name;
      this.role = role;
    }
  }
  
  
  class StudentUser extends User {
    constructor(uid, email, name) {
      super(uid, email, name, "student");  
    }
  }
  
  
  class AdminUser extends User {
    constructor(uid, email, name) {
      super(uid, email, name, "admin");  
    }
  }
  
  
  class UserFactory {
    static createUser(uid, email, name) {
      
      if (allowedAdminEmails.includes(email.toLowerCase())) {
        return new AdminUser(uid, email, name);
      }
      
      return new StudentUser(uid, email, name);
    }
  }
  
  module.exports = { UserFactory, StudentUser, AdminUser };
  

