const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const analyzeBtn = document.getElementById("analyzeBtn");

const result = document.getElementById("result");
const prediction = document.getElementById("prediction");
const confidence = document.getElementById("confidence");
const risk = document.getElementById("risk");
const warning = document.getElementById("warning");

// Show image preview
imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }

});

// Send image to Flask AI
analyzeBtn.addEventListener("click", async function () {

    const file = imageInput.files[0];

    if (!file) {
        alert("Please upload a terrain image first.");
        return;
    }

    analyzeBtn.innerText = "ANALYZING...";
    analyzeBtn.disabled = true;

    const formData = new FormData();
    formData.append("image", file);

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/predict",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Prediction failed");
        }

        result.style.display = "block";

        prediction.innerHTML =
            "Prediction: <strong>" +
            data.prediction +
            "</strong>";

        confidence.innerHTML =
            "Confidence: <strong>" +
            data.confidence +
            "%</strong>";

        risk.innerHTML =
            "Risk Level: <strong>" +
            data.risk_level +
            "</strong>";

        if (data.risk_level === "HIGH") {

            warning.innerHTML =
                "⚠️ HIGH RISK: Immediate attention recommended.";

        } else {

            warning.innerHTML =
                "⚠️ MEDIUM RISK: Continue monitoring the terrain.";

        }

    } catch (error) {

        alert(
            "AI analysis failed. Make sure Flask server is running."
        );

        console.error(error);

    }

    analyzeBtn.innerText = "ANALYZE WITH AI";
    analyzeBtn.disabled = false;

});
