console.warn("Typing things you don't understand in here can cause unexpected glitches or issues.")

function updateNames(c1, c2) {
    document.querySelector("#channelName1").innerText = c1
    document.querySelector("#channelName2").innerText = c2
    document.querySelector("#ctitle1").innerText = c1
    document.querySelector("#ctitle2").innerText = c2
    document.querySelector("#c1tab").innerText = c1
    document.querySelector("#c2tab").innerText = c2
    document.querySelector(".title").innerText = `${c1} vs. ${c2}`
    document.querySelector("#subs1").placeholder = `Subs for ${c1}`
    document.querySelector("#subs2").placeholder = `Subs for ${c2}`
}

const c1 = localStorage.getItem("c1Name") || "Channel 1";
const c2 = localStorage.getItem("c2Name") || "Channel 2"
const s = localStorage.getItem("showBoxes") !== null ? stringToBoolean(localStorage.getItem("showBoxes")) : true
const g = localStorage.getItem("showGraph") !== null ? stringToBoolean(localStorage.getItem("showGraph")) : true
window.onload = function() {
    openTab(event, "Settings_General")
    document.querySelector("#subGapTitle").innerText = localStorage.getItem("subGapTitle") || "Sub Gap";
    updateNames(c1, c2)
    if (!s) {
        for (const o of document.querySelectorAll(".option")) {
            o.hidden = true;
        }
    }
    if (!g) {
        document.querySelector("#chart").hidden = true;
    }
    document.addEventListener("keydown", K)
}

function stringToBoolean(e) {
    if (!e || typeof e !== "string") return false
    if (e.toLowerCase() === "false") return false;
    else if (e.toLowerCase() === "true") return true;
    else return false
}

function checkItem(e) {
    if (!localStorage.getItem(e) || localStorage.getItem(e) === "undefined") return undefined
    if (isNaN(Number(localStorage.getItem(e)))) return undefined
    else return Number(localStorage.getItem(e))
}

function showToast(e) {
    const toast = document.querySelector("#toast")
    toast.innerText = e;
    toast.className = "show";
    setTimeout(() => {
        toast.className = ""
    }, 3e3)
}
class UpdateManager {
    constructor() {
        this.options = {
            showGraph: localStorage.getItem("showGraph") !== null ? stringToBoolean(localStorage.getItem("showGraph")) : true,
            graphMoves: false,
            abbreviated: stringToBoolean(localStorage.getItem("abbreviated")) || false,
            colors: stringToBoolean(localStorage.getItem("colors")) || false,
            updateInterval: Number(localStorage.getItem("updateInterval")) || 2000,
            subGapTitle: localStorage.getItem("subGapTitle") || "Sub Gap",
            keepSettings: stringToBoolean(localStorage.getItem("keepSettings")) || false,
            keybinds: localStorage.getItem("keybinds") !== null ? stringToBoolean(localStorage.getItem("keybinds")) : true,
            showBoxes: s,
            maxGraphPoints: Number(localStorage.getItem("maxGraphPoints")) || 200,
            subGapMethod: Number(localStorage.getItem("subGapMethod")) || 0
        }
        this.counters = [{
            name: localStorage.getItem("c1Name") || "Channel 1",
            exactCount: Number(localStorage.getItem("subs1")) || 0,
            displayCount: 0,
            oldDisplayCount: 0,
            minRate: Number(localStorage.getItem("minRate1")) || 0,
            maxRate: Number(localStorage.getItem("maxRate1")) || 0,
            limits: {
                min: Number(localStorage.getItem("min1")) || 0,
                max: checkItem("max1"),
            },
            audit: {
                min: Number(localStorage.getItem("auditMin1")) || 0,
                max: Number(localStorage.getItem("auditMax1")) || 0
            }
        }, {
            name: localStorage.getItem("c2Name") || "Channel 2",
            exactCount: Number(localStorage.getItem("subs2")) || 0,
            displayCount: 0,
            oldDisplayCount: 0,
            minRate: Number(localStorage.getItem("minRate2")) || 0,
            maxRate: Number(localStorage.getItem("maxRate2")) || 0,
            limits: {
                min: Number(localStorage.getItem("min2")) || 0,
                max: checkItem("max2"),
            },
            audit: {
                min: Number(localStorage.getItem("auditMin2")) || 0,
                max: Number(localStorage.getItem("auditMax2")) || 0
            }
        }]
        this.update = function(c, n) {
                n = Number(n)
                if (isNaN(n)) return;
                let _c = this.counters[c]
                if (n > 2 ** 52) n = 2 ** 52
                if (n < -(2 ** 52)) n = -(2 ** 52)
                if (n > _c.limits.max && !isNaN(_c.limits.max)) n = _c.limits.max
                if (n < _c.limits.min && !isNaN(_c.limits.min)) n = _c.limits.min
                _c.oldExactCount = _c.exactCount;
                _c.exactCount = n;
                if (this.options.abbreviated) {
                    _c.displayCount = abb(n)
                } else _c.displayCount = Math.round(n)
            },
            this.increment = function(c, n) {
                this.update(c, this.counters[c].exactCount + n)
            },
            this.saveCount = function(c) {
                if (c === 1) {
                    return this.update(0, document.querySelector("#subs1").value)
                }
                if (c === 2) {
                    return this.update(1, document.querySelector("#subs2").value)
                }
            }
    }
}

chart = new Highcharts.chart({
    chart: {
        renderTo: "chart",
        type: "spline",
        zoomType: "x",
        backgroundColor: "transparent",
        plotBorderColor: "transparent"
    },
    title: {
        text: ""
    },
    xAxis: {
        type: "datetime",
        gridLineColor: "#999",
        labels: {
            style: {
                color: "#999"
            }
        },
        lineColor: "#888",
        minorGridLineColor: "#999",
        tickColor: "#999",
        title: {
            style: {
                color: "#999"
            }
        }
    },
    yAxis: {
        title: {
            text: ""
        },
        gridLineColor: "#999",
        lineColor: "#888",
        minorGridLineColor: "#888",
        tickColor: "#999"
    },
    series: [{
        name: "Subscriber difference",
        marker: {
            enabled: !1
        }
    }]
})
const u = new UpdateManager();

function fixCounts() {
    u.increment(0, 0)
    u.increment(1, 0)
}
fixCounts()
updateCounts = function() {
    u.increment(0, ((u.counters[0].minRate + (Math.random() * (u.counters[0].maxRate - u.counters[0].minRate))) / (3.6e6 / u.options.updateInterval)))
    u.increment(1, ((u.counters[1].minRate + (Math.random() * (u.counters[1].maxRate - u.counters[1].minRate))) / (3.6e6 / u.options.updateInterval)))
    if (!u.options.graphMoves && u.options.showGraph) u.options.graphMoves = true;
    const s1 = u.counters[0].displayCount
    if (s1 > u.counters[0].oldDisplayCount && u.options.colors) {
        document.querySelector("#channelSubs1").style.color = "#0f0";
        setTimeout(() => {
            document.querySelector("#channelSubs1").style.color = "#fff"
        }, 2000)
    }
    if (s1 < u.counters[0].oldDisplayCount && u.options.colors) {
        document.querySelector("#channelSubs1").style.color = "#f00";
        setTimeout(() => {
            document.querySelector("#channelSubs1").style.color = "#fff"
        }, 2000)
    }
    const s2 = u.counters[1].displayCount
    if (s2 > u.counters[1].oldDisplayCount && u.options.colors) {
        document.querySelector("#channelSubs2").style.color = "#0f0";
        setTimeout(() => {
            document.querySelector("#channelSubs2").style.color = "#fff"
        }, 2000)
    }
    if (s2 < u.counters[1].oldDisplayCount && u.options.colors) {
        document.querySelector("#channelSubs2").style.color = "#f00";
        setTimeout(() => {
            document.querySelector("#channelSubs2").style.color = "#fff"
        }, 2000)
    }
    u.counters[0].oldDisplayCount = s1
    u.counters[1].oldDisplayCount = s2
    document.querySelector("#channelSubs1").innerText = s1
    document.querySelector("#channelSubs2").innerText = s2
    if (u.options.keepSettings) {
        localStorage.setItem("subs1", u.counters[0].exactCount)
        localStorage.setItem("subs2", u.counters[1].exactCount)
    }
    if (u.options.subGapMethod == 1) subgap = s1 - s2
    else if (u.options.subGapMethod == 2) subgap = s2 - s1
    else subgap = Math.abs(s1 - s2)
    document.querySelector("#subgap").innerText = subgap
    if (u.options.graphMoves) {
        var e = chart.series[0].addPoint([Date.now(), subgap]);
    }
    if (chart.series[0].points.length > u.options.maxGraphPoints) {
        while (chart.series[0].points.length > u.options.maxGraphPoints) {
            chart.series[0].removePoint(chart.series[0].points[0])
        }
    }
}
updateCounts()
var iv = setInterval(updateCounts, u.options.updateInterval)


function abb(e) {
    if (Math.abs(e) < 1e3)
        return Math.round(e);
    var t = Math.sign(e);
    e = Math.abs(e);
    var a = Math.floor(Math.log10(e));
    return t * (Math.floor(e / 10 ** (a - 2)) * 10 ** (a - 2))
}

const exampleChannels = [
    "T-Series", "PewDiePie", "MrBeast", "Dude Perfect", "Cocomelon", "WWE", "SET India", "5-Minute Crafts", "Zee Music Company", "Canal KondZilla", "BLACKPINK", "Marshmello", "Big Hit Labels", "Movieclips", "Aaj Tak", "Badabun", "JuegaGerman", "HolaSoyGerman.", "Você Sabia?", "elrubuisOMG", "CarryMinati", "Markiplier"
]

function toggleSettings() {
    if (document.querySelector("#menu").style.visibility === "hidden") {
        document.querySelector(".settingsButton").classList.add("iconAnimated")
        document.querySelector(".background").style.display = "block";
        document.querySelector("#menu").style.visibility = "visible";

        document.querySelector("#abbreviated").checked = u.options.abbreviated;
        document.querySelector("#toggleGraph").checked = !(document.querySelector("#chart").hidden)
        document.querySelector("#toggleColors").checked = u.options.colors
        document.querySelector("#toggleKeybinds").checked = u.options.keybinds
        document.querySelector("#keepCounts").checked = u.options.keepSettings;
        document.querySelector("#showCountBoxes").checked = u.options.showBoxes
        document.querySelector("#setSubGapTitle").value = u.options.subGapTitle
        document.querySelector("#maxGraphPoints").value = u.options.maxGraphPoints
        document.querySelector("#setSubGap").value = u.options.subGapMethod.toString()
        document.querySelector("#setUpdateInterval").value = (u.options.updateInterval / 1e3).toString()
        for (i = 0; i < 2; i++) {
            document.querySelector(`#setChannelName${i+1}`).value = u.counters[i].name
            document.querySelector(`#minaudit${i+1}`).value = Math.min(u.counters[i].audit.min, u.counters[i].audit.max)
            document.querySelector(`#maxaudit${i+1}`).value = Math.max(u.counters[i].audit.min, u.counters[i].audit.max)
            document.querySelector(`#mincount${i+1}`).value = u.counters[i].limits.min === undefined ? "" : u.counters[i].limits.min
            document.querySelector(`#maxcount${i+1}`).value = u.counters[i].limits.max === undefined ? "" : u.counters[i].limits.max
            document.querySelector(`#minSubs${i+1}`).value = u.counters[i].minRate
            document.querySelector(`#maxSubs${i+1}`).value = u.counters[i].maxRate
            document.querySelector(`#rate${i+1}`).value = 1
            document.querySelector(`#unit${i+1}`).value = "3600"
        }

    } else {
        document.querySelector(".settingsButton").classList.remove("iconAnimated")
        document.querySelector(".background").style.display = "none";
        document.querySelector("#menu").style.visibility = "hidden";
    }

}

function checkValue(e) {
    if (!document.querySelector(e).value || isNaN(Number(document.querySelector(e).value))) return true
    else return false
}

function getNum(e) {
    return Number(document.querySelector(e).value)
}

function applyChanges() {
    u.options.colors = document.querySelector("#toggleColors").checked;
    u.options.abbreviated = document.querySelector("#abbreviated").checked;
    u.options.keepSettings = document.querySelector("#keepCounts").checked;
    u.options.keybinds = document.querySelector("#toggleKeybinds").checked;
    u.options.showBoxes = document.querySelector("#showCountBoxes").checked;
    u.options.showGraph = document.querySelector("#toggleGraph").checked;
    u.options.graphMoves = u.options.showGraph;
    u.options.subGapTitle = document.querySelector("#setSubGapTitle").value;
    u.options.subGapMethod = Number(document.querySelector("#setSubGap").value);
    u.counters[0].name = document.querySelector("#setChannelName1").value || "Channel 1"
    u.counters[1].name = document.querySelector("#setChannelName2").value || "Channel 2"
    document.querySelector("#chart").hidden = !u.options.showGraph
    if (!u.options.showGraph) {
        for (const p of chart.series[0].points) {
            chart.series[0].removePoint(p)
        }
    }
    for (i = 0; i < 2; i++) {
        if (checkValue(`#minaudit${i+1}`)) {
            if (checkValue(`#maxaudit${i+1}`)) {
                u.counters[i].audit.min = 0;
                u.counters[i].audit.max = 0;
            } else {
                u.counters[i].audit.min = getNum(`#maxaudit${i+1}`);
                u.counters[i].audit.max = u.counters[i].audit.min;
            }
        } else {
            if (checkValue(`#maxaudit${i+1}`)) {
                u.counters[i].audit.min = getNum(`#minaudit${i+1}`);
                u.counters[i].audit.max = u.counters[i].audit.min;
            } else {
                u.counters[i].audit.min = getNum(`#minaudit${i+1}`);
                u.counters[i].audit.max = getNum(`#maxaudit${i+1}`);
            }
        }
        if (document.querySelector(`#rate${i+1}`).value === "") {
            document.querySelector(`#rate${i+1}`).value = "1";
        }
        if (!getNum("#maxGraphPoints") || getNum("#maxGraphPoints") < 5) {
            showToast("Please check for invalid settings")
            return document.querySelector("#maxGraphPointsWarning").classList.add("active")
        } else {
            u.options.maxGraphPoints = Math.round(getNum("#maxGraphPoints"))
            document.querySelector("#maxGraphPointsWarning").classList.remove("active")
        }
        if (getNum(`#rate${i+1}`) <= 0) {
            showToast("Please check for invalid settings")
            return document.querySelector(`#setRateWarning${i+1}`).classList.add("active")
        } else {
            document.querySelector(`#setRateWarning${i+1}`).classList.remove("active")
        }
        if (checkValue(`#minSubs${i+1}`)) {
            if (checkValue(`#maxSubs${i+1}`)) {
                u.counters[i].minRate = 0;
                u.counters[i].maxRate = 0;
            } else {
                u.counters[i].minRate = (getNum(`#maxSubs${i+1}`) * 3600) / (getNum(`#rate${i+1}`) * getNum(`#unit${i+1}`))
                u.counters[i].maxRate = u.counters[i].minRate;
            }
        } else {
            if (checkValue(`#maxSubs${i+1}`)) {
                u.counters[i].minRate = (getNum(`#minSubs${i+1}`) * 3600) / (getNum(`#rate${i+1}`) * getNum(`#unit${i+1}`))
                u.counters[i].maxRate = u.counters[i].minRate;
            } else {
                u.counters[i].minRate = (getNum(`#minSubs${i+1}`) * 3600) / (getNum(`#rate${i+1}`) * getNum(`#unit${i+1}`))
                u.counters[i].maxRate = (getNum(`#maxSubs${i+1}`) * 3600) / (getNum(`#rate${i+1}`) * getNum(`#unit${i+1}`))
            }
        }
        if (checkValue(`#mincount${i+1}`)) {
            u.counters[i].limits.min = undefined;
        } else {
            u.counters[i].limits.min = getNum(`#mincount${i+1}`)
        }
        if (checkValue(`#maxcount${i+1}`)) {
            u.counters[i].limits.max = undefined;
        } else {
            if (u.counters[i].limits.min !== undefined && getNum(`#maxcount${i+1}`) < u.counters[i].limits.min) {
                showToast("Please check for invalid settings")
                return document.querySelector(`#maxSubsWarning${i+1}`).classList.add("active")
            } else {
                document.querySelector(`#maxSubsWarning${i+1}`).classList.remove("active")
                u.counters[i].limits.max = getNum(`#maxcount${i+1}`)
            }
        }
    }

    const newInterval = parseFloat(document.querySelector("#setUpdateInterval").value, 10)
    if (isNaN(newInterval) || newInterval < 0.5 || newInterval > 2147483.647) {
        showToast("Please check for invalid settings")
        return document.querySelector("#setUpdateIntervalWarning").classList.add("active")
    } else {
        if (newInterval * 1e3 !== u.options.updateInterval) {
            u.options.updateInterval = newInterval * 1e3
            clearInterval(iv)
            iv = setInterval(updateCounts, u.options.updateInterval)
        }
        document.querySelector("#setUpdateIntervalWarning").classList.remove("active")
    }
    if (!u.options.showBoxes) {
        for (const o of document.querySelectorAll(".option")) {
            o.hidden = true;
        }
    } else {
        for (const o of document.querySelectorAll(".option")) {
            o.hidden = false;
        }
    }

    document.querySelector("#subGapTitle").innerText = u.options.subGapTitle;
    const n1 = u.counters[0].name
    const n2 = u.counters[1].name
    updateNames(n1, n2)
    fixCounts()
    if (u.options.keepSettings) {
        for (const item of Object.keys(u.options)) {
            localStorage.setItem(item, u.options[item])
        }
        localStorage.setItem("c1Name", n1)
        localStorage.setItem("c2Name", n2)
        for (i = 0; i < 2; i++) {
            localStorage.setItem(`auditMin${i+1}`, Math.min(u.counters[i].audit.min, u.counters[i].audit.max))
            localStorage.setItem(`auditMax${i+1}`, Math.max(u.counters[i].audit.min, u.counters[i].audit.max))
            localStorage.setItem(`min${i+1}`, u.counters[i].limits.min)
            localStorage.setItem(`max${i+1}`, u.counters[i].limits.max)
            localStorage.setItem(`minRate${i+1}`, u.counters[i].minRate)
            localStorage.setItem(`maxRate${i+1}`, u.counters[i].maxRate)
        }
    } else {
        localStorage.clear()
    }
    toggleSettings()
}

function cycleChannels() {
    for (const c of document.querySelectorAll(".channelInput")) {
        let n = exampleChannels[Math.floor(Math.random() * exampleChannels.length)]
        if (n === "\u0042\u004c\u0041\u0043\u004b\u0050\u0049\u004e\u004b" && Math.random() < 0.05) n = "\u0053\u0049\u004d\u0050\u0050\u0049\u004e\u004b"
        if (n === "\u0042\u0069\u0067\u0020\u0048\u0069\u0074\u0020\u004c\u0061\u0062\u0065\u006c\u0073" && Math.random() < 0.05) n = "\u0042\u0069\u0067\u0020\u0053\u0068\u0069\u0074\u0020\u004c\u0061\u0062\u0065\u006c\u0073"
        c.placeholder = `e.g. ${n}`
    }
}
cycleChannels()
setInterval(cycleChannels, 2500)

const keybinds = {
    1: () => {
        u.increment(0, 1)
    },
    2: () => {
        u.increment(0, 10)
    },
    3: () => {
        u.increment(0, 100)
    },
    4: () => {
        u.increment(0, 1e3)
    },
    5: () => {
        u.increment(0, 1e6)
    },
    6: () => {
        u.increment(0, -1)
    },
    7: () => {
        u.increment(0, -10)
    },
    8: () => {
        u.increment(0, -100)
    },
    9: () => {
        u.increment(0, -1e3)
    },
    0: () => {
        u.increment(0, -1e6)
    },
    q: () => {
        u.increment(1, 1)
    },
    w: () => {
        u.increment(1, 10)
    },
    e: () => {
        u.increment(1, 100)
    },
    r: () => {
        u.increment(1, 1e3)
    },
    t: () => {
        u.increment(1, 1e6)
    },
    y: () => {
        u.increment(1, -1)
    },
    u: () => {
        u.increment(1, -10)
    },
    i: () => {
        u.increment(1, -100)
    },
    o: () => {
        u.increment(1, -1e3)
    },
    p: () => {
        u.increment(1, -1e6)
    },
    a: () => {
        const a = u.counters[0].audit.min + (Math.random() * (u.counters[0].audit.max - u.counters[0].audit.min))
        u.increment(0, a)
    },
    h: () => {
        if (u.options.showBoxes) {
            u.options.showBoxes = false
            showToast("Hid counter input boxes.")
        } else {
            u.options.showBoxes = true
            showToast("Unhid counter input boxes.")
        }
        for (const o of document.querySelectorAll(".option")) {
            o.hidden = !u.options.showBoxes
        }
    },
    l: () => {
        const a = u.counters[1].audit.min + (Math.random() * (u.counters[1].audit.max - u.counters[1].audit.min))
        u.increment(1, a)
    },
    c: () => {
        for (const p of chart.series[0].points) {
            chart.series[0].removePoint(p)
        }
        showToast("Cleared graph.")
    }
}

function K(e) {
    if (!e.repeat && e.target === document.querySelector("body")) {
        if (u.options.keybinds) {
            Object.keys(keybinds).includes(e.key) && keybinds[e.key]()
        }
    }
}

function openTab(e, f) {
    var i, tc, tl;
    tc = document.getElementsByClassName("tab-content");
    for (i = 0; i < tc.length; i++) {
        tc[i].style.display = "none";
    }
    tl = document.getElementsByClassName("tab-link");
    for (i = 0; i < tl.length; i++) {
        tl[i].className = tl[i].className.replace(" active", "");
    }
    document.getElementById(f).style.display = "block";
    e.currentTarget.className += " active";
}
