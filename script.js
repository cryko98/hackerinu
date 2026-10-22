(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- matrix rain ---------- */
  const canvas = document.getElementById("matrix");
  const ctx = canvas.getContext("2d");
  const glyphs = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789$CATMEOW<>=:";
  const fontSize = 18;
  let columns = 0;
  let drops = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    columns = Math.ceil(window.innerWidth / fontSize);
    drops = Array.from({ length: columns }, () => Math.random() * -60);
  }

  function draw() {
    ctx.fillStyle = "rgba(2, 7, 3, 0.09)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.font = `${fontSize}px monospace`;
    for (let i = 0; i < columns; i++) {
      const ch = glyphs[(Math.random() * glyphs.length) | 0];
      const y = drops[i] * fontSize;
      ctx.fillStyle = Math.random() > 0.975 ? "#d9ffe3" : "#39ff6e";
      ctx.fillText(ch, i * fontSize, y);
      if (y > window.innerHeight && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.55;
    }
  }

  resize();
  window.addEventListener("resize", resize);
  if (reduceMotion) {
    for (let i = 0; i < 80; i++) draw();
  } else {
    let last = 0;
    (function loop(t) {
      if (t - last > 45) { draw(); last = t; }
      requestAnimationFrame(loop);
    })(0);
  }

  /* ---------- boot line typing ---------- */
  const bootEl = document.getElementById("boot");
  const bootLines = [
    "> connecting to mainframe...",
    "> bypassing firewall...",
    "> ACCESS GRANTED. welcome, hacker.",
  ];
  function typeBoot(lineIdx = 0, charIdx = 0) {
    const line = bootLines[lineIdx];
    bootEl.textContent = line.slice(0, charIdx);
    if (charIdx < line.length) {
      setTimeout(() => typeBoot(lineIdx, charIdx + 1), 38);
    } else if (lineIdx < bootLines.length - 1) {
      setTimeout(() => typeBoot(lineIdx + 1, 0), 700);
    }
  }
  if (reduceMotion) bootEl.textContent = bootLines[bootLines.length - 1];
  else typeBoot();

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- copy CA ---------- */
  document.querySelectorAll(".ca-copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = "Copied!";
      } catch {
        btn.textContent = "Select & copy";
      }
      btn.classList.add("copied");
      setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1600);
    });
  });

  /* ---------- interactive terminal ---------- */
  const body = document.getElementById("termBody");
  const form = document.getElementById("termForm");
  const input = document.getElementById("termIn");
  const history = [];
  let histIdx = 0;

  function print(text, cls = "out") {
    const div = document.createElement("div");
    div.className = cls;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function printSlow(lines, cls = "out", delay = 220) {
    input.disabled = true;
    lines.forEach((l, i) => setTimeout(() => {
      print(l, cls);
      if (i === lines.length - 1) { input.disabled = false; input.focus({ preventScroll: true }); }
    }, i * delay));
  }

  const commands = {
    help: () => print(
      "available commands:\n" +
      "  whoami     who is cyber cat\n" +
      "  lore       the short version of the story\n" +
      "  hack       run a hack (try: hack moon)\n" +
      "  buy        how to get $cybercat\n" +
      "  ticker     print the ticker\n" +
      "  ca         print the contract address\n" +
      "  meow       ...\n" +
      "  lives      check remaining lives\n" +
      "  sudo       elevated privileges\n" +
      "  clear      clear the screen"
    ),
    whoami: () => print("guest. but the cat in the hoodie? that's Cyber Cat.\nslept on the warmest server rack, learned every port,\nnow hacking the only thing that matters: the charts."),
    lore: () => print("everything gets hacked these days. banks. bridges. your aunt's facebook.\ncats have been walking on keyboards for decades. it was never random.\none orange tabby pulled up his hood and stopped pretending.\nhe never touches your wallet. he just knocks red candles off the table.\nhis payload landed on pump.fun. it's called $cybercat."),
    ticker: () => print("$cybercat", "hl"),
    ca: () => print("HfWDdM3mLB8Qjw9jTRKV7sYBmu5FdX3LrQWa2d9rpump", "hl"),
    meow: () => print("MEOW. (translation: buy the dip)", "hl"),
    purr: () => print("purrrrrrrr... (the charts are looking green)", "hl"),
    lives: () => print("lives remaining: 9/9\nexploits used: 0\ncuriosity: maxed out", "hl"),
    buy: () => print("1. get Phantom or Solflare\n2. load it with SOL\n3. open pump.fun and paste the CA (type 'ca')\n4. hit buy. welcome to the clowder."),
    sudo: (args) => {
      if (args.join(" ") === "rm -rf fud") return printSlow(["[sudo] password for guest: ********", "knocking /fud off the table ... done", "FUD successfully deleted. purr."], "hl");
      print("guest is not in the sudoers file. this incident will be reported to the cat.\n(hint: sudo rm -rf fud)", "err");
    },
    hack: (args) => {
      const target = (args.join(" ") || "the planet").toLowerCase();
      if (/wallet|seed|bank|grandma/.test(target)) {
        return print(`refusing to hack "${target}". a cat has standards.`, "err");
      }
      printSlow([
        `> target locked: ${target}`,
        "> spoofing MAC address... done",
        "> injecting meow.dll... done",
        "> escalating privileges... [##########] 100%",
        `ACCESS GRANTED. ${target} has been hacked by $cybercat.`,
      ]);
    },
    clear: () => { body.innerHTML = ""; },
    ls: () => print("bear_market.pwned  fud_firewall.pwned  paper_hands.pwned  dog_coins.queued  hoodie.cfg  laser_pointer.exe"),
    exit: () => print("there is no exit. you're in the clowder now.", "hl"),
  };

  function run(raw) {
    const line = raw.trim();
    print(`guest@cybercat:~$ ${line}`, "in");
    if (!line) return;
    const [cmd, ...args] = line.split(/\s+/);
    const fn = commands[cmd.toLowerCase()];
    if (fn) fn(args);
    else print(`command not found: ${cmd}. type 'help'.`, "err");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value;
    if (val.trim()) { history.push(val); histIdx = history.length; }
    input.value = "";
    run(val);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && histIdx > 0) {
      histIdx--; input.value = history[histIdx]; e.preventDefault();
    } else if (e.key === "ArrowDown") {
      histIdx = Math.min(histIdx + 1, history.length);
      input.value = history[histIdx] || ""; e.preventDefault();
    }
  });

  document.getElementById("term").addEventListener("click", () => input.focus({ preventScroll: true }));

  print("Cyber Cat OS v9.0 (pump.fun kernel)", "hl");
  print("connection established. type 'help' to see what the cat can do.");
})();
