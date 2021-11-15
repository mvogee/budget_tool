
function validateEmail(email) {
    if (email.charAt(email.length - 4) !== '.') {
        return false;
    }
    return true;
};
function validatePw(pw) {
    if (pw.length < 1) {
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


function validateNewAcc(event) {
    let form = document.querySelector("#newAccForm");
    let email = document.querySelector("#createEmailInput").value;
    let pw = document.querySelector("#createPassInput").value;
    let conf = document.querySelector("#creatPassConf").value;
    if (pw != conf) {
        form.reset();
        document.querySelector(".infoText").innerHTML = "Your passwords didn't match.";
        event.preventDefault();
    }
    else if (!validateEmail(email)) {
        form.reset();
        document.querySelector(".infoText").innerHTML = "Please enter a valid email address.";
        event.preventDefault();
    }
}


// * hide navigation items with no access and log out button