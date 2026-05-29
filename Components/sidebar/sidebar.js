function bindSidebarEvents(sidebarElement, logoutRedirect) {
  const sidebarLinks = sidebarElement.querySelectorAll(
    ".sidebar__link:not([data-logout])",
  );
  const logoutLink = sidebarElement.querySelector("[data-logout='true']");

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebarLinks.forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");
    });
  });

  if (logoutLink) {
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();

      const shouldLogout = window.confirm("Deseja realmente sair?");

      if (shouldLogout) {
        window.location.href = "../../pages/login/index.html";
      }
    });
  }
}

class AppSidebar extends HTMLElement {
  connectedCallback() {
    const rootPrefix = this.getAttribute("root-prefix") || "../../";
    const current = this.getAttribute("current") || "";
    const links = [
      {
        key: "dashboard",
        label: "Dashboard",
        href: `${rootPrefix}pages/dashboard/index.html`,
      },
      {
        key: "audiencias",
        label: "Audiencias",
        href: `${rootPrefix}pages/audiencias/index.html`,
      },
      {
        key: "processos",
        label: "Processos",
        href: `${rootPrefix}pages/processos/index.html`,
      },

      {
        key: "documentos",
        label: "Documentos",
        href: `${rootPrefix}pages/documentos/index.html`,
      },
      {
        key: "configuracoes",
        label: "Configuracoes",
        href: `${rootPrefix}pages/configuracoes/index.html`,
      },
    ];

    this.innerHTML = `
      <aside class="sidebar" aria-label="Menu lateral principal">
        <div class="sidebar__logo">
          <span class="sidebar__logo-badge" aria-hidden="true">UB</span>
          <div class="sidebar__logo-text">
            <strong>Project Adv</strong>
            <small>Painel</small>
          </div>
        </div>

        <nav class="sidebar__nav" aria-label="Navegacao">
          ${links
            .map(
              (link) =>
                `<a class="sidebar__link ${current === link.key ? "is-active" : ""}" href="${link.href}">${link.label}</a>`,
            )
            .join("")}
        </nav>

        <a class="sidebar__link sidebar__logout" href="#" data-logout="true">Sair</a>
      </aside>
    `;

    const sidebar = this.querySelector(".sidebar");
    bindSidebarEvents(sidebar, `${rootPrefix}index.html`);
  }
}

if (!customElements.get("app-sidebar")) {
  customElements.define("app-sidebar", AppSidebar);
}

document.querySelectorAll(".sidebar").forEach((sidebar) => {
  if (!sidebar.closest("app-sidebar")) {
    bindSidebarEvents(sidebar, "../../index.html");
  }
});
