class AuthService{
    setToken(token){
        try {
            localStorage.setItem('jwtToken', token);
        }
        catch (e) {
            console.error(e);
        }
    }

    setUserData(user){
        localStorage.setItem('user', JSON.stringify(user));
    }

    getToken(){
        return localStorage.getItem('jwtToken');
    }
    removeToken(){
        localStorage.removeItem('jwtToken');
    }
    getUserData(){
        return JSON.parse(localStorage.getItem('user'));
    }

    removeUserData(){
        localStorage.removeItem('user');

    }
    isAuthenticated(){
        return this.getToken() !== null;
    }

    login(data){
        this.setToken(data.access_token);
        this.setUserData(data.user);
    }
    logout(){
        this.removeToken();
        this.removeUserData();

    }
}

export const authService = new AuthService();