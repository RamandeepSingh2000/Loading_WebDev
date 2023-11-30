const { jwtDecode } = require('jwt-decode');

module.exports = {

    isLoggedIn : function(){
        
        if(localStorage.getItem("jwtToken")){
            return true;
        }

        return false;
    },

    logout : function(){
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("id");
        localStorage.removeItem("username");
    },

    getAuthToken : function(){
        return localStorage.getItem("jwtToken");
    },
    login : function(jwtToken){
    
        const decodedToken = jwtDecode(jwtToken);
        localStorage.setItem("id", decodedToken.id);
        localStorage.setItem("username", decodedToken.username);
        localStorage.setItem("jwtToken", jwtToken);
    },
    getUserId : function(){
        return localStorage.getItem("id");
    }
}