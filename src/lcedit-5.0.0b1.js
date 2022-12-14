var displayCount = 0;
var started = false;
const paths = {
    red: "../src/lcedit-5.0.0-red.css",
    blue: "../src/lcedit-5.0.0-blue.css",
    socialblade: "../src/lcedit-5.0.0-socialblade.css",
    livecounts: "../src/lcedit-5.0.0-livecounts.css"
};

function saveTheme() {
    document.querySelector(".theme").href = paths[document.querySelector("#themeSelect").value];
}

function saveChannel() {
    if (!document.querySelector("#setChannel").value) return alert("Please enter a channel name!");
    document.querySelector("#name").innerText = document.querySelector("#setChannel").value;
}

function saveCount() {
    var c = parseInt(document.querySelector("#setCount").value, 10);
    if (isNaN(c)) return alert("Please enter a vaild subscriber count.");
    if (!started) started = true;
    if (c > Number.MAX_SAFE_INTEGER) c = Number.MAX_SAFE_INTEGER;
    if (c < Number.MIN_SAFE_INTEGER) c = Number.MIN_SAFE_INTEGER;
    document.querySelector("#count").innerText = Math.round(c);
    displayCount = c;
    document.querySelector("#smallCounter").innerText = G(c) - Math.round(c);
}

function G(e) {
    if (++e < 10) return 10;
    const a = Math.floor(Math.log10(e));
    return Math.ceil(e / 10 ** a) * 10 ** a;
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
        lineColor: "#f66",
        minorGridLineColor: "#888",
        tickColor: "#999"
    },
    series: [{
        name: "Subscribers",
        marker: {
            enabled: false
        }
    }]
});
setInterval(() => {
    if (!started) return;
    var e = chart.series[0].addPoint([Date.now(), displayCount]);
    setTimeout(() => {
        chart.series[0].removePoint(e);
    }, 18e5);
}, 2e3);
const youtuberExamples = ["PewDiePie", "T-Series", "Cocomelon - Nursery Rhymes", "SET India", "WWE", "5-Minute Crafts", "Zee Music Comapny", "Canal KondZilla", "BLACKPINK", "Zee TV", "Dude Perfect", "MrBeast", "Marshmello", "Big Hit Labels", "Ed Sheeran", "Aaj Tak", "Badabun", "HolaSoyGerman"];
setInterval(() => {
    document.querySelector("#setChannel").placeholder = `e.g. ${youtuberExamples[Math.floor(Math.random() * youtuberExamples.length)]}`;
}, 3500);