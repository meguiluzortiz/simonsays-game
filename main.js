const lightblue = document.getElementById('lightblue');
const violet = document.getElementById('violet');
const orange = document.getElementById('orange');
const green = document.getElementById('green');
const btnStart = document.getElementById('btnStart');
const lblLevel = document.getElementById('lblLevel');
const lblMaxLevel = document.getElementById('lblMaxLevel');
const LAST_LEVEL = 10;
let maxArchivedLevel = 1;

const colorNameMap = new Map();
colorNameMap.set(0, 'lightblue');
colorNameMap.set(1, 'violet');
colorNameMap.set(2, 'green');
colorNameMap.set(3, 'orange');

const invertedColorNameMap = new Map([...colorNameMap.entries()].map(([key, value]) => [value, key]));

class Game {
  constructor() {
    this.init = this.init.bind(this);
    this.init();
    setTimeout(this.nextLevel, 500);
  }

  init() {
    this.nextLevel = this.nextLevel.bind(this);
    this.selectColor = this.selectColor.bind(this); // Binds Game ref to fn
    this.toggleBtnStart();
    this.level = 1;
    this.updateLabels();

    this.colors = {
      lightblue,
      violet,
      orange,
      green,
    };
    this.sequence = new Array(LAST_LEVEL).fill(0).map((_) => Math.floor(Math.random() * 4));
  }

  toggleBtnStart() {
    if (btnStart.classList.contains('hide')) {
      btnStart.classList.remove('hide');
    } else {
      btnStart.classList.add('hide');
    }
  }

  updateLabels(){
    lblLevel.textContent = `Nivel: ${this.level}`;
    lblMaxLevel.textContent = `Máximo Nivel Logrado: ${maxArchivedLevel}`;
  }

  nextLevel() {
    this.subLevel = 0;
    this.highlightSequence();
    this.addClickEvents();
    this.updateMaxLevel();
    this.updateLabels();
  }

  highlightSequence() {
    for (let i = 0; i < this.level; i++) {
      const colorName = colorNameMap.get(this.sequence[i]);
      setTimeout(() => this.highlightColor(colorName), 1000 * i);
    }
  }

  highlightColor(colorName) {
    this.colors[colorName].classList.add('light');
    setTimeout(() => this.overshadowColor(colorName), 350);
  }

  overshadowColor(colorName) {
    this.colors[colorName].classList.remove('light');
  }

  addClickEvents() {
    Object.keys(this.colors).forEach((key) => {
      this.colors[key].addEventListener('click', this.selectColor);
    });
  }

  removeClickEvents() {
    Object.keys(this.colors).forEach((key) => {
      this.colors[key].removeEventListener('click', this.selectColor);
    });
  }

  selectColor(event) {
    const colorName = event.target.dataset.color;
    const colorNumber = invertedColorNameMap.get(colorName);
    this.highlightColor(colorName);

    if (colorNumber === this.sequence[this.subLevel]) {
      this.subLevel++;
      if (this.level === this.subLevel) {
        this.level++;
        this.removeClickEvents();
        if (this.level === LAST_LEVEL + 1) {
          this.win();
        } else {
          setTimeout(this.nextLevel, 1500);
        }
      }
    } else {
      this.loose();
    }
  }

  updateMaxLevel(){
    if(this.level > maxArchivedLevel){
      maxArchivedLevel = this.level;
    }
  }

  win() {
    swal('Simon Says:', 'Felicitaciones, ganaste el juego!', 'success').then(this.init);
  }

  loose() {
    swal('Simon Says:', 'Lo lamentamos, perdiste :(', 'error').then(() => {
      this.removeClickEvents();
      this.init();
    });
  }
}

function startToPlay() {
  window.game = new Game();
}
