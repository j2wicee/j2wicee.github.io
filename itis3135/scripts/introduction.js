const DEFAULT_COURSES = [
  {
    dept: "ITIS",
    num: "3135",
    name: "Front-End Web Application Development",
    reason:
      "Wanted to get a more formal learning experience for frontend development.",
  },
  {
    dept: "ITSC",
    num: "3688",
    name: "Computers and Their Impact on Society",
    reason: "Required for my major.",
  },
  {
    dept: "ITSC",
    num: "2181",
    name: "Introduction to Computer Systems",
    reason:
      "I feel like it could be interesting, and it gives me another language to add to my resume.",
  },
  {
    dept: "HIST",
    num: "1575",
    name: "American Democracy's Past and Promise",
    reason: "This class is required; I would not be in it otherwise.",
  },
];
function addCourseEntry(data = {}) {
  const container = document.getElementById("courses-container");
  const index = container.children.length + 1;

  const div = document.createElement("div");
  div.classList.add("course-entry");

  div.innerHTML = `
    <strong>Course ${index}</strong>
    <label>Department <span style="color:red">*</span>
      <input type="text" class="course-dept" value="${data.dept || ""}"
             placeholder="e.g. ITIS" required />
    </label>
    <label>Number <span style="color:red">*</span>
      <input type="text" class="course-num" value="${data.num || ""}"
             placeholder="e.g. 3135" required />
    </label>
    <label>Course Name <span style="color:red">*</span>
      <input type="text" class="course-name" value="${data.name || ""}"
             placeholder="e.g. Front-End Web App Dev" required />
    </label>
    <label>Reason Taking <span style="color:red">*</span>
      <input type="text" class="course-reason" value="${data.reason || ""}"
             placeholder="Why are you taking this course?" required />
    </label>
    <button type="button" class="delete-course-btn">Delete Course</button>
  `;

  div.querySelector(".delete-course-btn").addEventListener("click", () => {
    div.remove();
    renumberCourses();
  });

  container.appendChild(div);
}

function renumberCourses() {
  const entries = document.querySelectorAll(".course-entry");
  entries.forEach((entry, i) => {
    entry.querySelector("strong").textContent = `Course ${i + 1}`;
  });
}

function collectCourses() {
  const entries = document.querySelectorAll(".course-entry");
  return Array.from(entries).map((entry) => ({
    dept: entry.querySelector(".course-dept").value.trim(),
    num: entry.querySelector(".course-num").value.trim(),
    name: entry.querySelector(".course-name").value.trim(),
    reason: entry.querySelector(".course-reason").value.trim(),
  }));
}

document.getElementById("picture-file").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById("picture-src").value = e.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById("clear-btn").addEventListener("click", () => {
  // Clear all text/date/url inputs
  document
    .querySelectorAll(
      "form input[type='text'], form input[type='date'], form input[type='url']",
    )
    .forEach((input) => (input.value = ""));

  // Clear textareas
  document.querySelectorAll("form textarea").forEach((ta) => (ta.value = ""));

  // Clear file input
  document.getElementById("picture-file").value = "";

  // Reset hidden src to empty (no default image when cleared)
  document.getElementById("picture-src").value = "";

  // Clear courses
  document.getElementById("courses-container").innerHTML = "";
});

document.getElementById("intro-form").addEventListener("reset", () => {
  // Small delay so the native reset fires first
  setTimeout(() => {
    // Restore default image src
    document.getElementById("picture-src").value =
      "itis3135/images/headshot.PNG";

    // Re-seed courses
    document.getElementById("courses-container").innerHTML = "";
    DEFAULT_COURSES.forEach((c) => addCourseEntry(c));
  }, 0);
});

// ── Add Course button ─────────────────────────────────────────

document.getElementById("add-course-btn").addEventListener("click", () => {
  addCourseEntry();
});

// ── Prevent default form submission ──────────────────────────

const formElement = document.getElementById("intro-form");
formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  renderResult();
});

// ── Render result (replaces form with intro page) ─────────────

function renderResult() {
  // ── Collect values ──
  const firstName = document.getElementById("first-name").value.trim();
  const middleName = document.getElementById("middle-name").value.trim();
  const nickname = document.getElementById("nickname").value.trim();
  const lastName = document.getElementById("last-name").value.trim();

  const mascotAdj = document.getElementById("mascot-adj").value.trim();
  const mascotAnimal = document.getElementById("mascot-animal").value.trim();
  const divider = document.getElementById("divider").value.trim();

  const pictureSrc = document.getElementById("picture-src").value;
  const caption = document.getElementById("picture-caption").value.trim();

  const statement = document.getElementById("personal-statement").value.trim();
  const personalBg = document.getElementById("personal-bg").value.trim();
  const profBg = document.getElementById("professional-bg").value.trim();
  const acadBg = document.getElementById("academic-bg").value.trim();
  const subjectBg = document.getElementById("subject-bg").value.trim();
  const primaryComp = document.getElementById("primary-computer").value.trim();
  const secondComp = document.getElementById("secondary-computer").value.trim();

  const courses = collectCourses();

  const quote = document.getElementById("quote").value.trim();
  const quoteAuthor = document.getElementById("quote-author").value.trim();

  const funnyThing = document.getElementById("funny-thing").value.trim();
  const shareThing = document.getElementById("share-thing").value.trim();

  const links = [1, 2, 3, 4, 5].map((n) => ({
    name: document.getElementById(`link${n}-name`).value.trim(),
    href: document.getElementById(`link${n}-url`).value.trim(),
  }));

  // ── Build heading (matches original h3 style: "First [M.] "Nick" Last ~ Adj Animal") ──
  let fullName = firstName;
  if (middleName) fullName += ` ${middleName}.`;
  if (nickname) fullName += ` "${nickname}"`;
  fullName += ` ${lastName}`;

  document.getElementById("result-heading").textContent =
    `${fullName} ${divider} ${mascotAdj} ${mascotAnimal}`;

  // ── Image ──
  const imgEl = document.getElementById("result-img");
  imgEl.src = pictureSrc || "itis3135/images/headshot.PNG";
  imgEl.alt = `Photo of ${firstName} ${lastName}`;

  document.getElementById("result-caption").textContent = caption;

  // ── Personal statement ──
  document.getElementById("result-statement").innerHTML = statement.replace(
    /\n/g,
    "<br />",
  );

  // ── Bullets ──
  const bulletsUl = document.getElementById("result-bullets");
  bulletsUl.innerHTML = "";

  const simpleBullets = [
    { label: "Personal Background", text: personalBg },
    { label: "Professional Background", text: profBg },
    { label: "Academic Background", text: acadBg },
    { label: "Background in this Subject", text: subjectBg },
    { label: "Primary Work Computer", text: primaryComp },
    { label: "Secondary Work Computer", text: secondComp },
  ];

  simpleBullets.forEach(({ label, text }) => {
    if (!text) return;
    const li = document.createElement("li");
    li.innerHTML = `<strong>${label}: </strong>${text.replace(/\n/g, "<br />")}`;
    bulletsUl.appendChild(li);
  });

  // Courses bullet
  if (courses.length > 0) {
    const courseLi = document.createElement("li");
    courseLi.innerHTML = `<strong>Courses I'm Taking &amp; Why:</strong>`;
    const ol = document.createElement("ol");
    courses.forEach(({ dept, num, name, reason }) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${dept} ${num} - ${name}: </strong>${reason}`;
      ol.appendChild(li);
    });
    courseLi.appendChild(ol);
    bulletsUl.appendChild(courseLi);
  }

  // Optional bullets
  if (funnyThing) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>Funny/Interesting item to remember me by: </strong>${funnyThing}`;
    bulletsUl.appendChild(li);
  }
  if (shareThing) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>I'd also like to share: </strong>${shareThing}`;
    bulletsUl.appendChild(li);
  }

  // ── Quote ──
  document.getElementById("result-quote").textContent = `"${quote}"`;
  document.getElementById("result-cite").textContent = `-${quoteAuthor}`;

  // ── Links ──
  const linksUl = document.getElementById("result-links");
  linksUl.innerHTML = "";
  links.forEach(({ name, href }) => {
    if (!name || !href) return;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = href;
    a.textContent = name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    li.appendChild(a);
    linksUl.appendChild(li);
  });

  // ── Swap form for result ──
  document.getElementById("intro-form").style.display = "none";
  document.querySelector("h3").style.display = "none";
  document.getElementById("result").style.display = "block";

  document.getElementById("page-heading").textContent = "Landing Page";
}

document.getElementById("reset-result-btn").addEventListener("click", () => {
  document.getElementById("result").style.display = "none";
  document.getElementById("intro-form").style.display = "";
  document.querySelector("h3").style.display = "";
  document.getElementById("page-heading").textContent = "Introduction Form";
});

DEFAULT_COURSES.forEach((c) => addCourseEntry(c));
