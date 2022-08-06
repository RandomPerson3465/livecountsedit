var values = [];
var times = [];
let labels = false;
var useTimes = true;
var maxLabelsX = 5;
var maxLabelsY = 3;
var maxValues = 500;
let r = false;
var noDecimals = true;
const canvas = document.getElementById("canvas");
if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
}
const width = canvas.width;
const height = canvas.height;

function formatTime(time, includeSeconds) {
    let h = new Date(time).getHours();
    let m = new Date(time).getMinutes();
    let s = new Date(time).getSeconds();
    if (typeof h === "number" && h < 10) h = "0" + h.toString();
    if (typeof m === "number" && m < 10) m = "0" + m.toString();
    if (typeof s === "number" && s < 10) s = "0" + s.toString();
    h = h.toString();
    m = m.toString();
    s = s.toString();
    let formatted = h + ":" + m;
    if (includeSeconds) formatted = formatted + (":" + s);
    return formatted;
}

function addNext() {
    if (!submitted) {
        return;
    }
    values.push(nonNegOnly.checked && count < 0 ? 0 : count);
    times.push(Date.now());
    if (values.length > maxValues && removeOld.checked) {
        values = values.slice(values.length - maxValues);
        times = times.slice(values.length - maxValues);
    }
    let a = [];
    let b = [];
    for (var c = 0; c < maxLabelsX; c++) {
        a.push(Math.round(c * values.length / maxLabelsX));
    }
    var d = Math.max(...values) - Math.min(...values);
    if (!d) {
        d = 1;
        r = true;
    } else {
        r = false;
    }
    if (canvas.hidden) {
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var e = 0; e < maxLabelsY; e++) {
        if (labels) {
            b.push(e * d / maxLabelsY + Math.min(...values));
            const f = values.filter(g => g.toString() === Math.round(g).toString());
            if (noDecimals) {
                ctx.font = "20px Serif";
                ctx.textAlign = "right";
                ctx.fillStyle = night.checked ? "#fff" : "#000";
                ctx.fillText(Math.round(b[e]), width, height - e / maxLabelsY * height);
            } else {
                ctx.font = "20px Serif";
                ctx.textAlign = "right";
                ctx.fillStyle = night.checked ? "#fff" : "#000";
                ctx.fillText(b[e].toFixed(4), width, height - e / maxLabelsY * height);
            }
            ctx.beginPath();
            ctx.strokeStyle = night.checked ? "#7f7f7f" : "#4f4f4f";
            ctx.lineWidth = 1;
            ctx.moveTo(0, e / maxLabelsY * height);
            ctx.lineTo(width, e / maxLabelsY * height);
            ctx.stroke();
        }
    }
    ctx.strokeStyle = night.checked ? "#4babdb" : "#6b0a0a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, height - (values[0] - Math.min(...values)) * height / d);
    for (var h = 2; h <= values.length; h++) {
        if (values[h - 1] > Number.MAX_VALUE) {
            values[h - 1] = Number.MAX_VALUE;
        }
        if (values[h - 1] < -Number.MAX_VALUE) {
            values[h - 1] = -Number.MAX_VALUE;
        }
        if (isNaN(values[h - 1])) {
            values[h - 1] = 0;
        }
        ctx.lineTo((h - 1) / (values.length - 1) * width, height - (values[h - 1] - Math.min(...values)) * height / d);
        ctx.stroke();
        ctx.font = "20px Serif";
        ctx.textAlign = "center";
        ctx.fillStyle = night.checked ? "#fff" : "#000";
        if (labels) {
            if (values.length <= maxLabelsX || a.includes(h - 1)) {
                if (useTimes) {
                    ctx.fillText("" + formatTime(times[h - 1], false), (h - 1) / (values.length - 1) * width, height - 15, 50);
                } else {
                    ctx.fillText((h - 1).toString(), (h - 1) / (values.length - 1) * width, height - 15, 50);
                }
            }
            ctx.moveTo((h - 1) / (values.length - 1) * width, height - (values[h - 1] - Math.min(...values)) * height / d);
        }
    }
    ctx.font = "20px Serif";
    ctx.textAlign = "right";
    ctx.fillStyle = night.checked ? "#fff" : "#000";
    if (labels) {
        if (r) {
            ctx.fillText(Math.floor(Math.max(...values) + 1).toString(), width, 25);
        } else {
            ctx.fillText(Math.floor(Math.max(...values)).toString(), width, 25);
        }
        if (values.length > maxLabelsX) {
            for (var i = 1; i <= maxLabelsX; i++) {
                ctx.beginPath();
                ctx.strokeStyle = night.checked ? "#7f7f7f" : "#4f4f4f";
                ctx.lineWidth = 1;
                ctx.moveTo(a[i - 1] / (values.length - 1) * width, 0);
                ctx.lineTo(a[i - 1] / (values.length - 1) * width, height);
                ctx.stroke();
            }
        } else {
            for (var j = 2; j <= values.length; j++) {
                ctx.beginPath();
                ctx.strokeStyle = night.checked ? "#7f7f7f" : "#4f4f4f";
                ctx.lineWidth = 1;
                ctx.moveTo((j - 1) / (values.length - 1) * width, 0);
                ctx.lineTo((j - 1) / (values.length - 1) * width, height);
                ctx.stroke();
            }
        }
    }
}
setInterval(addNext, 2e3);