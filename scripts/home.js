(() => {
  const explorer = document.querySelector('[data-hero-state]');
  if (!explorer) return;
  const states = {
    create: ['Create', 'Turn expression into possibility.'],
    overcome: ['Overcome', 'Build resilience through practice.'],
    connect: ['Connect', "You shouldn't have to grow alone."],
  };
  const controls = [...explorer.querySelectorAll('[data-hero-choice]')];
  const select = (choice) => {
    if (explorer.dataset.heroState === choice) return;
    explorer.dataset.heroState = choice;
    explorer.querySelector('[data-hero-label]').textContent = states[choice][0];
    explorer.querySelector('[data-hero-copy]').textContent = states[choice][1];
    controls.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.heroChoice === choice)));
  };
  controls.forEach((button) => {
    button.addEventListener('click', () => select(button.dataset.heroChoice));
    button.addEventListener('focus', () => select(button.dataset.heroChoice));
    button.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') select(button.dataset.heroChoice);
    });
  });
  explorer.querySelector('.hero-controls').hidden = false;
})();
