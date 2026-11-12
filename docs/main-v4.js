(() => {
  'use strict';

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // The intro is decorative and never blocks the portfolio for long.
  const boot = document.querySelector('#boot');
  const bootSkip = document.querySelector('#boot-skip');
  const bootProgress = document.querySelector('#boot-progress');
  const bootPercent = document.querySelector('#boot-percent');
  const bootCommand = document.querySelector('#boot-command');
  let bootFinished = false;
  const finishBoot = () => {
    if (!boot || bootFinished) return;
    bootFinished = true;
    boot.classList.add('is-done');
    boot.setAttribute('aria-hidden', 'true');
    bootSkip?.blur();
    window.setTimeout(() => { boot.hidden = true; }, 500);
  };
  if (boot) {
    bootSkip?.addEventListener('click', finishBoot);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishBoot();
    } else {
      const steps = [
        { delay: 80, percent: 23, command: 'loading profile modules_' },
        { delay: 400, percent: 58, command: 'mapping research archive_' },
        { delay: 750, percent: 88, command: 'verifying visual interface_' },
        { delay: 1020, percent: 100, command: 'portfolio online_' }
      ];
      for (const step of steps) {
        window.setTimeout(() => {
          if (bootFinished) return;
          bootProgress.style.width = `${step.percent}%`;
          bootPercent.textContent = `${step.percent}%`;
          bootCommand.textContent = step.command;
        }, step.delay);
      }
      window.setTimeout(finishBoot, 1250);
    }
  }

  const menuToggle = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#primary-nav');
  if (menuToggle && nav) document.documentElement.classList.add('menu-ready');
  const closeMenu = () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
  };
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const scene = document.querySelector('.scene');
  const xReadout = document.querySelector('#readout-x');
  const yReadout = document.querySelector('#readout-y');
  if (scene && xReadout && yReadout) {
    let angleX = 0;
    let angleY = 0;
    const paint = () => {
      scene.style.setProperty('--rx', `${angleX.toFixed(1)}deg`);
      scene.style.setProperty('--ry', `${angleY.toFixed(1)}deg`);
      xReadout.textContent = String(Math.abs(Math.round(angleX))).padStart(2, '0');
      yReadout.textContent = String(Math.abs(Math.round(angleY))).padStart(2, '0');
    };
    scene.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const rect = scene.getBoundingClientRect();
      angleX = Math.max(-18, Math.min(18, (0.5 - (event.clientY - rect.top) / rect.height) * 36));
      angleY = Math.max(-22, Math.min(22, ((event.clientX - rect.left) / rect.width - 0.5) * 44));
      paint();
    });
    scene.addEventListener('pointerleave', () => { angleX = 0; angleY = 0; paint(); });
    scene.addEventListener('keydown', event => {
      const step = 4;
      if (event.key === 'ArrowUp') angleX = Math.min(18, angleX + step);
      else if (event.key === 'ArrowDown') angleX = Math.max(-18, angleX - step);
      else if (event.key === 'ArrowLeft') angleY = Math.max(-22, angleY - step);
      else if (event.key === 'ArrowRight') angleY = Math.min(22, angleY + step);
      else return;
      event.preventDefault();
      paint();
    });
    paint();
  }

  const consoleForm = document.querySelector('#console-form');
  const consoleInput = document.querySelector('#console-input');
  const consoleOutput = document.querySelector('#console-output');
  const responses = {
    help: 'COMMANDS\n  whoami    Identity and focus\n  skills    Security and engineering stack\n  projects  Selected public repositories\n  certs     Credentials and recognition\n  contact   Ways to connect\n  clear     Clear this terminal',
    whoami: 'Naveen Upadhyay // Greyhat127\nCompTIA PenTest+ certified security analyst, penetration tester, digital forensics researcher and educator.\nIndia · B.Tech (Hons.) CSE, Cyber Security & Blockchain, LPU.',
    skills: 'OFFENSIVE  Web application testing · OWASP Top 10 · Bug bounty\nFORENSICS  Incident analysis · SIEM · EDR · Wireshark\nBLOCKCHAIN Smart contracts · Solidity · DeFi oracle research\nBUILD      Python · JavaScript · Django · Flask · Linux',
    projects: '01  Lido V3 oracle research\n02  CTF Flag Search\n03  PANNA local AI assistant\n04  Event Registration smart contract\n05  Corrugated Box Cost & Profit Calculator\nOpen the WORK section for repository links.',
    certs: 'CompTIA PenTest+ (PT0-003), active Sep 2026–Sep 2029\nQuick Heal Certified Digital Forensics Investigator\nGoogle Foundations of Cybersecurity\nBugcrowd Hall of Fame · Cisco CTF 3rd place',
    contact: 'EMAIL    naveenupadhyay8070@gmail.com\nGITHUB   github.com/Naveen-GreyHat\nLINKEDIN linkedin.com/in/greyhat127'
  };
  const appendLine = (value, className = '') => {
    if (!consoleOutput) return;
    const line = document.createElement('p');
    line.textContent = value;
    if (className) line.className = className;
    consoleOutput.appendChild(line);
    while (consoleOutput.children.length > 32) consoleOutput.firstElementChild?.remove();
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  };
  const runCommand = raw => {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    if (command === 'clear') { if (consoleOutput) consoleOutput.textContent = ''; return; }
    appendLine(`naveen@greyhat127:~$ ${command}`, 'console-command');
    if (Object.prototype.hasOwnProperty.call(responses, command)) appendLine(responses[command], 'console-highlight');
    else appendLine(`Command not found: ${command}. Type help.`, 'console-error');
  };
  consoleForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!(consoleInput instanceof HTMLInputElement)) return;
    runCommand(consoleInput.value);
    consoleInput.value = '';
    consoleInput.focus();
  });
  document.querySelectorAll('.command-list button').forEach(chip => {
    chip.addEventListener('click', () => {
      runCommand(chip.textContent || '');
      consoleInput?.focus();
    });
  });
})();
