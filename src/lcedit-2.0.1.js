const channel = channelSubmitName.value
let count = 0
let rate = 0

function submit() {
    const channel = channelSubmitName.value
    count = parseInt(countSubmit.value, 10)
    if (!channel) {
        return alert("Invalid channel name.")
    }
    if (typeof count === "undefined") {
        return alert("Count must be a number.")
    }
    if (count < -1e12 || count > 1e12) {
        return alert("Count must be between -1 000 000 000 000 and 1 000 000 000 000.")
    }
    channelSubs.innerHTML = count
    channelName.innerHTML = channel
    if (parseInt(subsPerMinute.value, 10)) rate = parseInt(subsPerMinute.value, 10)
    if (rate > 1e9 || rate < -1e9) {
        return alert("Rate must be between -1 000 000 000 and 1 000 000 000.")
    }
}

function updateSubs() {
    if (rate > 1e9 || rate < -1e9) return;
    channelSubs.innerHTML = Math.floor(count + rate / 30)
    count = count + rate / 30
}
setInterval(updateSubs, 2e3)