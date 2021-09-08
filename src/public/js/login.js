
function validateEmail(email) {
    if (email.charAt(email.length - 4) !== '.') {
        return false;
    }
    return true;
};
function validatePw(pw) {
    if (pw.length < 8) {
        return (false);
    }
    return true;
}

function validateLogin(event) {
    let form = document.querySelector("#loginForm");
    let email = document.querySelector("#loginEmailInput").value;
    let pw = document.querySelector("#loginPassInput").value;
    console.log(email + ":" + pw);
    if (!validateEmail(email) || !validatePw(pw)) {
        form.reset();
        document.querySelector(".infoText").innerHTML = "Incorrect username or password.";
        event.preventDefault();
    }
};