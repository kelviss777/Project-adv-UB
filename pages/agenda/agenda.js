function abrirModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("active");
  }
}

function fecharModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("active");
  }
}

window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal-overlay")) {
    event.target.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl || typeof FullCalendar === "undefined") return;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "pt-br",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    buttonText: {
      today: "Hoje",
      month: "Mês",
      week: "Semana",
      day: "Dia",
    },
    height: 650,
    events: [
      {
        title: "Prazo: Contestação",
        start: "2026-05-08",
        backgroundColor: "#fee2e2",
        textColor: "#991b1b",
      },
      {
        title: "Audiência: Proc. 0023...",
        start: "2026-05-15",
        backgroundColor: "#e0e7ff",
        textColor: "#3730a3",
      },
      {
        title: "Prazo: Manifestação",
        start: "2026-05-14",
        backgroundColor: "#dcfce7",
        textColor: "#166534",
      },
      {
        title: "Prazo: Recurso",
        start: "2026-05-09",
        backgroundColor: "#fef3c7",
        textColor: "#92400e",
      },
    ],
  });

  calendar.render();
});
