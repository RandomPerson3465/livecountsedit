function submit() {
    const channelName = document.getElementById("channelSubmitName").value
    const count = document.getElementById("countSubmit").value
    if (!channelName) {
        alert("You must specify a channel name.");
    } else {
        if (count > 1e12 || count < 0) {
            alert("Count must be between 0 and 1000000000000.");
        } else {
            document.getElementById("channelName").innerText = channelName
            document.getElementById("channelSubs").innerText = Math.round(count)
        }
    }
}