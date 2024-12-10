// Configurações gerais
const EMAIL_JS_CONFIG = {
  publicKey: "s7eWkxR-sAUpWSHJh",
  serviceId: "service_9zcbv3j",
  templateId: "template_s3dukvq",
};
const POPUP_TIMEOUT = 2000; // Tempo em ms para exibir o pop-up

// Inicialize o EmailJS
emailjs.init(EMAIL_JS_CONFIG.publicKey);

// Menu Toggle (Caso precise para mobile)
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");

if (menuIcon) {
  menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });
}

// Adicione o evento ao formulário
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");
    const formMessage = document.getElementById("form-message");

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();

    // Validações simplificadas
    if (!name || name.length < 2 || name.length > 50) {
      formMessage.textContent = "Por favor, insira um nome válido.";
      formMessage.className = "error";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formMessage.textContent = "Por favor, insira um e-mail válido.";
      formMessage.className = "error";
      return;
    }
    if (!message || message.length < 10 || message.length > 300) {
      formMessage.textContent =
        "A mensagem deve conter entre 10 e 300 caracteres.";
      formMessage.className = "error";
      return;
    }

    // Envio da mensagem
    formMessage.textContent = "Enviando...";
    formMessage.className = "info";

    try {
      await emailjs.send(
        EMAIL_JS_CONFIG.serviceId,
        EMAIL_JS_CONFIG.templateId,
        {
          from_name: name, // Alinhado com o template
          reply_to: email, // Alinhado com o template
          message, // Alinhado com o template
        }
      );
      formMessage.textContent = "Mensagem enviada com sucesso!";
      formMessage.className = "success";
      contactForm.reset();
    } catch (error) {
      console.error(error);
      formMessage.textContent = "Erro ao enviar a mensagem. Tente novamente.";
      formMessage.className = "error";
    }
  });
}

// Função para copiar o e-mail
const copyEmailButton = document.getElementById("copy-email");
const emailText = document.getElementById("user-email");

if (copyEmailButton) {
  copyEmailButton.addEventListener("click", () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(emailText.textContent)
        .then(() => showCopiedPopup("E-mail copiado com sucesso!"))
        .catch((err) => console.error("Erro ao copiar o e-mail:", err));
    } else {
      alert("Seu navegador não suporta cópia automática.");
    }
  });
}

// Função para exibir o pop-up "Copiado!"
function showCopiedPopup(message) {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.className = "copied-popup";

  // Posicionar e exibir
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("show"), 50);

  // Remover após o tempo definido
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, POPUP_TIMEOUT);
}
