// --- ELEMENTOS ---
const botaoAbrir     = document.getElementById('btn-novo-documento');
const botaoFechar    = document.getElementById('fechar-modal-novo-documento');
const botaoCancelar  = document.getElementById('cancelar-modal-novo-documento');
const botaoSalvar    = document.getElementById('salvar-modal-novo-documento');
const modal          = document.getElementById('modal-novo-documento');

const inputNome              = document.getElementById('modal-nome');
const selectTipo             = document.getElementById('modal-tipo');
const selectProcessoRelac    = document.getElementById('modal-processo-relacionado');
const inputArquivo           = document.getElementById('modal-arquivo');

const corpoTabela = document.getElementById('corpo-tabela');

const modalVisualizar        = document.getElementById('modal-visualizar');
const fecharVisualizar       = document.getElementById('fechar-modal-visualizar');
const fecharVisualizarBtn    = document.getElementById('fechar-modal-visualizar-btn');
const btnExcluir             = document.getElementById('excluir-documento');
const campoRelacionado       = document.getElementById('campo-processo-relacionado');

// Linha atualmente aberta no modal de visualizar
let linhaAtual = null;

// --- GERAR NÚMERO DE PROCESSO ÚNICO ---
function gerarNumeroProcesso() {
  const existentes = Array.from(corpoTabela.querySelectorAll('td[data-processo]'))
    .map(td => td.dataset.processo);

  let numero;
  do {
    const seq     = String(Math.floor(Math.random() * 9999999)).padStart(7, '0');
    const digito  = String(Math.floor(Math.random() * 99)).padStart(2, '0');
    const ano     = new Date().getFullYear();
    const tribunal = '8.26';
    const vara    = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    numero = `${seq}-${digito}.${ano}.${tribunal}.${vara}`;
  } while (existentes.includes(numero));

  return numero;
}

// --- ABRIR / FECHAR MODAL NOVO DOCUMENTO ---
botaoAbrir.addEventListener('click', () => modal.showModal());

function fecharELimparModal() {
  inputNome.value = '';
  selectTipo.selectedIndex = 0;
  selectProcessoRelac.selectedIndex = 0;
  inputArquivo.value = '';
  modal.close();
}

botaoFechar.addEventListener('click', fecharELimparModal);
botaoCancelar.addEventListener('click', fecharELimparModal);

// --- SALVAR NOVO DOCUMENTO ---
botaoSalvar.addEventListener('click', () => {
  const nome      = inputNome.value.trim();
  const tipo      = selectTipo.value;
  const relacionado = selectProcessoRelac.value;
  const arquivo   = inputArquivo.files[0];

  if (!nome || !tipo) {
    alert('Por favor, preencha os campos obrigatórios (Nome e Tipo).');
    return;
  }

  if (!arquivo) {
    alert('Por favor, anexe um arquivo.');
    return;
  }

  // Gera URL acessível para o arquivo (fica na memória enquanto a aba estiver aberta)
  const arquivoURL  = URL.createObjectURL(arquivo);
  const arquivoNome = arquivo.name;

  // Número próprio gerado automaticamente
  const numeroProcesso = gerarNumeroProcesso();

  // Data de hoje
  const hoje = new Date();
  const dataFormatada = `${String(hoje.getDate()).padStart(2,'0')}/${String(hoje.getMonth()+1).padStart(2,'0')}/${hoje.getFullYear()}`;

  const novaLinha = document.createElement('tr');
  novaLinha.innerHTML = `
    <td
      data-nome="${nome}"
      data-tipo="${tipo}"
      data-processo="${numeroProcesso}"
      data-relacionado="${relacionado}"
      data-data="${dataFormatada}"
      data-status="pendente"
      data-arquivo-nome="${arquivoNome}"
      data-arquivo-url="${arquivoURL}"
    >${nome}</td>
    <td>${tipo}</td>
    <td>${numeroProcesso}</td>
    <td>${dataFormatada}</td>
    <td><span class="badge pendente">Pendente</span></td>
    <td><button class="btn-visualizar">Visualizar</button></td>
  `;

  corpoTabela.insertBefore(novaLinha, corpoTabela.firstChild);
  fecharELimparModal();
});

// --- MODAL VISUALIZAR ---
fecharVisualizar.addEventListener('click', () => modalVisualizar.close());
fecharVisualizarBtn.addEventListener('click', () => modalVisualizar.close());

corpoTabela.addEventListener('click', (e) => {
  if (!e.target.classList.contains('btn-visualizar')) return;

  linhaAtual = e.target.closest('tr');
  const td = linhaAtual.querySelector('td[data-nome]');

  const status     = td.dataset.status;
  const relacionado = td.dataset.relacionado;
  const arquivoURL  = td.dataset.arquivoUrl;
  const arquivoNome = td.dataset.arquivoNome;

  document.getElementById('visualizar-nome').textContent     = td.dataset.nome;
  document.getElementById('visualizar-tipo').textContent     = td.dataset.tipo;
  document.getElementById('visualizar-processo').textContent = td.dataset.processo;
  document.getElementById('visualizar-data').textContent     = td.dataset.data;
  document.getElementById('visualizar-status').textContent   = status === 'enviado' ? 'Enviado' : 'Pendente';

  // Processo relacionado: mostra ou esconde o campo
  if (relacionado) {
    campoRelacionado.style.display = 'flex';
    document.getElementById('visualizar-processo-relacionado').textContent = relacionado;
  } else {
    campoRelacionado.style.display = 'none';
  }

  // Arquivo: link clicável se tiver URL, texto simples se for dado estático
  const pArquivo = document.getElementById('visualizar-arquivo');
  if (arquivoURL) {
    pArquivo.innerHTML = `<a href="${arquivoURL}" target="_blank" rel="noopener">${arquivoNome}</a>`;
  } else {
    pArquivo.textContent = arquivoNome || 'Nenhum arquivo anexado';
  }

  // Botão excluir: só aparece para pendentes
  if (status === 'pendente') {
    btnExcluir.style.display = 'inline-block';
  } else {
    btnExcluir.style.display = 'none';
  }

  modalVisualizar.showModal();
});

// --- EXCLUIR DOCUMENTO (só pendentes) ---
btnExcluir.addEventListener('click', () => {
  if (!linhaAtual) return;
  const confirmar = confirm('Tem certeza que deseja excluir este documento?');
  if (confirmar) {
    linhaAtual.remove();
    linhaAtual = null;
    modalVisualizar.close();
  }
});