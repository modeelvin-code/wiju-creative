/* =========================================================
   WIJU CREATOR — comportamento do menu mobile
   ========================================================= */

(function () {
  'use strict';

  const btn  = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');

  if (!btn || !menu) return; // segurança: se algum elemento não existir, não quebra o site

  function fecharMenu() {
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menu');
    menu.classList.remove('aberto');
  }

  function abrirMenu() {
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Fechar menu');
    menu.classList.add('aberto');
  }

  // Alternar ao clicar no botão hambúrguer
  btn.addEventListener('click', () => {
    const aberto = btn.getAttribute('aria-expanded') === 'true';
    aberto ? fecharMenu() : abrirMenu();
  });

  // Fecha ao clicar em um link do menu
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', fecharMenu);
  });

  // Fecha com tecla Esc e devolve o foco ao botão
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('aberto')) {
      fecharMenu();
      btn.focus();
    }
  });

  // Fecha ao clicar fora do header
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('aberto') && !e.target.closest('nav')) {
      fecharMenu();
    }
  });

  // Reseta ao voltar para o desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) fecharMenu();
  });

    // ==========================================
  // Envio do Formulário de Contato (AJAX)
  // ==========================================
  const form = document.getElementById('form-contato');
  const btnEnviar = document.getElementById('btn-enviar');
  const resultado = document.getElementById('form-resultado');

  if (form && btnEnviar && resultado) {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Impede recarregar a página

      // Estado de carregamento
      const textoOriginal = btnEnviar.textContent;
      btnEnviar.textContent = 'Enviando...';
      btnEnviar.disabled = true;
      resultado.className = 'form-resultado';
      resultado.textContent = '';

      // Prepara os dados
      const formData = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status === 200) {
          // Sucesso
          resultado.textContent = 'Mensagem enviada com sucesso! Retornarei em breve.';
          resultado.classList.add('sucesso');
          form.reset(); // Limpa os campos
        } else {
          // Erro retornado pela API
          console.error(json);
          resultado.textContent = 'Ops, algo deu errado. Tente novamente ou use o WhatsApp.';
          resultado.classList.add('erro');
        }
      })
      .catch(error => {
        console.error(error);
        resultado.textContent = 'Erro de conexão. Verifique sua internet.';
        resultado.classList.add('erro');
      })
      .finally(() => {
        // Restaura o botão
        btnEnviar.textContent = textoOriginal;
        btnEnviar.disabled = false;
      });
    });
  }
})();