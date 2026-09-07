const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const analyzeBtn = document.getElementById("analyzeBtn");
const result = document.getElementById("result");

imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});

analyzeBtn.addEventListener("click", async function () {

    const file = imageInput.files[0];

    if (!file) {
        alert("Please select a terrain image first.");
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerText = "Analyzing...";

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        document.getElementById("prediction").innerText =
            data.prediction.toUpperCase();

        document.getElementById("confidence").innerText =
            "Confidence: " + data.confidence + "%";

        const risk = document.getElementById("risk");
        risk.innerText = "RISK LEVEL: " + data.risk_level;

        risk.className = "risk " + data.risk_level.toLowerCase();

        const warning = document.getElementById("warning");

        if (data.risk_level === "HIGH") {
            warning.innerText =
                "⚠ Immediate attention recommended. Potential hazardous terrain detected.";
        } else {
            warning.innerText =
                "✓ Continue monitoring the terrain conditions.";
        }

        result.style.display = "block";

    } catch (error) {
        alert("Could not connect to AI server. Make sure Flask is running on port 5000.");
        console.error(error);
    }

    analyzeBtn.disabled = false;
    analyzeBtn.innerText = "ANALYZE WITH AI";
});