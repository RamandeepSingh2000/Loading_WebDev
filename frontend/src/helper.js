const { jwtDecode } = require('jwt-decode');

module.exports = {

    isLoggedIn : function(){
        
        if(localStorage.getItem("jwtToken")){
            return true;
        }

        return false;
    },

    logout : function(){
        localStorage.clear();
    },

    getAuthToken : function(){
        return localStorage.getItem("jwtToken");
    },
    login : function(jwtToken){
    
        const decodedToken = jwtDecode(jwtToken);
        localStorage.setItem("id", decodedToken.id);
        localStorage.setItem("username", decodedToken.username);
        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("isAdmin", decodedToken.isAdmin);
    },
    getUserId : function(){
        return localStorage.getItem("id");
    },
    isUserAdmin : function(){
        return localStorage.getItem("isAdmin") == "true";
    },
    getUsername : function(){
        return localStorage.getItem("username");
    }
}