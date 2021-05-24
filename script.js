const celeste = document.getElementById("celeste"); //1
const violeta = document.getElementById("violeta"); //2
const naranja = document.getElementById("naranja"); //3
const verde = document.getElementById("verde"); //4
const btnEmpezar = document.getElementById("btnEmpezar");
const detailLevel = document.getElementById("level");
const detailSpeed = document.getElementById("speed");
const detailCountdown = document.getElementById("countdown");
const lastLevel = 10;
var click = zounds.load("./Click.wav");
var timer;
class Juego {
  constructor() {
    this.initialize = this.initialize.bind(this);
    this.initialize();
    this.createSequency();
    setTimeout(this.nextLevel, 500);
  }

  initialize() {
    this.nextLevel = this.nextLevel.bind(this);
    this.counterTime = this.counterTime.bind(this);
    // this.illuminateSequency = this.illuminateSequency.bind(this);
    // this.illuminateColor = this.illuminateColor.bind(this);
    this.getColorClicked = this.getColorClicked.bind(this);
    this.toggleButton();
    this.speed = 1;
    this.level = 1;
    this.counter = 15;
    this.colors = {
      celeste,
      verde,
      violeta,
      naranja
    };
    this.updateDetails()
  }

  updateDetails() {
    detailLevel.innerText = this.level;
    detailSpeed.innerText = this.speed;
    detailCountdown.innerText = this.counter;
  }

  toggleButton() {
    if (btnEmpezar.classList.contains("hide")) {
      btnEmpezar.classList.remove("hide");
    } else {
      btnEmpezar.classList.add("hide");
    }
  }

  createSequency() {
    this.secuencia = new Array(lastLevel)
      .fill(0)
      .map(() => Math.floor(Math.random() * 4));

    console.log(this.secuencia);
  }

  getElementByNumber(code) {
    switch (code) {
      case 0:
        return celeste;
      case 1:
        return violeta;
      case 2:
        return naranja;
      case 3:
        return verde;
      default:
        break;
    }
  }

  getElementByColor(color) {
    switch (color) {
      case "celeste":
        return 0;
      case "violeta":
        return 1;
      case "naranja":
        return 2;
      case "verde":
        return 3;
      default:
        break;
    }
  }

  illuminateColor(id) {
    let element = this.getElementByNumber(id);
    element.classList.add("light");
    click.play();

    setTimeout(() => {
      element.classList.remove("light");
    }, 100);
  }

  illuminateSequency() {
    for (let i = 0; i < this.level; i++) {
      setTimeout(() => this.illuminateColor(this.secuencia[i]), 1000 * i);
    }
  }

  nextLevel() {
    this.counterTime();
    this.subLevel = 0;
    this.counter = 15;
    this.illuminateSequency();
    this.addEvents();
    this.updateDetails();
  }

  addEvents() {
    for (const key in this.colors) {
      const element = this.colors[key];
      element.addEventListener("click", this.getColorClicked);
    }
  }

  removeEvents() {
    for (const key in this.colors) {
      const element = this.colors[key];
      element.removeEventListener("click", this.getColorClicked);
    }
  }

  counterTime() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.counter--;
      if (this.counter == 0) {
        clearInterval(this.timer);
        this.gameLost();
      } else {
        detailCountdown.innerText = this.counter;
      }
    }, 1000);
  }

  getColorClicked(ev) {
    const colorClicked = ev.target.dataset.color;
    const colorNumber = this.getElementByColor(colorClicked);
    this.illuminateColor(colorNumber);

    if (colorNumber === this.secuencia[this.subLevel]) {      
      this.subLevel++;

      if (this.subLevel === this.level) {
        this.level++;
        this.removeEvents();
        if (this.level === lastLevel + 1) {
          this.gameWon();
        } else {
          setTimeout(this.nextLevel, 1000);
        }
      }
    } else {
      clearInterval(this.timer);
      this.gameLost();
    }
  }

  gameWon() {
    swal("Yeahhh!", "Felicitaciones, ganaste el juego!", "success").then(() => {
      this.initialize;
    });
  }

  gameLost() {
    swal("Oh No!", "Lo lamentamos, perdiste :(", "error").then(() => {
      this.removeEvents();      
      this.initialize();
    });
  }
}

function empezarJuego() {
  window.juego = new Juego();
}
