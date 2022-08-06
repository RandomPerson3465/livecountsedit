const Elements = {
    c: [channelName1, channelName2],
    s: [channelSubs1, channelSubs2],
    t: [setSubs1, setSubs2],
    g: subgap
};
let rates = [NaN, NaN];
let gap = 0;
let active = false;
const updateInterval = 2e3;
const updateColorDuration = 1500;
let negativeCounts = false;
let abbreviate = false;

function setName(counter) {
    if (counter === 1) {
        Elements.c[0].innerText = String(prompt("Enter new channel name:") || "Channel 1") || "Channel 1";
    }
    if (counter === 2) {
        Elements.c[1].innerText = String(prompt("Enter new channel name:") || "Channel 2") || "Channel 2";
    }
}

function setCounts() {
    let count1 = Number(Elements.t[0].value) || 0;
    let count2 = Number(Elements.t[1].value) || 0;
    updateCounts(count1, count2);
}

function toggleBoxes() {
    if (Elements.t[0].hidden || Elements.t[1].hidden) {
        for (const item of Elements.t) {
            item.hidden = false;
        }
    } else {
        for (const item of Elements.t) {
            item.hidden = true;
        }
    }
}

function setRates(counter) {
    if (counter === 1) {
        let newRate = prompt("Enter new subscriber rate (per hour) for " + Elements.c[0].innerText);
        rates[0] = Number(newRate === null ? rates[0] : newRate);
        rates[1] = rates[1] || 0;
    }
    if (counter === 2) {
        let newRate = prompt("Enter new subscriber rate (per hour) for " + Elements.c[1].innerText);
        rates[1] = Number(newRate === null ? rates[1] : newRate);
        rates[0] = rates[0] || 0;
    }
}

function abbreviateCount(count) {
    let roundoff = Math.floor(Math.log10(count)) - 2;
    count = Math.floor(count / 10 ** roundoff) * 10 ** roundoff;
    return count;
}

function updateCounts(subs1, subs2) {
    active = true;
    if (!negativeCounts) {
        if (subs1 < 0) subs1 = 0;
        if (subs2 < 0) subs2 = 0;
    }
    if (!abbreviate) {
        Elements.s[0].innerText = Math.round(subs1) || 0;
        Elements.s[1].innerText = Math.round(subs2) || 0;
        Elements.g.innerText = Math.round(subs1) - Math.round(subs2) || 0;
    } else {
        Elements.s[0].innerText = abbreviateCount(subs1) || 0;
        Elements.s[1].innerText = abbreviateCount(subs2) || 0;
        Elements.g.innerText = (abbreviateCount(subs1) || 0) - (abbreviateCount(subs2) || 0);
    }
    s = [subs1, subs2];
    gap = subs1 - subs2;
}

function update() {
    if (isNaN(rates[0]) || isNaN(rates[1])) return;
    active = true;
    let increment1 = 0 + rates[0] / 3600 * (i / 1e3);
    let increment2 = 0 + rates[1] / 3600 * (i / 1e3);
    updateCounts(increment1, increment2);
}
setInterval(update, updateInterval);
let chart = new Highcharts.chart({
    chart: {
        renderTo: "chart",
        type: "spline",
        zoomType: "x",
        backgroundColor: "transparent",
        plotBorderColor: "transparent"
    },
    title: {
        text: "Subscriber Gap Graph",
        style: {
            color: "#fff"
        }
    },
    xAxis: {
        type: "datetime",
        tickPixelInterval: 500,
        gridLineColor: "#999",
        labels: {
            style: {
                color: "#fff"
            }
        },
        lineColor: "#999",
        minorGridLineColor: "#999",
        tickColor: "#999",
        title: {
            style: {
                color: "#fff"
            }
        }
    },
    yAxis: {
        title: {
            text: ""
        },
        gridLineColor: "#999",
        labels: {
            style: {
                color: "#fff"
            }
        },
        lineColor: "#999",
        minorGridLineColor: "#999",
        tickColor: "#999"
    },
    series: [{
        name: "Sub Gap",
        marker: {
            enabled: false
        },
        color: "#fff",
        lineColor: "#fff"
    }]
});
setInterval(() => {
    if (!active) return;
    let x = chart.series[0].addPoint([Date.now(), Math.round(gap)], true);
    setTimeout(() => {
        chart.series[0].removePoint(x);
    }, 18e5);
}, 1e3);
document.addEventListener("keypress", getKeyBind);

function getKeyBind(keyPressed) {
    if (keyPressed.target !== body || keyPressed.repeat) return;
    const {
        key
    } = keyPressed;
    const keybinds = {
        1: function() {
            updateCounts(1, 0);
            Elements.s[0].style.color = "#0f0";
            setTimeout(() => {
                Elements.s[0].style.color = "#fff";
            }, updateColorDuration);
        },
        2: function() {
            updateCounts(10, 0);
            Elements.s[0].style.color = "#0f0";
            setTimeout(() => {
                Elements.s[0].style.color = "#fff";
            }, updateColorDuration);
        },
        3: function() {
            updateCounts(100, 0);
            Elements.s[0].style.color = "#0f0";
            setTimeout(() => {
                Elements.s[0].style.color = "#fff";
            }, updateColorDuration);
        },
        4: function() {
            updateCounts(-1, 0);
            Elements.s[0].style.color = "#f00";
            setTimeout(() => {
                Elements.s[0].style.color = "#fff";
            }, updateColorDuration);
        },
        5: function() {
            updateCounts(-10, 0);
            Elements.s[0].style.color = "#f00";
            setTimeout(() => {
                Elements.s[0].style.color = "#fff";
            }, updateColorDuration);
        },
        6: function() {
            updateCounts(0, 1);
            Elements.s[1].style.color = "#0f0";
            setTimeout(() => {
                Elements.s[1].style.color = "#fff";
            }, updateColorDuration);
        },
        7: function() {
            updateCounts(0, 10);
            Elements.s[1].style.color = "#0f0";
            setTimeout(() => {
                Elements.s[1].style.color = "#fff";
            }, updateColorDuration);
        },
        8: function() {
            updateCounts(0, 100);
            Elements.s[1].style.color = "#0f0";
            setTimeout(() => {
                Elements.s[1].style.color = "#fff";
            }, updateColorDuration);
        },
        9: function() {
            updateCounts(0, -1);
            Elements.s[1].style.color = "#f00";
            setTimeout(() => {
                Elements.s[1].style.color = "#fff";
            }, updateColorDuration);
        },
        0: function() {
            updateCounts(0, -10);
            Elements.s[1].style.color = "#f00";
            setTimeout(() => {
                Elements.s[1].style.color = "#fff";
            }, updateColorDuration);
        },
        n: function() {
            if (n) {
                n = false;
                alert("Negative counts have been disabled");
            } else {
                n = true;
                alert("Negative counts have been enabled");
            }
        },
        c: function() {
            let clearGraphPrompt = confirm("Are you sure you want to reset the graph? This cannot be undone!");
            if (!clearGraphPrompt) {
                return;
            } else {
                for (i = 0; i < 2; i++) {
                    for (const point of chart.series[0].points) {
                        point.remove();
                    }
                }
            }
        },
        r: function() {
            if (!active) {
                return;
            };
            let resetPrompt = confirm("Are you sure you want to reset the counts? This cannot be undone!");
            if (!resetPrompt) {
                return;
            } else {
                updateCounts(0, 0);
                for (i = 0; i < 2; i++) {
                    for (const point of chart.series[0].points) {
                        point.remove();
                    }
                };
                active = false;
                rates[NaN, NaN];
            }
        },
        t: function() {
            toggleBoxes();
        },
        g: function() {
            if (!chartarea.hidden) {
                chartarea.hidden = true;
                alert("Successfully hid chart.");
            } else {
                chartarea.hidden = false;
                alert("Successfully unhid chart.");
            }
        },
        a: function() {
            if (!b) {
                abbreviate = true;
                alert("Enabled abbreviated count mode.");
                updateCounts(0, 0);
            } else {
                abbreviate = false;
                alert("Disabled abbreviated count mode.");
                updateCounts(0, 0);
            }
        }
    };
    if (typeof keybinds[key] === "function") keybinds[key]();
}