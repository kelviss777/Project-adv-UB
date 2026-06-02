const botaoLogin = document.getElementById("btn-login");

botaoLogin.addEventListener("click", function () {

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;


    // VALIDAÇÃO DE E-MAIL
    const emailValido =
        email.includes("@gmail.com") ||
        email.includes("@hotmail.com") ||
        email.includes("@outlook.com") ||
        email.includes("@yahoo.com") ||
        email.includes("@icloud.com") ||
        email.includes("@live.com") ||
        email.includes("@msn.com") ||
        email.includes("@uol.com.br") ||
        email.includes("@bol.com.br") ||
        email.includes("@terra.com.br") ||
        email.includes("@globo.com") ||
        email.includes("@ig.com.br") ||
        email.includes("@r7.com") ||
        email.includes("@protonmail.com") ||
        email.includes("@aol.com") ||
        email.includes("@mail.com") ||
        email.includes("@gmx.com") ||
        email.includes("@zoho.com") ||
        email.includes("@edu.br") ||
        email.includes("@gov.br") ||
        email.includes("@jus.br") ||
        email.includes("@org.br") ||
        email.includes("@com.br");
    // const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // CAMPOS VAZIOS

    if (email === "" || senha === "") {

        alert("Preencha o e-mail e a senha!");

    }

    // EMAIL INVÁLIDO

    else if (!emailValido) {

        alert("Digite um e-mail válido!");

    }

    // LOGIN OK

    else {

        window.location.href = "../dashboard/index.html";

    }

});


// MOSTRAR / OCULTAR SENHA

const senhaInput = document.getElementById("senha");

const toggleSenha = document.getElementById("toggleSenha");

toggleSenha.addEventListener("click", () => {

    if (senhaInput.type === "password") {

        senhaInput.type = "text";

    } else {

        senhaInput.type = "password";

    }

});