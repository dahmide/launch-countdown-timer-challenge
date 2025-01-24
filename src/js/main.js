const $day = document.querySelector("#launch__dd");
const $hrs = document.querySelector("#launch__hh");
const $min = document.querySelector("#launch__mm");
const $sec = document.querySelector("#launch__ss");

const UUID = 8463;
const PACE = 1000;
const UNIT = {
    SS: Math.pow(24, 0) * Math.pow(60, 0),
    MM: Math.pow(24, 0) * Math.pow(60, 1),
    HH: Math.pow(24, 0) * Math.pow(60, 2),
    DD: Math.pow(24, 1) * Math.pow(60, 2),
};
const BIND = {
    START: "animationstart",
    CLOSE: "animationend"
};

let func;
let race = handleStore({ key: UUID }) || launchStamp(14);
let prev = {};


function handleStore(param) {
    const { key, value } = param;
    if (value) {
        localStorage.setItem(key, value);
    } else {
        return localStorage.getItem(key);
    }
}

function launchStamp(value) {
    const date = new Date();
    const msec = value * UNIT.DD * 1000;
    date.setHours(
        0,
        0,
        0,
        msec
    );
    const time = date.valueOf();
    handleStore({ key: UUID, value: time });
    return time;
}

function launchTimer(param) {
    func = setInterval(() => {
        const curr = new Date().valueOf();
        const span = (race - curr) / 1000;
        if (span < 0) {
            cancelTimer(func);
        } else {
            formatTimer(span);
        }
    }, PACE);
}

function cancelTimer(param) {
    clearInterval(param);
}

function formatTimer(param) {
    const DD = Math.floor(param / UNIT.DD) % 14;
    const HH = Math.floor(param / UNIT.HH) % 24;
    const MM = Math.floor(param / UNIT.MM) % 60;
    const SS = Math.floor(param / UNIT.SS) % 60;

    handleTimer({ dd: DD, hh: HH, mm: MM, ss: SS, });
}

function handleTimer(param) {
    let list = {};
    for (let item in param) {
        let unit;
        unit = param[item];
        list = {
            ...list,
            [item]: unit.toString().padStart(2, "0")
        }
    }
    renderTimer({ frames: list, target: $day });
    renderTimer({ frames: list, target: $hrs });
    renderTimer({ frames: list, target: $min });
    renderTimer({ frames: list, target: $sec });
}

function renderTimer(param) {
    const { frames, target } = param;
    const query = target.id.slice(-2);
    
    const $flip = target.querySelector(".flip");

    const $head = target.querySelector(".head");
    const $back = target.querySelector(".back");

    const $base = target.querySelector(".base");
    const $fore = target.querySelector(".fore");

    let pUnit = $head.innerText;
    let cUnit = frames[query];

    if (pUnit === cUnit) { return };
    target.classList.toggle("ease");
    
    function animationStart() {
        $head.innerText = cUnit;
        $back.innerText = cUnit;
    }
    
    function animationClose() {
        target.classList.toggle("ease");
        
        pUnit = cUnit;
        $fore.innerText = pUnit;
        $base.innerText = pUnit;

        $flip.removeEventListener(BIND.START, animationStart);
        $flip.removeEventListener(BIND.CLOSE, animationClose);
    }

    $flip.addEventListener(BIND.START, animationStart);
    $flip.addEventListener(BIND.CLOSE, animationClose);
}

window.addEventListener("DOMContentLoaded", () => launchTimer());