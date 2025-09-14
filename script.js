const input = document.getElementById("streetInput");

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchCEP();
  }
});

async function searchCEP() {
  const rua = input.value;
  const resultDiv = document.getElementById("result");

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
      resultDiv.textContent = `Rua: ${data[0].logradouro} - CEP: ${data[0].cep}`;
    } else {
      resultDiv.textContent = "Rua não encontrada em Juiz de Fora.";
    }
  } catch (error) {
    resultDiv.textContent = "Erro ao consultar a API.";
    console.error(error);
  }
}
