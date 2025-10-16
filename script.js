const input = document.getElementById("streetInput");
const resultDiv = document.getElementById("result");

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchCEP();
  }
});


function displayResult(cep, logradouro) {
  const cleanCep = cep.replace(/\D/g, "");

  resultDiv.innerHTML = `
    Rua: ${logradouro} <br>
    CEP: <span id="cepValue">${cleanCep}</span>
    <button id="copyBtn" class="copy-btn">Copiar CEP</button>
  `;

  document.getElementById("copyBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(cleanCep);
      const btn = document.getElementById("copyBtn");
      btn.textContent = "Copiado!";
      setTimeout(() => (btn.textContent = "Copiar CEP"), 2000);
    } catch (err) {
      alert("Erro ao copiar o CEP.");
      console.error("Falha ao copiar: ", err);
    }
  });
}

async function searchCEP() {
  const rua = input.value.trim();
  resultDiv.innerHTML = "Buscando...";

  if (!rua) {
    resultDiv.textContent = "Digite o nome da rua!";
    return;
  }

  try {
    const urlViaCEP = `https://viacep.com.br/ws/mg/juiz%20de%20fora/${encodeURIComponent(
      rua
    )}/json/`;
    const response = await fetch(urlViaCEP);
    if (!response.ok)
      throw new Error("ViaCEP: Resposta de rede não foi bem-sucedida.");
    const data = await response.json();

    if (data && !data.erro && data.length > 0) {
      displayResult(data[0].cep, data[0].logradouro);
      return;
    }
  } catch (error) {
    console.error("Erro na API ViaCEP:", error);
  }

  try {
    const cidade = "Juiz de Fora";
    const uf = "MG";
    const urlRepublica = `http://republicavirtual.com.br/web_cep.php?formato=json&cidade=${encodeURIComponent(
      cidade
    )}&uf=${uf}&logradouro=${encodeURIComponent(rua)}`;

    const response = await fetch(urlRepublica);
    if (!response.ok)
      throw new Error(
        "RepublicaVirtual: Resposta de rede não foi bem-sucedida."
      );
    const data = await response.json();

    if (data && data.resultado === "1") {
      const fullLogradouro = `${data.tipo_logradouro} ${data.logradouro}`;
      displayResult(data.cep, fullLogradouro);
      return; 
    }
  } catch (error) {
    console.error("Erro na API Republica Virtual:", error);
    resultDiv.textContent = "Erro ao consultar as APIs.";
    return;
  }

  resultDiv.textContent = "Rua não encontrada em Juiz de Fora.";
}
