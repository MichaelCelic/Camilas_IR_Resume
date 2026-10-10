const loader = document.getElementById("loader");
const loadFill = document.getElementById("load-fill");
const stage = document.getElementById("stage");
const frame = document.getElementById("frame");
const shot = document.getElementById("shot");
const hotspots = document.getElementById("hotspots");
const panel = document.getElementById("panel");
const panelTitle = document.getElementById("panel-title");
const panelBody = document.getElementById("panel-body");
const panelClose = document.getElementById("panel-close");

const SCREENS = {
  title: {
    src: "assets/title_screen.png",
    alt: "Campa's Scooperia title screen",
    hotspots: [
      { label: "Play", left: 35.58, top: 69.26, width: 28.4, height: 9.16, to: "character" },
    ],
  },
  character: {
    src: "assets/character_select.png",
    alt: "Choose your character",
    hotspots: [
      { label: "Back", left: 2.18, top: 6.09, width: 10.68, height: 5.85, to: "title" },
      { label: "Select Carlo Romano", left: 9.02, top: 80.16, width: 22.68, height: 5.29, to: "homepage" },
      { label: "Select Camila Campa", left: 38.54, top: 80.16, width: 22.73, height: 5.29, to: "homepage" },
      { label: "Select Koilee", left: 68.42, top: 80.16, width: 22.68, height: 5.29, to: "homepage" },
    ],
  },
  homepage: {
    src: "assets/homepage.png",
    alt: "Camila Campa homepage",
    hotspots: [
      {
        label: "Experience",
        left: 50.88,
        top: 11.87,
        width: 15.48,
        height: 4.63,
        action: "panel",
        panel: "experience",
      },
      {
        label: "Projects",
        left: 68.41,
        top: 11.87,
        width: 11.87,
        height: 4.63,
        action: "panel",
        panel: "projects",
      },
      {
        label: "Contact",
        left: 82.23,
        top: 11.87,
        width: 11.87,
        height: 4.63,
        action: "panel",
        panel: "contact",
      },
    ],
  },
};

const PANELS = {
  projects: {
    title: "Projects",
    blocks: [
      {
        heading: "Camsiedq LLC",
        meta: "Davie, FL · June 2025–Now",
        role: "Social Media Content Creator",
        items: [
          "Posting daily on multiple platforms (Instagram, TikTok, Snapchat, and YouTube)",
          "Twitch streaming 5 days a week",
          "Garnered over 220,000 followers across all platforms in 2 months",
        ],
      },
      {
        heading: "Transfers Helping Transfers",
        meta: "FSU Co-Leader · Aug 2024–Dec 2024",
        role: "Course: Information Technology Leadership",
        items: [
          "Supported CCI transfer students in getting acclimated to FSU",
          "Wrote and edited content for the CCI website, CCI blog, and CCI LinkedIn",
          "Created graphics and developed software",
          "Delivered 16 weekly deliverables",
        ],
      },
    ],
  },
  experience: {
    title: "Experience",
    blocks: [
      {
        heading: "Mike & Mike's Desserts",
        meta: "Remote · Oct 2024–Jan 2025",
        role: "Social Media Intern",
        items: [
          "Created and published weekly TikTok videos promoting products",
          "Managed the brand's TikTok account",
          "Engaged with followers and customers, responding to comments and messages",
          "Developed creative content ideas to highlight products and brand story",
        ],
      },
      {
        heading: "Parlour Vegan Bakery",
        meta: "Plantation, FL · Nov 2022–Aug 2023",
        role: "Front of House Member",
        items: [
          "Set up an assortment of about 250 baked goods on morning shifts",
          "Greeted customers, processed their orders, and operated the cash register",
          "Prepared a range of drinks, such as lattes and cortados, while ensuring customer needs were met",
          "Managed inventory, restocked supplies, and maintained a clean and organized environment",
        ],
      },
    ],
  },
  education: {
    title: "Education",
    blocks: [
      {
        heading: "Florida State University",
        meta: "Tallahassee, FL · May 2027",
        role: "Bachelor of Science in Information Technology",
        items: ["GPA: 3.8"],
      },
      {
        heading: "Awards",
        items: [
          "Dean's List every semester at FSU, Aug 2023–May 2026",
          "Florida Medallion Scholarship, May 2023",
        ],
      },
    ],
  },
  skills: {
    title: "Skills",
    blocks: [
      {
        heading: "Programming languages",
        items: ["MySQL, C++, and Java"],
      },
      {
        heading: "Platforms",
        items: ["Windows XP/Vista, Linux, and macOS"],
      },
      {
        heading: "Languages",
        items: ["Spanish (native) and English (native)"],
      },
    ],
  },
  contact: {
    title: "Contact",
    contact: {
      name: "Camila Campa",
      phone: "954-681-8066",
      email: "cic22g@fsu.edu",
      place: "Tallahassee",
      linkedin: "https://www.linkedin.com/in/camilacampa/",
    },
  },
};

const LOAD_BEATS = [
  [8, 180],
  [14, 420],
  [22, 160],
  [31, 700],
  [36, 260],
  [55, 200],
  [61, 650],
  [74, 180],
  [79, 480],
  [91, 220],
  [94, 520],
  [100, 280],
];

let transitioning = false;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function fit(width, height) {
  const scale = Math.min(window.innerWidth / width, window.innerHeight / height);
  frame.style.width = `${Math.round(width * scale)}px`;
  frame.style.height = `${Math.round(height * scale)}px`;
}

function placeHotspots(spots) {
  hotspots.replaceChildren();
  for (const spot of spots) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot";
    button.style.left = `${spot.left}%`;
    button.style.top = `${spot.top}%`;
    button.style.width = `${spot.width}%`;
    button.style.height = `${spot.height}%`;
    button.setAttribute("aria-label", spot.label);
    button.addEventListener("click", () => {
      if (spot.action === "panel") {
        openPanel(spot.panel);
        return;
      }
      transitionTo(spot.to);
    });
    hotspots.appendChild(button);
  }
}

function closePanel() {
  panel.hidden = true;
  panelBody.replaceChildren();
}

function openPanel(id) {
  const info = PANELS[id];
  panelTitle.textContent = info.title;
  panelBody.replaceChildren();

  if (info.contact) {
    const name = document.createElement("p");
    name.textContent = info.contact.name;
    const place = document.createElement("p");
    place.className = "meta";
    place.textContent = info.contact.place;
    const phone = document.createElement("p");
    const phoneLink = document.createElement("a");
    phoneLink.href = `tel:${info.contact.phone.replaceAll("-", "")}`;
    phoneLink.textContent = info.contact.phone;
    phone.append(phoneLink);
    const email = document.createElement("p");
    const emailLink = document.createElement("a");
    emailLink.href = `mailto:${info.contact.email}`;
    emailLink.textContent = info.contact.email;
    email.append(emailLink);
    const linkedin = document.createElement("p");
    const linkedinLink = document.createElement("a");
    linkedinLink.href = info.contact.linkedin;
    linkedinLink.target = "_blank";
    linkedinLink.rel = "noopener noreferrer";
    linkedinLink.textContent = info.contact.linkedin;
    linkedin.append(linkedinLink);
    panelBody.append(name, place, phone, email, linkedin);
  }

  for (const block of info.blocks || []) {
    const heading = document.createElement("h3");
    heading.textContent = block.heading;
    panelBody.append(heading);
    if (block.meta) {
      const meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = block.meta;
      panelBody.append(meta);
    }
    if (block.role) {
      const role = document.createElement("p");
      role.className = "role";
      role.textContent = block.role;
      panelBody.append(role);
    }
    if (block.items) {
      const list = document.createElement("ul");
      for (const item of block.items) {
        const li = document.createElement("li");
        li.textContent = item;
        list.append(li);
      }
      panelBody.append(list);
    }
  }

  panel.hidden = false;
}

function showImage(screen) {
  closePanel();
  shot.alt = screen.alt;
  placeHotspots(screen.hotspots);

  return new Promise((resolve, reject) => {
    shot.onload = () => {
      fit(shot.naturalWidth, shot.naturalHeight);
      resolve();
    };
    shot.onerror = () => reject(new Error(`Could not load ${screen.src}`));
    shot.src = screen.src;
    if (shot.complete && shot.naturalWidth) {
      shot.onload();
    }
  });
}

async function transitionTo(id) {
  if (transitioning) return;
  transitioning = true;
  frame.classList.remove("is-in");
  await sleep(480);

  try {
    await showImage(SCREENS[id]);
  } catch (error) {
    transitioning = false;
    frame.classList.add("is-in");
    return;
  }

  frame.classList.add("is-in");
  transitioning = false;
}

async function runLoader() {
  for (const [percent, hold] of LOAD_BEATS) {
    loadFill.style.width = `${percent}%`;
    await sleep(hold);
  }

  await sleep(220);
  loader.classList.add("is-out");
  await sleep(520);
  loader.hidden = true;
  stage.hidden = false;
  await showImage(SCREENS.title);
  frame.classList.add("is-in");
}

panelClose.addEventListener("click", closePanel);

panel.addEventListener("click", (event) => {
  if (event.target === panel) {
    closePanel();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePanel();
  }
});

window.addEventListener("resize", () => {
  if (shot.naturalWidth) {
    fit(shot.naturalWidth, shot.naturalHeight);
  }
});

runLoader();
