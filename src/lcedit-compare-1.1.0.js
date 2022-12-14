let nightMode = false;
let c1 = "";
let c2 = "";
let subRate1 = 0;
let subRate2 = 0;
let count1 = 0;
let count2 = 0;
document.addEventListener("keypress", keybinds);

function keybinds(key) {
    if (key.target !== body || key.repeat) return;
    if (key.key === "h") {
        if (settings1.hidden) {
            settings1.hidden = false
        } else {
            settings1.hidden = true
        }
    }
}

function toggleNightMode() {
    if (!nightMode) {
        document.body.style.backgroundColor = "#34393f";
        channelName1.style.color = "#fff";
        channelSubs1.style.color = "#fff";
        title.style.color = "#fff";
        byline.style.color = "#fff";
        channelName2.style.color = "#fff";
        channelSubs2.style.color = "#fff";
        updateText.style.color = "#fff";
        nightLabel.style.color = "#fff";
        smallCount.style.color = "#fff";
        smallText.style.color = "#fff";
        file2.style.color = "#0f0";
        label2.style.color = "#0f0";
        notice.style.color = "#fff";
        info.style.color = "#fff";
        nightMode = true;
    } else {
        document.body.style.backgroundColor = "#d0e4fe";
        channelName1.style.color = "#000";
        channelSubs1.style.color = "#000";
        title.style.color = "#000";
        byline.style.color = "#000";
        channelName2.style.color = "#000";
        channelSubs2.style.color = "#000";
        updateText.style.color = "#000";
        nightLabel.style.color = "#000";
        smallCount.style.color = "#000";
        smallText.style.color = "#000";
        label2.style.color = "#1a5a1a";
        file2.style.color = "#1a5a1a";
        notice.style.color = "#000";
        info.style.color = "#000";
        nightMode = false;
    }
}

function submit() {
    c1 = channelSubmitName1.value;
    c2 = channelSubmitName2.value;
    subRate1 = parseInt(rate1.value, 10);
    subRate2 = parseInt(rate2.value, 10);
    if (subRate1 > 6e10 || subRate1 < -6e10 || subRate2 > 6e10 || subRate2 < -6e10) {
        return alert("One or more rates out of range. Must be between -60 000 000 000 and 60 000 000 000 subscribers per hour.")
    }
    if (!c1) {
        return alert("Missing name for channel 1.")
    }
    if (!c2) {
        return alert("Missing name for channel 2.")
    }
    if (file1.files.length === 0) {
        channelThumbnail1.src = "https://i.imgur.com/WeKLZYQ.jpg";
    }
    if (file2.files.length === 0) {
        channelThumbnail2.src = "https://i.imgur.com/WeKLZYQ.jpg";
    }
    count1 = parseInt(countSubmit1.value, 10);
    count2 = parseInt(countSubmit2.value, 10);
    if (isNaN(count1)) {
        return alert("Invalid sub count for channel 1.")
    }
    if (isNaN(count2)) {
        return alert("Invalid sub count for channel 2.")
    }
    if (count1 < -1e12 || count1 > 1e12 || count2 < -1e12 || count2 > 1e12) {
        count1 = 0;
        count2 = 0;
        return alert("Counts may only be between -1 000 000 000 000 and 1 000 000 000 000.")
    }
    channelSubs1.innerHTML = count1;
    channelSubs2.innerHTML = count2;
    smallCount.innerHTML = count1 - count2;
    channelName1.innerHTML = c1;
    channelName2.innerHTML = c2;
    if (file1.files.length) channelThumbnail1.src = URL.createObjectURL(file1.files[0]);
    if (file2.files.length) channelThumbnail2.src = URL.createObjectURL(file2.files[0]);
    title.innerHTML = `${c1} vs. ${c2}`;
}

function updateSubs() {
    if (!c1 || !c2) return;
    if (subRate1 > 6e10 || subRate2 > 6e10) return;
    if (subRate1 < -6e10 || subRate2 < -6e10) return;
    count1 = count1 + (subRate1 / 1800);
    channelSubs1.innerHTML = Math.floor(count1 + subRate1 / 1800);
    count2 = count2 + (subRate2 / 1800);
    channelSubs2.innerHTML = Math.floor(count2 + subRate2 / 1800);
    smallCount.innerHTML = Math.floor(count1 + subRate1 / 1800) - Math.floor(count2 + subRate2 / 1800);
}
setInterval(updateSubs, 2000)