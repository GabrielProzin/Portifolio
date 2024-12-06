// Menu Toggle (Caso precise para mobile)
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");

if (menuIcon) {
  menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });
}

// Inicialize o EmailJS com sua Public Key
emailjs.init("s7eWkxR-sAUpWSHJh"); // Substitua com sua Public Key encontrada no painel do EmailJS

// Variáveis para controle de submissão
let lastSubmitTime = 0; // Controle de taxa de submissão (rate limiting)

// Função para sanitizar entradas de texto
function sanitizeInput(input) {
  const element = document.createElement("div");
  element.innerText = input;
  return element.innerHTML;
}

// Adicione o evento ao formulário
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o reload da página

    // Obter os campos do formulário
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");
    const honeypotField = document.getElementById("honeypot");
    const formMessage = document.getElementById("form-message");

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();
    const honeypot = honeypotField ? honeypotField.value.trim() : "";

    // Limpar mensagens anteriores
    formMessage.innerText = "";
    formMessage.className = "";

    // Validações básicas
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (honeypot !== "") {
      formMessage.innerText = "Erro: Detecção de bot.";
      formMessage.className = "error";
      return;
    }

    if (name === "" || name.length < 2 || name.length > 50) {
      formMessage.innerText =
        "Por favor, insira um nome válido (entre 2 e 50 caracteres).";
      formMessage.className = "error";
      return;
    }

    if (!emailRegex.test(email)) {
      formMessage.innerText = "Por favor, insira um e-mail válido.";
      formMessage.className = "error";
      return;
    }

    if (message === "" || message.length < 10 || message.length > 300) {
      formMessage.innerText =
        "A mensagem deve conter entre 10 e 300 caracteres.";
      formMessage.className = "error";
      return;
    }

    // Prevenção contra envios frequentes
    const currentTime = new Date().getTime();
    if (currentTime - lastSubmitTime < 30000) {
      formMessage.innerText = "Aguarde 30 segundos antes de enviar novamente.";
      formMessage.className = "error";
      return;
    }
    lastSubmitTime = currentTime;

    // Sanitização de inputs
    const sanitizedData = {
      name: sanitizeInput(name), // Chave deve corresponder a {{name}}
      email: sanitizeInput(email), // Chave deve corresponder a {{email}}
      message: sanitizeInput(message), // Chave deve corresponder a {{message}}
    };

    // Exibir status de envio
    formMessage.innerText = "Enviando...";
    formMessage.className = "info";

    // Envia o formulário usando EmailJS
    emailjs.send("service_9zcbv3j", "template_s3dukvq", sanitizedData).then(
      function () {
        formMessage.innerText = "Mensagem enviada com sucesso!";
        formMessage.className = "success";
        contactForm.reset(); // Reseta o formulário após envio
      },
      function (error) {
        formMessage.innerText = "Erro ao enviar a mensagem. Tente novamente.";
        formMessage.className = "error";
        console.error("Erro:", error);
      }
    );
  });
}
