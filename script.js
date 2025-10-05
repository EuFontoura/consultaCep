const input = document.getElementById("streetInput");

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchCEP();
  }
});

async function searchCEP() {
  const rua = input.value.trim();
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = ""; // limpa resultado anterior

  if (!rua) {
    resultDiv.textContent = "Digite o nome da rua!";
    return;
  }

  const url = `https://viacep.com.br/ws/mg/juiz%20de%20fora/${encodeURIComponent(
    rua
  )}/json/`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      const cep = data[0].cep.replace(/\D/g, ""); // só números
      const logradouro = data[0].logradouro;

      resultDiv.innerHTML = `
        Rua: ${logradouro} <br>
        CEP: <span id="cepValue">${cep}</span>
        <button id="copyBtn" class="copy-btn">Copiar CEP</button>
      `;

      // botão de copiar
      document.getElementById("copyBtn").addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(cep);
          const btn = document.getElementById("copyBtn");
          btn.textContent = "Copiado!";
          setTimeout(() => (btn.textContent = "Copiar CEP"), 2000);
        } catch (err) {
          alert("Erro ao copiar o CEP.");
          console.error(err);
        }
      });
    } else {
      resultDiv.textContent = "Rua não encontrada em Juiz de Fora.";
    }
  } catch (error) {
    resultDiv.textContent = "Erro ao consultar a API.";
    console.error(error);
  }
}
