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
})();