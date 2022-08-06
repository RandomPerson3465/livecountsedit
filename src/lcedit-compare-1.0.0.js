let nightMode = false;

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
        nightMode = false;
    }
}

function submit() {
    const c1 = channelSubmitName1.value;
    const c2 = channelSubmitName2.value;
    if (!c1) {
        return alert("Missing name for channel 1.")
    }
    if (!c2) {
        return alert("Missing name for channel 2.")
    }
    if (file1.files.length === 0) {
        return alert("Missing image for channel 1.")
    }
    if (file2.files.length === 0) {
        return alert("Missing image for channel 2.")
    }
    const count1 = parseInt(countSubmit1.value, 10);
    const count2 = parseInt(countSubmit2.value, 10);
    if (isNaN(count1)) {
        return alert("Invalid sub count for channel 1.")
    }
    if (isNaN(count2)) {
        return alert("Invalid sub count for channel 2.")
    }
    if (count1 < -1e12 || count1 > 1e12 || count2 < -1e12 || count2 > 1e12) {
        return alert("Counts may only be between -1 000 000 000 000 and 1 000 000 000 000.")
    }
    channelSubs1.innerHTML = count1;
    channelSubs2.innerHTML = count2;
    smallCount.innerHTML = count1 - count2;
    channelName1.innerHTML = c1;
    channelName2.innerHTML = c2;
    channelThumbnail1.src = URL.createObjectURL(file1.files[0]);
    channelThumbnail2.src = URL.createObjectURL(file2.files[0]);
    title.innerHTML = `${c1} vs. ${c2}`;
}