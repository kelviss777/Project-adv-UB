const botaoLogin = document.getElementById("btn-login");

botaoLogin.addEventListener("click", function () {

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;


    if (email === "" || senha === "") {

        alert("Preencha o e-mail e a senha!");

    } else {

        window.location.href = "../dashboard/index.html";

    }

});