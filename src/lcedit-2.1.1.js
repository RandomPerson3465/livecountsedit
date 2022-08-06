const channel = channelSubmitName.value;
let count = 0;
let rate = 0;
let nonNeg = false;
let nightMode = false;

function toggleNightMode() {
    if (!nightMode) {
        document.body.style.backgroundColor = "#34393f";
        channelName.style.color = "#fff";
        nonNegLabel.style.color = "#fff";
        channelSubs.style.color = "#fff";
        info.style.color = "#fff";
        nightLabel.style.color = "#fff";
        nightMode = true;
    } else {
        document.body.style.backgroundColor = "#d0e4fe";
        channelName.style.color = "#000";
        nonNegLabel.style.color = "#000";
        channelSubs.style.color = "#000";
        info.style.color = "#000";
        nightLabel.style.color = "#000";
        nightMode = false
    }
}

function stopAtZero() {
    nonNeg ? nonNeg = false : nonNeg = true
}

function submit() {
    const channel = channelSubmitName.value;
    count = parseInt(countSubmit.value, 10);
    if (!channel) {
        return alert("Invalid channel name.");
    }
    if (typeof count !== "number") {
        return alert("Count must be a number.");
    }
    if (count < -1e12 || count > 1e12) {
        return alert("Count must be between -1 000 000 000 000 and 1 000 000 000 000.");
    }
    if (nonNeg && count < 0) {
        count = 0
    }
    channelSubs.innerHTML = count;
    channelName.innerHTML = channel;
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
    if (rateOption.value == "hrs" && (rate > 6e10 || rate < -6e10)) {
        return alert("Rate must be between -1 000 000 000 and 1 000 000 000 subscribers per minute.");
    }
}

function updateSubs() {
    if (!channelSubmitName.value) return;
    if (rateOption.value == "mins" && (rate > 1e9 || rate < -1e9)) {
        return;
    }
    if (rateOption.value == "secs" && (rate > 1e9 / 60 || rate < -1e9 / 60)) {
        return;
    }
    if (rateOption.value == "hrs" && (rate > 6e10 || rate < -6e10)) {
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
}
setInterval(updateSubs, 2000);