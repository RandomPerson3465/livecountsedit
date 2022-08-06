function goal(int) {
    int++
    if (int < 10) return 10;
    const a = Math.floor(Math.log10(int));
    const b = Math.ceil(int / 10 ** a);
    return b * 10 ** a;
}

let urlparams = new URLSearchParams(window.location.href.replace(window.location.origin + window.location.pathname, ""))

let values = {
    name: String(urlparams.get("n") || "YouTube Channel Name"),
    counts: {
        starting: Number(urlparams.get("c")) || 0,
        display: Math.round(Number(urlparams.get("c")) || 0),
        audit: Math.round(Number(urlparams.get("a")) || 0),
        rate: {
            min: Number(urlparams.get("mr")) || 0,
            max: Number(urlparams.get("xr")) || 0
        },
        abbreviated: Number(urlparams.get('ab')) || 0
    },
    allowNegative: Boolean(urlparams.get("an"))
}


let active = false;
const showGraph = urlparams.has('g') ? Number(urlparams.get('g')) || 0 : 1
let updateColors = false

if (showGraph) {
    chart = new Highcharts.chart({
        chart: {
            renderTo: 'chart',
            type: 'spline',
            zoomType: 'x',
            backgroundColor: 'transparent',
            plotBorderColor: 'transparent'
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            gridLineColor: '#999',
            labels: {
                style: {
                    color: '#999'
                }
            },
            lineColor: '#888',
            minorGridLineColor: '#999',
            tickColor: '#999',
            title: {
                style: {
                    color: '#999'
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            gridLineColor: '#999',
            lineColor: '#f66',
            minorGridLineColor: '#888',
            tickColor: '#999'
        },
        series: [{
            name: 'Subscribers',
            marker: {
                enabled: false
            },
        }]
    })
}

const ELEM = [document.getElementById("name"), document.getElementById("count"), document.getElementById("smallCounter"), document.getElementById("subs")]

window.onload = () => {
    if (values.counts.abbreviated) {
        values.counts.display = abbreviateCount(values.counts.starting)
    }
    ELEM[0].innerText = values.name
    ELEM[1].innerText = values.counts.display
    ELEM[2].innerText = goal(values.counts.display) - values.counts.display
}


function setName() {
    const newName = prompt("Enter a new channel name:")
    if (!newName) return;
    ELEM[0].innerText = newName
    values.name = newName
}

function toggleBox() {
    if (!ELEM[3].hidden) ELEM[3].hidden = true
    else ELEM[3].hidden = false
}

function setCount() {
    let newCount = parseInt(ELEM[3].value, 10)
    if (isNaN(newCount)) return;
    updateCount(newCount)
}

function abbreviateCount(n) {
    if (Math.abs(n) < 1000) return Math.round(n);
    let sign = Math.sign(n)
    n = Math.abs(n)
    let exponent = Math.floor(Math.log10(n))
    return sign * (Math.floor(n / (10 ** (exponent - 2))) * 10 ** (exponent - 2))
}

function updateCount(n) {
    if (typeof n !== "number") n = Number(n)
    if (isNaN(n)) return;
    if (n > Number.MAX_SAFE_INTEGER) n = Number.MAX_SAFE_INTEGER
    if (n < Number.MIN_SAFE_INTEGER) n = Number.MIN_SAFE_INTEGER
    if (n < 0 && !values.allowNegative) n = 0
    const oldCount = values.counts.display
    if (!n && !active) return;
    values.counts.starting = n
    if (values.counts.abbreviated) {
        values.counts.display = abbreviateCount(n)
    } else {
        values.counts.display = Math.round(n)
    }
    ELEM[1].innerText = values.counts.display
    ELEM[2].innerText = goal(values.counts.display) - values.counts.display
    active = true
    if (updateColors) {
        if (oldCount === values.counts.display) return;
        let newColor = '#4e4'
        if (oldCount >= values.counts.display) newColor = '#f33'
        ELEM[1].style.color = ag
        setTimeout(() => {
            ELEM[1].style.color = '#fff'
        }, 1000)
    }
}

document.addEventListener('keydown', getKeyBind)

function getKeyBind(k) {
    if (k.repeat || k.target !== document.querySelector('body')) return;
    let count = values.counts.starting;
    let keybinds = {
        '1': function() {
            updateCount(count + 1)
        },
        '2': function() {
            updateCount(count + 10)
        },
        '3': function() {
            updateCount(count + 100)
        },
        '4': function() {
            updateCount(count + 1e3)
        },
        '5': function() {
            updateCount(count + 1e6)
        },
        '6': function() {
            updateCount(count - 1)
        },
        '7': function() {
            updateCount(count - 10)
        },
        '8': function() {
            updateCount(count - 100)
        },
        '9': function() {
            updateCount(count - 1e3)
        },
        '0': function() {
            updateCount(count - 1e6)
        },
        'a': function() {
            if (values.counts.audit) {
                return updateCount(count + values.counts.audit)
            } else {
                let auditPrompt = Number(prompt('How many subs do you want they \'a\' key to audit?'));
                if (!auditPrompt) return;
                values.counts.audit = auditPrompt
            }
        },
        'b': function() {
            if (!values.counts.abbreviated) {
                values.counts.abbreviated = true;
                alert("Abbreviated counts have been enabled.");
                updateCount(values.counts.starting)
            } else {
                values.counts.abbreviated = false;
                alert("Abbreviated counts have been disabled.");
                updateCount(values.counts.starting)
            }
        },
        'c': function() {
            if (!ab) return;
            let clearGraphPrompt = confirm('Are you sure you want to clear the graph? This cannot be undone!');
            if (!clearGraphPrompt) return;
            for (const al of chart.series[0].points) {
                chart.series[0].removePoint(al)
            }
        },
        'h': function() {
            toggleBox();
            document.getElementById('links').hidden ? document.getElementById('links').hidden = false : document.getElementById('links').hidden = true
        },
        'n': function() {
            if (values.allowNegative) {
                values.allowNegative = false;
                alert('Negative counts have been disabled.')
            } else {
                values.allowNegative = true;
                alert('Negative counts have been enabled.')
            }
        },
        'r': function() {
            let resetPrompt = confirm('Are you sure you want to reset everything to zero? This cannot be undone!');
            if (!resetPrompt) return;
            active = false;
            for (const point of chart.series[0].points) {
                chart.series[0].removePoint(point)
            }
            updateCount(0);
            values.counts.rate.min = 0;
            values.counts.rate.max = 0
        },
        's': function() {
            let newMin = Number(prompt('What should the minimum gain rate per hour be?') || NaN);
            let newMax = Number(prompt('What should the maximum gain rate per hour be?') || NaN);
            if (isNaN(newMin) && isNaN(newMax)) return;
            active = true;
            if (!isNaN(newMin) && !isNaN(newMax)) {
                values.counts.rate.min = newMin;
                values.counts.rate.max = newMax
            } else {
                if (newMin) {
                    values.counts.rate.min = newMin;
                    values.counts.rate.max = newMin
                } else {
                    values.counts.rate.min = newMax;
                    values.counts.rate.max = newMax
                }
            }
        },
        'u': function() {
            if (!updateColors) {
                updateColors = true;
                alert('Colo(u)rs have been enabled on the counts.')
            } else {
                updateColors = false;
                alert('Colo(u)rs have been disabled on the counts.')
            }
        },
    }
    if (Object.keys(keybinds).includes(k.key)) keybinds[k.key]()
}

setInterval(() => {
    if (!showGraph) return;
    if (!active) return;
    let point = chart.series[0].addPoint([Date.now(), values.counts.display])
    setTimeout(() => {
        chart.series[0].removePoint(point)
    }, 3.6e6)
}, 5000)

setInterval(() => {
    let min = values.counts.rate.min / 1800
    let max = values.counts.rate.max / 1800
    if (!min && !max) return;
    let increment = min + (Math.random() * (max - min))
    updateCount(values.counts.starting + increment)
}, 2000)