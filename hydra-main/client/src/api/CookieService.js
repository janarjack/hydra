class CookieService {
    checkSession() {
        var cookieKeyValue = null;
        var userEmail = '';
        var userRole = '';
        var validSession = false;

        if (document.cookie) {
            cookieKeyValue = document.cookie.split(';');
            for (var i = 0; i < cookieKeyValue.length; i++) {
                var cav = cookieKeyValue[i];
                var ca = cav.split('=');

                if (ca[0].trim() === "hpemail") {
                    userEmail = ca[1];
                }
                if (ca[0].trim() === "hprole") {
                    userRole = ca[1];
                }
            }

            if (userEmail.length > 0 && userRole.length > 0) {
                validSession = true;
            }
            return validSession;
        }
        return false;
    }

    getRoleFromSession() {
        var cookieKeyValue = null;
        var userRole = '';

        if (document.cookie) {
            cookieKeyValue = document.cookie.split(';');
            for (var i = 0; i < cookieKeyValue.length; i++) {
                var cav = cookieKeyValue[i];
                var ca = cav.split('=');

                if (ca[0].trim() === "hprole") {
                    userRole = ca[1];
                }
            }

            return userRole;
        }
        return 'COOKIENOTFOUND';
    }

    getEmailFromSession() {
        var cookieKeyValue = null;
        var userEmail = '';

        if (document.cookie) {
            cookieKeyValue = document.cookie.split(';');
            for (var i = 0; i < cookieKeyValue.length; i++) {
                var cav = cookieKeyValue[i];
                var ca = cav.split('=');

                if (ca[0].trim() === "hpemail") {
                    userEmail = ca[1];
                }
            }

            return userEmail;
        }
        return 'COOKIENOTFOUND';
    }

    getDepartmentCodeFromSession() {
        var cookieKeyValue = null;
        var departmentCode = '';

        if (document.cookie) {
            cookieKeyValue = document.cookie.split(';');
            for (var i = 0; i < cookieKeyValue.length; i++) {
                var cav = cookieKeyValue[i];
                var ca = cav.split('=');
                if (ca[0].trim() === "hpdepartmentcode") {
                    departmentCode = ca[1];
                }
            }

            return departmentCode;
        }
        return 'COOKIENOTFOUND';
    }

    loginUser(user) {
        var email = user.email;
        var role = user.role;
        var departmentCode = user.departmentCode;
        document.cookie = 'hpemail=' + email + ';path=/';
        document.cookie = 'hprole=' + role + ';path=/';
        document.cookie = 'hpdepartmentcode=' + departmentCode + ';path=/';
    }

    logoutUser() {
        document.cookie = 'hpemail=;path=/';
        document.cookie = 'hprole=;path=/';
        document.cookie = 'hpdepartmentcode=;path=/';
        window.location.href = '/';
    }
}

export default new CookieService()
