let listaPessoas = [];

async function carregaDados() {
  try {
    let nacionalidade = document.querySelector("#nacionalidade").value;

    let response = await fetch(
      `https://randomuser.me/api/?results=10&nat=${nacionalidade}`,
    );

    if (!response.ok) {
      throw new Error("Não foi possível buscar os dados.");
    }

    let data = await response.json();

    listaPessoas = data.results;

    filtrarPessoas();
  } catch (erro) {
    console.error("Erro ao carregar as pessoas:", erro);
  }
}

function mostrarPessoas(pessoas) {
  let linhas = pessoas.map(
    (pessoa) => `
        <tr>
            <td>
                <img
                    class="miniatura"
                    src="${pessoa.picture.thumbnail}"
                    data-foto-grande="${pessoa.picture.large}"
                    alt="Foto de ${pessoa.name.first} ${pessoa.name.last}"
                    onclick="mostrarFotoGrande(this.dataset.fotoGrande)"
                >
            </td>

            <td>${pessoa.name.first} ${pessoa.name.last}</td>

            <td>
                <a href="mailto:${pessoa.email}">
                    ${pessoa.email}
                </a>
            </td>

            <td>${pessoa.gender}</td>

            <td>${pessoa.dob.age}</td>

            <td>${pessoa.dob.date.slice(0, 10).split("-").reverse().join("/")}</td>

            <td>${pessoa.location.country}</td>

            <td>${pessoa.location.state}</td>

            <td>${pessoa.cell}</td>

            <td>${pessoa.phone}</td>
        </tr>
    `,
  );

  document.querySelector("#pessoas tbody").innerHTML = linhas.join("");
}

function filtrarPessoas() {
  let termo = document.querySelector("#busca").value.trim().toLowerCase();

  let pessoasFiltradas = listaPessoas.filter((pessoa) => {
    let textoPessoa = `
            ${pessoa.name.first}
            ${pessoa.name.last}
            ${pessoa.email}
            ${pessoa.gender}
            ${pessoa.dob.age}
            ${pessoa.dob.date}
            ${pessoa.location.country}
            ${pessoa.location.state}
            ${pessoa.cell}
            ${pessoa.phone}
        `.toLowerCase();

    return textoPessoa.includes(termo);
  });

  mostrarPessoas(pessoasFiltradas);
}

function ordenarPorNome() {
  listaPessoas.sort((a, b) => {
    let nomeA = `${a.name.first} ${a.name.last}`;
    let nomeB = `${b.name.first} ${b.name.last}`;

    return nomeA.localeCompare(nomeB, "pt-BR", {
      sensitivity: "base",
    });
  });

  filtrarPessoas();
}

function ordenarPorIdade() {
  listaPessoas.sort((a, b) => a.dob.age - b.dob.age);

  filtrarPessoas();
}

function mostrarFotoGrande(url) {
  let modal = document.querySelector("#modalFoto");
  let imagem = document.querySelector("#fotoGrande");

  imagem.src = url;

  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function fecharFotoGrande(event) {
  let modal = document.querySelector("#modalFoto");

  if (!event || event.target === modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");

    document.querySelector("#fotoGrande").removeAttribute("src");
  }
}
carregaDados();
