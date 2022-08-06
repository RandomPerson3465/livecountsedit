const channel = channelSubmitName.value;
let count = 0;
let rate = 0;
let nonNeg = false;
let nightMode = false;
let settings = true;
let auditValue = 0;
let paused = false;
document.addEventListener("keypress", keybinds);

function keybinds(key) {
    if (key.target !== body || key.repeat) return;
    if (key.key === "h") {
        if (settings) {
            options.hidden = true;
            settings = false;
            logAction("Hid settings.")
        } else {
            options.hidden = false;
            settings = true;
            logAction("Unhid settings.")
        }
    }
    if (key.key === "1") {
        changeSubs(1);
        logAction("Added 1 sub.")
    }
    if (key.key === "2") {
        changeSubs(10);
        logAction("Added 10 subs.")
    }
    if (key.key === "3") {
        changeSubs(100);
        logAction("Added 100 subs.")
    }
    if (key.key === "4") {
        changeSubs(1000);
        logAction("Added 1 000 subs.")
    }
    if (key.key === "5") {
        changeSubs(10000);
        logAction("Added 10 000 subs.")
    }
    if (key.key === "6") {
        changeSubs(1e6);
        logAction("Added 1 000 000 subs.")
    }
    if (key.key === "7") {
        changeSubs(-1);
        logAction("Removed 1 sub.")
    }
    if (key.key === "8") {
        changeSubs(-10);
        logAction("Removed 10 subs.")
    }
    if (key.key === "9") {
        changeSubs(-1000);
        logAction("Removed 1 000 subs.")
    }
    if (key.key === "0") {
        changeSubs(-1e6);
        logAction("Removed 1 000 000 subs.")
    }
    if (key.key === "a") {
        changeSubs(auditValue);
        logAction(`Audited ${auditValue} subs.`)
    }
    if (key.key === "r") {
        count = 0;
        channelSubs.innerHTML = 0;
        logAction("Reset sub counts.")
    }
    if (key.key === "p") {
        if (!paused) {
            rate = 0;
            paused = true;
            logAction("Paused sub count.")
        } else {
            rate = parseInt(subsPerMinute.value, 10);
            paused = false;
            logAction("Resumed sub count.")
        }
    }
}

function toggleNightMode() {
    if (!nightMode) {
        document.body.style.backgroundColor = "#34393f";
        smallText.style.color = "#fff";
        channelSubs2.style.color = "#fff";
        log.style.color = "#fff";
        channelName.style.color = "#fff";
        nonNegLabel.style.color = "#fff";
        channelSubs.style.color = "#fff";
        info.style.color = "#fff";
        nightLabel.style.color = "#fff";
        nightMode = true;
    } else {
        document.body.style.backgroundColor = "#d0e4fe";
        smallText.style.color = "#000";
        channelSubs2.style.color = "#000";
        log.style.color = "#000";
        channelName.style.color = "#000";
        nonNegLabel.style.color = "#000";
        channelSubs.style.color = "#000";
        info.style.color = "#000";
        nightLabel.style.color = "#000";
        nightMode = false;
    }
}

function stopAtZero() {
    nonNeg ? nonNeg = false : nonNeg = true
}

function submit() {
    const channel = channelSubmitName.value;
    count = parseInt(countSubmit.value, 10);
    auditValue = parseInt(subsAudit.value, 10) % 1e12;
    if (!channel) {
        return alert("Invalid channel name.");
    }
    if (countSubmit.value === "") {
        return alert("Invalid sub count.");
    }
    if (count < -1e12 || count > 1e12) {
        return alert("Count must be between -1 000 000 000 000 and 1 000 000 000 000.");
    }
    if (nonNeg && count < 0) {
        count = 0
    }
    channelSubs.innerHTML = count;
    channelName.innerHTML = channel;
    channelSubs2.innerHTML = Math.floor(parseGoal(count) - count);
    smallText.innerHTML = "subscribers to " + parseGoal(count).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (parseInt(subsPerMinute.value, 10)) {
        rate = parseInt(subsPerMinute.value, 10);
    } else {
        rate = 0;
    }
    if (rateOption.value == "mins" && (rate > 1e9 || rate < -1e9)) {
        return alert("Rate must be between -1 000 000 000 and 1 000 000 000 subscribers per minute.");
    }
    if (rateOption.value == "secs" && (rate > 1e9 / 60 || rate < -1e9 / 60)) {
        return alert("Rate must be between -1 000 000 000 and 1 000 000 000 subscribers per minute.");
    }
    if (rateOption.value == "hrs" && (rate > 3.6e12 || rate < -3.6e12)) {
        return alert("Rate must be between -1 000 000 000 and 1 000 000 000 subscribers per minute.");
    }
}

function changeSubs(c) {
    let subs = count;
    count = subs + c;
    if (count < 0 && nonNeg) count = 0;
    channelSubs.innerHTML = Math.floor(count);
    channelSubs2.innerHTML = Math.floor(parseGoal(count) - count);
    smallText.innerHTML = "subscribers to " + parseGoal(count).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function parseGoal(int) {
    int = int + 1;
    if (int < 10) return 10;
    const exponent = Math.floor(Math.log10(int));
    const factor = Math.ceil(int / 10 ** exponent);
    return factor * 10 ** exponent;
}

function logAction(text) {
    log.innerHTML = text;
    setTimeout(() => {
        log.innerHTML = "Press P to pause, H to hide settings, R to reset subs"
    }, 1800)
}

function updateSubs() {
    if (!channelSubmitName.value) return;
    if (rateOption.value == "mins" && (rate > 1e9 || rate < -1e9)) {
        return;
    }
    if (rateOption.value == "secs" && (rate > 1e9 / 60 || rate < -1e9 / 60)) {
        return;
    }
    if (rateOption.value == "hrs" && (rate > 3.6e12 || rate < -3.6e12)) {
        return;
    }
    let updateIntervals = 30;
    if (rateOption.value == "secs") {
        updateIntervals = 0.5
    }
    if (rateOption.value == "mins") {
        updateIntervals = 30
    }
    if (rateOption.value == "hrs") {
        updateIntervals = 1800
    }
    channelSubs.innerHTML = Math.floor(count + rate / updateIntervals) < 0 && nonNeg ? 0 : Math.floor(count + rate / updateIntervals);
    count = count + rate / updateIntervals;
    channelSubs2.innerHTML = Math.floor(parseGoal(count) - count) < 0 && nonNeg ? 10 : Math.floor(parseGoal(count) - count);
    smallText.innerHTML = "subscribers to " + parseGoal(count).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
setInterval(updateSubs, 2000);