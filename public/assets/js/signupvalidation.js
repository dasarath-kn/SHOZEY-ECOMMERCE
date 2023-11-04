const mail = document.getElementById("SignUp-mail")

mail.addEventListener( "change" , validateEmail)

function validateEmail() {
    const email = document.getElementById("SignUp-mail").value;
    const emailPattern = /^[a-zA-Z]+[a-zA-Z0-9]*@[a-zA-Z]+\.[a-zA-Z]+$/;
    if (!email.match(emailPattern)) {
        document.getElementById("emailError").innerHTML = "Invalid email format.";
    } else {
        document.getElementById("emailError").innerHTML = "";
     }
        }