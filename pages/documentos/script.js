// --- ELEMENTOS ---
const botaoAbrir     = document.getElementById('btn-novo-documento');
const botaoFechar    = document.getElementById('fechar-modal-novo-documento');
const botaoCancelar  = document.getElementById('cancelar-modal-novo-documento');
const botaoSalvar    = document.getElementById('salvar-modal-novo-documento');
const modal          = document.getElementById('modal-novo-documento');

const inputNome           = document.getElementById('modal-nome');
const selectTipo          = document.getElementById('modal-tipo');
const selectProcessoRelac = document.getElementById('modal-processo-relacionado');
const inputArquivo        = document.getElementById('modal-arquivo');

const corpoTabela = document.getElementById('corpo-tabela');

const modalVisualizar     = document.getElementById('modal-visualizar');
const fecharVisualizar    = document.getElementById('fechar-modal-visualizar');
const fecharVisualizarBtn = document.getElementById('fechar-modal-visualizar-btn');
const btnExcluir          = document.getElementById('excluir-documento');
const campoRelacionado    = document.getElementById('campo-processo-relacionado');

const inputBusca       = document.getElementById('busca');
const selectFiltroTipo = document.getElementById('filtro-tipo');
const btnLimpar        = document.getElementById('btn-limpar-filtros');

let linhaAtual = null;

// --- TOAST ---
function mostrarToast(mensagem, tipo = 'sucesso') {
  const toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.className = `toast toast--${tipo} toast--visivel`;
  setTimeout(() => toast.className = 'toast', 3000);
}

// --- GERAR NÚMERO DE PROCESSO ÚNICO ---
function gerarNumeroProcesso() {
  const existentes = Array.from(corpoTabela.querySelectorAll('td[data-processo]'))
    .map(td => td.dataset.processo);

  let numero;
  do {
    const seq      = String(Math.floor(Math.random() * 9999999)).padStart(7, '0');
    const digito   = String(Math.floor(Math.random() * 99)).padStart(2, '0');
    const ano      = new Date().getFullYear();
    const tribunal = '8.26';
    const vara     = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
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
  const nome       = inputNome.value.trim();
  const tipo       = selectTipo.value;
  const relacionado = selectProcessoRelac.value;
  const arquivo    = inputArquivo.files[0];

  if (!nome || !tipo) {
    mostrarToast('Preencha os campos obrigatórios (Nome e Tipo).', 'erro');
    return;
  }
  if (!arquivo) {
    mostrarToast('Anexe um arquivo antes de salvar.', 'erro');
    return;
  }

  const arquivoURL  = URL.createObjectURL(arquivo);
  const arquivoNome = arquivo.name;
  const numeroProcesso = gerarNumeroProcesso();

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
  mostrarToast('Documento salvo com sucesso!');
  verificarVazio();
});

// --- MODAL VISUALIZAR ---
fecharVisualizar.addEventListener('click', () => modalVisualizar.close());
fecharVisualizarBtn.addEventListener('click', () => modalVisualizar.close());

corpoTabela.addEventListener('click', (e) => {
  if (!e.target.classList.contains('btn-visualizar')) return;

  linhaAtual = e.target.closest('tr');
  const td = linhaAtual.querySelector('td[data-nome]');

  const status      = td.dataset.status;
  const relacionado = td.dataset.relacionado;
  const arquivoURL  = td.dataset.arquivoUrl;
  const arquivoNome = td.dataset.arquivoNome;

  document.getElementById('visualizar-nome').textContent     = td.dataset.nome;
  document.getElementById('visualizar-tipo').textContent     = td.dataset.tipo;
  document.getElementById('visualizar-processo').textContent = td.dataset.processo;
  document.getElementById('visualizar-data').textContent     = td.dataset.data;
  document.getElementById('visualizar-status').textContent   = status === 'enviado' ? 'Enviado' : 'Pendente';

  if (relacionado) {
    campoRelacionado.style.display = 'flex';
    document.getElementById('visualizar-processo-relacionado').textContent = relacionado;
  } else {
    campoRelacionado.style.display = 'none';
  }

  const pArquivo = document.getElementById('visualizar-arquivo');
  if (arquivoURL) {
    pArquivo.innerHTML = `<a href="${arquivoURL}" target="_blank" rel="noopener">${arquivoNome}</a>`;
  } else {
    pArquivo.textContent = arquivoNome || 'Nenhum arquivo anexado';
  }

  btnExcluir.style.display = status === 'pendente' ? 'inline-block' : 'none';

  modalVisualizar.showModal();
});

// --- EXCLUIR DOCUMENTO ---
btnExcluir.addEventListener('click', () => {
  if (!linhaAtual) return;
  const confirmar = confirm('Tem certeza que deseja excluir este documento?');
  if (confirmar) {
    linhaAtual.remove();
    linhaAtual = null;
    modalVisualizar.close();
    mostrarToast('Documento excluído.', 'erro');
    verificarVazio();
  }
});

// --- FILTROS ---
function filtrarTabela() {
  const textoBusca     = inputBusca.value.toLowerCase().trim();
  const tipoSelecionado = selectFiltroTipo.value;

  const linhas = corpoTabela.querySelectorAll('tr');
  let visiveis = 0;

  linhas.forEach(linha => {
    if (linha.id === 'linha-vazia') return;
    const td = linha.querySelector('td[data-nome]');
    if (!td) return;

    const nome     = td.dataset.nome.toLowerCase();
    const processo = td.dataset.processo.toLowerCase();
    const tipo     = td.dataset.tipo;

    const passaBusca = !textoBusca || nome.includes(textoBusca) || processo.includes(textoBusca);
    const passaTipo  = !tipoSelecionado || tipo === tipoSelecionado;

    const mostrar = passaBusca && passaTipo;
    linha.style.display = mostrar ? '' : 'none';
    if (mostrar) visiveis++;
  });

  // Mensagem de vazio por filtro
  let linhaVazia = document.getElementById('linha-vazia');
  const totalLinhas = corpoTabela.querySelectorAll('tr:not(#linha-vazia)').length;

  if (visiveis === 0 && totalLinhas > 0) {
    if (!linhaVazia) {
      linhaVazia = document.createElement('tr');
      linhaVazia.id = 'linha-vazia';
      linhaVazia.innerHTML = `<td colspan="6" class="msg-vazio">Nenhum documento encontrado para os filtros aplicados.</td>`;
      corpoTabela.appendChild(linhaVazia);
    }
    linhaVazia.style.display = '';
  } else if (linhaVazia) {
    linhaVazia.style.display = 'none';
  }

  // Mostra ou esconde botão limpar
  const filtroAtivo = textoBusca || tipoSelecionado;
  btnLimpar.style.display = filtroAtivo ? 'inline-block' : 'none';
}

function verificarVazio() {
  const linhas = corpoTabela.querySelectorAll('tr:not(#linha-vazia)');
  let linhaVazia = document.getElementById('linha-vazia');

  if (linhas.length === 0) {
    if (!linhaVazia) {
      linhaVazia = document.createElement('tr');
      linhaVazia.id = 'linha-vazia';
      linhaVazia.innerHTML = `<td colspan="6" class="msg-vazio">Nenhum documento cadastrado ainda.</td>`;
      corpoTabela.appendChild(linhaVazia);
    }
    linhaVazia.style.display = '';
  } else if (linhaVazia) {
    linhaVazia.style.display = 'none';
  }
}

btnLimpar.addEventListener('click', () => {
  inputBusca.value = '';
  selectFiltroTipo.selectedIndex = 0;
  filtrarTabela();
});

inputBusca.addEventListener('input', filtrarTabela);
selectFiltroTipo.addEventListener('change', filtrarTabela);

// --- ORDENAÇÃO POR CABEÇALHO ---
const colunas = ['nome', 'tipo', 'processo', 'data', null, null]; // null = sem ordenação
let ordemAtual = { coluna: null, asc: true };

document.querySelectorAll('thead th').forEach((th, i) => {
  if (colunas[i] === null) return;

  th.style.cursor = 'pointer';
  th.title = 'Clique para ordenar';

  th.addEventListener('click', () => {
    const campo = colunas[i];
    const mesmaColunaAntes = ordemAtual.coluna === campo;
    ordemAtual.asc = mesmaColunaAntes ? !ordemAtual.asc : true;
    ordemAtual.coluna = campo;

    // Atualiza indicador visual
    document.querySelectorAll('thead th').forEach(t => t.classList.remove('ordenado-asc', 'ordenado-desc'));
    th.classList.add(ordemAtual.asc ? 'ordenado-asc' : 'ordenado-desc');

    const linhas = Array.from(corpoTabela.querySelectorAll('tr:not(#linha-vazia)'));

    linhas.sort((a, b) => {
      const tdA = a.querySelector('td[data-nome]');
      const tdB = b.querySelector('td[data-nome]');
      if (!tdA || !tdB) return 0;

      let valA = tdA.dataset[campo] || '';
      let valB = tdB.dataset[campo] || '';

      // Ordenação de data corretamente (DD/MM/AAAA)
      if (campo === 'data') {
        const toDate = s => {
          const [d, m, y] = s.split('/');
          return new Date(`${y}-${m}-${d}`);
        };
        return ordemAtual.asc ? toDate(valA) - toDate(valB) : toDate(valB) - toDate(valA);
      }

      return ordemAtual.asc
        ? valA.localeCompare(valB, 'pt-BR')
        : valB.localeCompare(valA, 'pt-BR');
    });

    linhas.forEach(l => corpoTabela.appendChild(l));

    const linhaVazia = document.getElementById('linha-vazia');
    if (linhaVazia) corpoTabela.appendChild(linhaVazia);
  });
});