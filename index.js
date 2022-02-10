const main = document.querySelector("main");

let exerciceArray = [];

const resetArray = [
  { pic: 0, min: 1 },
  { pic: 1, min: 1 },
  { pic: 2, min: 1 },
  { pic: 3, min: 1 },
  { pic: 4, min: 1 },
  { pic: 5, min: 1 },
  { pic: 6, min: 1 },
  { pic: 7, min: 1 },
  { pic: 8, min: 1 },
  { pic: 9, min: 1 },
];

function isStored() {
  if (localStorage.exercices) {
    exerciceArray = JSON.parse(localStorage.exercices);
    views.lobby();
  } else {
    console.log("not");
    exerciceArray = resetArray;
    views.lobby();
  }
}

class Exo {
  constructor() {
    this.index = 0;
    this.minutes = exerciceArray[this.index].min;
    this.seconds = 0;
  }

  ringBell() {
    const ring = new Audio()
    ring.src = "ring.mp3"
    ring.play()
  }

  updateCountdown() {
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;

    setTimeout(() => {
      if (this.minutes == 0 && this.seconds == "00") {
        this.index++;
        if (this.index < exerciceArray.length) {
          this.minutes = exerciceArray[this.index].min;
          this.seconds = 0;
          this.updateCountdown();
          
        } else {
          return views.finish()
        }
      } else if (this.seconds === "00") {
        this.minutes--;
        this.seconds = 59;
        this.updateCountdown();
      } else {
        this.seconds--;
        this.updateCountdown();
      }
      if (parseInt(this.seconds) < 3) {
        this.ringBell()
      }
    }, 1000);

    return (main.innerHTML = `
      <div class="exercice-container">
        <p>${this.minutes}:${this.seconds}</p>
        <img src="img/${exerciceArray[this.index].pic}.png" />
        <div>${this.index + 1} / ${exerciceArray.length}</div>
      </div>
    `);
  }
}

const utils = {
  pageContent: function (title, content, btn) {
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },

  handleEventMinutes: function () {
    document.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.id) {
            exo.min = parseInt(e.target.value);
            this.saveLocal();
          }
        });
      });
    });
  },

  handleEventArrow: function () {
    document.querySelectorAll(".arrow").forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        let position = 0;
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.dataset.pic && position != 0) {
            [exerciceArray[position], exerciceArray[position - 1]] = [
              exerciceArray[position - 1],
              exerciceArray[position],
            ];
            views.lobby();
            this.saveLocal();
          } else {
            position++;
          }
        });
      });
    });
  },

  deleteItem: function () {
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let newArr = [];
        exerciceArray.map((exo) => {
          if (exo.pic != e.target.dataset.pic) {
            newArr.push(exo);
          }
        });
        exerciceArray = newArr;
        views.lobby();
        this.saveLocal();
      });
    });
  },

  reboot: function () {
    exerciceArray = resetArray;
    views.lobby();
    this.saveLocal();
  },

  saveLocal: function () {
    localStorage.exercices = JSON.stringify(exerciceArray);
  },
};

const views = {
  lobby: function () {
    let mapArray = exerciceArray
      .map((exo) => {
        return `
          <li>
            <div class="card-header">
                <input type="number" id=${exo.pic} min="1" max="10" value=${exo.min}>
                <span>min</span>
            </div>
            <img src="./img/${exo.pic}.png">
            <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${exo.pic}></i>
            <i class="fas fa-times-circle deleteBtn" data-pic=${exo.pic}></i>
          </li>
        `;
      })
      .join("");

    utils.pageContent(
      "Paramétrage <i id='reboot' class='fas fa-undo'></i>",
      `<ul>${mapArray}</ul>`,
      "<button id='start'>Commencer<i class='far fa-play-circle'></i></button>"
    );
    utils.handleEventMinutes();
    utils.handleEventArrow();
    utils.deleteItem();
    reboot.addEventListener("click", () => {
      utils.reboot();
    });
    start.addEventListener("click", () => this.routine());
  },

  routine: function () {
    const exercice = new Exo();
    utils.pageContent("Routine", exercice.updateCountdown(), null);
  },

  finish: function () {
    utils.pageContent(
      "C'est terminé !",
      "<button id='start'>Recommencer</button>",
      "<button id='reboot' class='btn-reboot'>Menu <i class='fas fa-times-circle></i></button>"
    );
    start.addEventListener("click", () => this.routine());
    reboot.addEventListener('click', () => {
      return this.lobby()
    })
  },
};

isStored();
