const output = document.getElementById("output");
const input = document.getElementById("command-input");
const graphicOverlay = document.getElementById("graphic-overlay");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementsByClassName("close")[0];
const skillsChart = document.getElementById("skills-chart");

let currentLanguage = "es";
let commandHistory = [];
let historyIndex = -1;

const translations = {
  es: {
    help: "Comandos disponibles: about, skills, projects, contact, clear, theme, translate, generate-cv",
    about: {
      title: "Sobre Mí",
      content:
        "Soy un desarrollador front-end y diseñador gráfico apasionado por crear experiencias web únicas. Con una sólida formación en diseño y programación, combino lo mejor de ambos mundos para crear interfaces atractivas y funcionales.",
    },
    skills: {
      title: "Mis Habilidades",
      content: `
        <ul>
          <li>HTML5, CSS3, JavaScript (ES6+)</li>
          <li>React, Vue.js</li>
          <li>Diseño Responsivo</li>
          <li>Adobe Creative Suite (Photoshop, Illustrator, XD)</li>
          <li>UI/UX Design</li>
          <li>Git, GitHub</li>
        </ul>
      `,
    },
    projects: {
      title: "Mis Proyectos",
      content: `
        <ul>
          <li>E-commerce Platform: Desarrollé una plataforma de comercio electrónico completa utilizando React y Node.js.</li>
          <li>Portfolio Interactivo: Este mismo portafolio que estás viendo ahora.</li>
          <li>App de Gestión de Tareas: Una aplicación web para gestionar tareas y proyectos, construida con Vue.js.</li>
          <li>Rediseño de Marca: Proyecto de diseño gráfico para una startup local, incluyendo logo, papelería y guía de estilo.</li>
        </ul>
      `,
    },
    contact: {
      title: "Contacto",
      content: `
        <p>Email: tu.email@example.com</p>
        <p>LinkedIn: linkedin.com/in/tu-perfil</p>
        <p>GitHub: github.com/tu-usuario</p>
        <p>Behance: behance.net/tu-portfolio</p>
      `,
    },
    themeChanged: "Tema cambiado a",
    languageChanged: "Idioma cambiado a Español",
    cvGenerated: "CV generado y descargado como PDF",
    commandNotRecognized:
      'Comando no reconocido. Escribe "help" para ver los comandos disponibles.',
    selectTheme: "Selecciona un tema:",
    themeOptionsShown:
      "Opciones de tema mostradas. Haz clic en un tema para cambiarlo.",
  },
  en: {
    help: "Available commands: about, skills, projects, contact, clear, theme, translate, generate-cv",
    about: {
      title: "About Me",
      content:
        "I am a front-end developer and graphic designer passionate about creating unique web experiences. With a strong background in design and programming, I combine the best of both worlds to create attractive and functional interfaces.",
    },
    skills: {
      title: "My Skills",
      content: `
        <ul>
          <li>HTML5, CSS3, JavaScript (ES6+)</li>
          <li>React, Vue.js</li>
          <li>Responsive Design</li>
          <li>Adobe Creative Suite (Photoshop, Illustrator, XD)</li>
          <li>UI/UX Design</li>
          <li>Git, GitHub</li>
        </ul>
      `,
    },
    projects: {
      title: "My Projects",
      content: `
        <ul>
          <li>E-commerce Platform: Developed a complete e-commerce platform using React and Node.js.</li>
          <li>Interactive Portfolio: This very portfolio you're viewing now.</li>
          <li>Task Management App: A web application for managing tasks and projects, built with Vue.js.</li>
          <li>Brand Redesign: Graphic design project for a local startup, including logo, stationery, and style guide.</li>
        </ul>
      `,
    },
    contact: {
      title: "Contact",
      content: `
        <p>Email: your.email@example.com</p>
        <p>LinkedIn: linkedin.com/in/your-profile</p>
        <p>GitHub: github.com/your-username</p>
        <p>Behance: behance.net/your-portfolio</p>
      `,
    },
    themeChanged: "Theme changed to",
    languageChanged: "Language changed to English",
    cvGenerated: "CV generated and downloaded as PDF",
    commandNotRecognized:
      'Command not recognized. Type "help" to see available commands.',
    selectTheme: "Select a theme:",
    themeOptionsShown: "Theme options shown. Click on a theme to change it.",
  },
};

const commands = {
  help: () => translations[currentLanguage].help,
  about: () =>
    showModal(
      translations[currentLanguage].about.title,
      translations[currentLanguage].about.content
    ),
  skills: () => {
    showModal(
      translations[currentLanguage].skills.title,
      translations[currentLanguage].skills.content
    );
    showSkillsChart();
  },
  projects: () =>
    showModal(
      translations[currentLanguage].projects.title,
      translations[currentLanguage].projects.content
    ),
  contact: () =>
    showModal(
      translations[currentLanguage].contact.title,
      translations[currentLanguage].contact.content
    ),
  clear: () => (output.innerHTML = ""),
  theme: () => showThemeOptions(),
  translate: (args) => changeLanguage(args[0]),
  "generate-cv": () => generateCV(),
};

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const fullCommand = input.value.trim();
    const [command, ...args] = fullCommand.split(" ");
    input.value = "";

    // Agregar la línea de comando con los colores y estilos correctos
    output.innerHTML += `
      <div>
        <span class="prompt">
          <span class="prompt-line1">
            <span class="prompt-symbol" style="color: #00e1ff;">┌──(</span>
            <span class="username" style="color: #00ff00;">root💀folio</span>
            <span class="prompt-symbol" style="color: #00e1ff;">)-[~]</span>
          </span>
          <span class="prompt-line2">
            <span class="prompt-symbol" style="color: #00e1ff;">└─#</span>
          </span> ${fullCommand}
        </span>
      </div>`;

    // Verificar y ejecutar el comando ingresado
    if (commands[command]) {
      const result = commands[command](args);
      if (result) output.innerHTML += `<div>${result}</div>`;
      createFloatingIcon(command);
    } else {
      output.innerHTML += `<div>${translations[currentLanguage].commandNotRecognized}</div>`;
    }

    // Asegurar que la ventana de salida haga scroll hacia abajo al agregar nuevo contenido
    output.scrollTop = output.scrollHeight;
    commandHistory.push(fullCommand);
    historyIndex = commandHistory.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      input.value = commandHistory[historyIndex];
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      input.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      input.value = "";
    }
  }
});

function createFloatingIcon(command) {
  const icon = document.createElement("div");
  icon.className = "floating-icon";
  icon.style.left = `${Math.random() * 100}%`;
  icon.style.top = `${Math.random() * 100}%`;

  switch (command) {
    case "about":
      icon.innerHTML = "👤";
      break;
    case "skills":
      icon.innerHTML = "💻";
      break;
    case "projects":
      icon.innerHTML = "🚀";
      break;
    case "contact":
      icon.innerHTML = "📧";
      break;
  }

  graphicOverlay.appendChild(icon);
  setTimeout(() => {
    icon.remove();
  }, 3000);
}

function showModal(title, content) {
  modalTitle.textContent = title;
  modalBody.innerHTML = content;
  modal.style.display = "block";

  // Add Esc key event to close the modal
  document.addEventListener("keydown", closeModalOnEsc);
}

function closeModalOnEsc(e) {
  if (e.key === "Escape") {
    closeModal();
  }
}

function closeModal() {
  modal.style.display = "none";
  skillsChart.style.display = "none";
  // Remove the Esc key event listener
  document.removeEventListener("keydown", closeModalOnEsc);
}

closeBtn.onclick = closeModal;

window.onclick = function (event) {
  if (event.target == modal || event.target == skillsChart) {
    closeModal();
  }
};

function showThemeOptions() {
  const themeOptions = ["cyberpunk", "retro", "neon"];
  const themeContent = `
    <p>${translations[currentLanguage].selectTheme}</p>
    <ul class="theme-options">
      ${themeOptions
        .map(
          (theme) =>
            `<li><button class="theme-button" onclick="changeTheme('${theme}')">${theme}</button></li>`
        )
        .join("")}
    </ul>
  `;
  showModal("Temas disponibles", themeContent);
  return translations[currentLanguage].themeOptionsShown;
}

function changeTheme(themeName) {
  document.body.className = `theme-${themeName}`;
  // Eliminamos la línea que cerraba el modal
  return `${translations[currentLanguage].themeChanged} ${themeName}`;
}

function showSkillsChart() {
  const ctx = skillsChart.getContext("2d");
  skillsChart.style.display = "block";

  // Destroy existing chart if there is one
  if (window.skillsChartInstance) {
    window.skillsChartInstance.destroy();
  }

  window.skillsChartInstance = new Chart(ctx, {
    type: "radar",
    data: {
      labels: [
        "HTML/CSS",
        "JavaScript",
        "React",
        "Vue.js",
        "UI/UX Design",
        "Responsive Design",
      ],
      datasets: [
        {
          label: "Skill Level",
          data: [90, 85, 80, 75, 85, 90],
          backgroundColor: "rgba(0, 255, 0, 0.2)",
          borderColor: "rgb(0, 255, 0)",
          pointBackgroundColor: "rgb(0, 255, 0)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(0, 255, 0)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          borderWidth: 3,
        },
      },
      scales: {
        r: {
          angleLines: {
            color: "rgba(255, 255, 255, 0.2)",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.2)",
          },
          pointLabels: {
            color: "white",
          },
          ticks: {
            color: "white",
            backdropColor: "transparent",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
    },
  });
}

function changeLanguage(lang) {
  if (lang === "es" || lang === "en") {
    currentLanguage = lang;
    return translations[currentLanguage].languageChanged;
  }
  return "Supported languages: es (Spanish), en (English)";
}

function generateCV() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("CV - [Tu Nombre]", 10, 20);

  doc.setFontSize(16);
  doc.text("About Me", 10, 40);
  doc.setFontSize(12);
  doc.text(translations[currentLanguage].about.content, 10, 50, {
    maxWidth: 180,
  });

  doc.setFontSize(16);
  doc.text("Skills", 10, 90);
  doc.setFontSize(12);
  doc.text(
    "HTML/CSS, JavaScript, React, Vue.js, UI/UX Design, Responsive Design",
    10,
    100,
    { maxWidth: 180 }
  );

  doc.setFontSize(16);
  doc.text("Contact", 10, 130);
  doc.setFontSize(12);
  doc.text(
    "Email: your.email@example.com\nLinkedIn: linkedin.com/in/your-profile\nGitHub: github.com/your-username",
    10,
    140
  );

  doc.save("cv.pdf");
  return translations[currentLanguage].cvGenerated;
}
