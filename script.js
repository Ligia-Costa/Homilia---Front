document.addEventListener("DOMContentLoaded", function () {
  const botao = document.getElementById("gerar");
  const resultado = document.getElementById("resultado");
  const titulo = document.getElementById("titulo");
  const referencia = document.getElementById("referencia");
  const tema = document.getElementById("tema");
  const pontos = document.getElementById("pontos");
  const aplicacoes = document.getElementById("aplicacoes");

  botao.addEventListener("click", async () => {
    const data = document.getElementById("data").value;
    if (!data) {
      alert("Por favor, escolha uma data.");
      return;
    }

    // Mostra mensagem de carregando e limpa campos anteriores
    resultado.classList.remove("hidden");
    titulo.textContent = "";
    referencia.textContent = "";
    tema.textContent = "";
    pontos.innerHTML = "";
    aplicacoes.innerHTML = "";
    titulo.innerHTML = `<span class="italic text-gray-600">⏳ Gerando homilia...</span>`;

    try {
      const dataFormatada = data.split("-").reverse().join("/");
      const resposta = await fetch("https://homilia-back.vercel.app/homilia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataFormatada }),
      });

      const json = await resposta.json();

      if (resposta.ok) {
        // Preenche os campos com os dados recebidos
        titulo.textContent = json.titulo || "";
        referencia.textContent = json.referencia_biblica || "";
        tema.textContent = json.tema_central || "";

        pontos.innerHTML = "";
        (json.pontos_da_reflexao || []).forEach((ponto) => {
          const li = document.createElement("li");
          li.textContent = ponto;
          pontos.appendChild(li);
        });

        aplicacoes.innerHTML = "";
        (json.aplicacao_pratica || []).forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          aplicacoes.appendChild(li);
        });
      } else {
        titulo.textContent = "";
        alert(json.error || "Erro ao gerar homilia.");
        if (json.erro) {
          titulo.innerHTML = `<span style="color: red;">${json.erro}</span>`;
        }
      }
    } catch (erro) {
      titulo.textContent = "";
      alert("Erro ao conectar com o servidor.");
    }
  });

  // Chatbot
  const abrirChat = document.getElementById("abrir-chat");
  const fecharChat = document.getElementById("fechar-chat");
  const chatBox = document.getElementById("chatbox");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMensagens = document.getElementById("chat-mensagens");

  abrirChat.addEventListener("click", () => {
    chatBox.classList.remove("hidden");
  });

  fecharChat.addEventListener("click", () => {
    chatBox.classList.add("hidden");
  });

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pergunta = chatInput.value.trim();
    if (!pergunta) return;

    adicionarMensagem("Você", pergunta);
    chatInput.value = "";
    adicionarMensagem("Assistente", "⏳ Pensando...");

    try {
      const resp = await fetch("https://homilia-back.vercel.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta }),
      });

      const json = await resp.json();
      chatMensagens.lastChild.remove();
      adicionarMensagem("Assistente", json.resposta || "Não foi possível responder.");
    } catch (err) {
      chatMensagens.lastChild.remove();
      adicionarMensagem("Assistente", "❌ Erro ao conectar.");
    }
  });

  function adicionarMensagem(remetente, texto) {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${remetente}:</strong> ${texto}`;
    chatMensagens.appendChild(div);
    chatMensagens.scrollTop = chatMensagens.scrollHeight;
  }
});

function limparCampos() {
    dataInput.value = '';
    const inputs = divdata.querySelectorAll('.data-input');
    inputs.forEach(input => input.value = '');
    divResultado.classList.add('hidden');
    homilia.textContent = '';
}