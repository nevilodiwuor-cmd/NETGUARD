/* =========================================================
   NETGUARD - INFRASTRUCTURE MONITOR
   Grid Recovery + Connectivity + Reliability + Alerts
========================================================= */


/* =========================================================
   SYSTEM STATE
========================================================= */

let systemMode = "normal";

let temperature = 34;

let battery = 91;

let networkOnline = true;

let gridPower = true;

let networkQuality = 98;

let telemetryInterval = null;

let recoveryInterval = null;

let temperatureHistory = [34];

let timeHistory = ["Now"];

let temperatureWarningTriggered = false;

let batteryWarningTriggered = false;

const EARLY_WARNING_TEMP_RISE = 5;

const BATTERY_WARNING_LEVEL = 30;


/* =========================================================
   ALERT SYSTEM
========================================================= */

const TEMP_WARNING_LEVEL = 45;

const TEMP_CRITICAL_LEVEL = 55;

const RECOVERED_VISIBLE_MS = 2 * 60 * 1000;

const MAX_ALERT_HISTORY = 100;

let alerts = [];

let alertHistory = [];


/* =========================================================
   INCIDENT HISTORY
========================================================= */

const INCIDENT_STORAGE_KEY =
    "netguardIncidentHistory";

const MAX_INCIDENT_HISTORY = 50;

const INCIDENT_SEEN_KEY =
    "netguardIncidentLastSeen";

let incidentHistory = [];

const siteNameElement =
    document.querySelector(
        ".site-selector strong"
    );

const SITE_NAME =
    siteNameElement
        ? siteNameElement.textContent.trim()
        : "Mombasa-01";


/* =========================================================
   DOM
========================================================= */

const temperatureEl =
    document.getElementById("temperature");

const temperatureBar =
    document.getElementById("temperatureBar");

const temperatureStatus =
    document.getElementById("temperatureStatus");

const batteryLevel =
    document.getElementById("batteryLevel");

const batteryBar =
    document.getElementById("batteryBar");

const powerStatus =
    document.getElementById("powerStatus");

const powerMessage =
    document.getElementById("powerMessage");

const powerCondition =
    document.getElementById("powerCondition");

const networkStatus =
    document.getElementById("networkStatus");

const networkCondition =
    document.getElementById("networkCondition");

const networkBars =
    document.getElementById("networkBars");

const networkQualityEl =
    document.getElementById("networkQuality");

const networkQualityBar =
    document.getElementById("networkQualityBar");

const networkQualityMessage =
    document.getElementById("networkQualityMessage");

const networkImpact =
    document.getElementById("networkImpact");

const overallStatus =
    document.getElementById("overallStatus");

const overallMessage =
    document.getElementById("overallMessage");

const overallDot =
    document.getElementById("overallDot");

const healthScore =
    document.getElementById("healthScore");

const eventList =
    document.getElementById("eventList");

const clearEvents =
    document.getElementById("clearEvents");

const normalBtn =
    document.getElementById("normalBtn");

const powerBtn =
    document.getElementById("powerBtn");

const restoreGridBtn =
    document.getElementById("restoreGridBtn");

const heatBtn =
    document.getElementById("heatBtn");

const networkBtn =
    document.getElementById("networkBtn");


/* =========================================================
   RECOVERY DOM
========================================================= */

const recoveryStatus =
    document.getElementById("recoveryStatus");

const recoveryAction =
    document.getElementById("recoveryAction");

const recoveryDescription =
    document.getElementById("recoveryDescription");

const recoveryProgress =
    document.getElementById("recoveryProgress");

const recoveryProgressBar =
    document.getElementById("recoveryProgressBar");

const recommendedAction =
    document.getElementById("recommendedAction");

const recommendedDescription =
    document.getElementById("recommendedDescription");

const trendMessage =
    document.getElementById("trendMessage");

const temperatureChart =
    document.getElementById("temperatureChart");

const chartLine =
    document.getElementById("chartLine");


/* =========================================================
   RELIABILITY DOM
========================================================= */

const reliabilityRing =
    document.getElementById("reliabilityRing");

const reliabilityScore =
    document.getElementById("reliabilityScore");

const reliabilityLabel =
    document.getElementById("reliabilityLabel");

const reliabilityOverall =
    document.getElementById("reliabilityOverall");

const reliabilityUpdated =
    document.getElementById("reliabilityUpdated");

const relPowerValue =
    document.getElementById("relPowerValue");

const relPowerBar =
    document.getElementById("relPowerBar");

const relPowerDetail =
    document.getElementById("relPowerDetail");

const relBatteryValue =
    document.getElementById("relBatteryValue");

const relBatteryBar =
    document.getElementById("relBatteryBar");

const relBatteryDetail =
    document.getElementById("relBatteryDetail");

const relTemperatureValue =
    document.getElementById("relTemperatureValue");

const relTemperatureBar =
    document.getElementById("relTemperatureBar");

const relTemperatureDetail =
    document.getElementById("relTemperatureDetail");

const relNetworkValue =
    document.getElementById("relNetworkValue");

const relNetworkBar =
    document.getElementById("relNetworkBar");

const relNetworkDetail =
    document.getElementById("relNetworkDetail");

const relFaultsValue =
    document.getElementById("relFaultsValue");

const relFaultsBar =
    document.getElementById("relFaultsBar");

const relFaultsDetail =
    document.getElementById("relFaultsDetail");


/* =========================================================
   ALERT DOM
========================================================= */

const activeAlertCount =
    document.getElementById("activeAlertCount");

const criticalAlertCount =
    document.getElementById("criticalAlertCount");

const warningAlertCount =
    document.getElementById("warningAlertCount");

const recoveredAlertCount =
    document.getElementById("recoveredAlertCount");

const alertsList =
    document.getElementById("alertsList");

const navAlertBadge =
    document.getElementById("navAlertBadge");

const clearRecoveredAlerts =
    document.getElementById("clearRecoveredAlerts");


/* =========================================================
   INCIDENT DOM
========================================================= */

const historyTotalCount =
    document.getElementById("historyTotalCount");

const historyActiveCount =
    document.getElementById("historyActiveCount");

const historyRecoveredCount =
    document.getElementById("historyRecoveredCount");

const incidentHistoryList =
    document.getElementById("incidentHistoryList");

const clearHistory =
    document.getElementById("clearHistory");


/* =========================================================
   TIME
========================================================= */

function nowTime() {

    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}


function shortTime(timestamp) {

    if (!timestamp) {
        return "—";
    }

    return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}


function formatDuration(
    startTime,
    endTime = Date.now()
) {

    const seconds =
        Math.max(
            0,
            Math.floor(
                (endTime - startTime) / 1000
            )
        );

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;


    if (minutes < 60) {

        return `${String(minutes).padStart(2, "0")}m ${String(
            remainingSeconds
        ).padStart(2, "0")}s`;
    }


    const hours =
        Math.floor(minutes / 60);

    const remainingMinutes =
        minutes % 60;


    return `${String(hours).padStart(2, "0")}h ${String(
        remainingMinutes
    ).padStart(2, "0")}m`;
}


/* =========================================================
   STOP ALL INTERVALS
========================================================= */

function stopAllIntervals() {

    if (telemetryInterval) {

        clearInterval(telemetryInterval);

        telemetryInterval = null;
    }


    if (recoveryInterval) {

        clearInterval(recoveryInterval);

        recoveryInterval = null;
    }
}


/* =========================================================
   CONNECTIVITY
========================================================= */

function getConnectivityQuality() {

    if (
        !networkOnline ||
        networkQuality <= 0
    ) {

        return {
            score: 0,
            label: "OFFLINE",
            status: "OFFLINE",
            bars: 0,
            message: "Network connection unavailable",
            impact: "Severe impact"
        };
    }


    if (networkQuality >= 85) {

        return {
            score: networkQuality,
            label: "EXCELLENT",
            status: "ONLINE",
            bars: 4,
            message: "Strong and stable connection",
            impact: "Minimal impact"
        };
    }


    if (networkQuality >= 65) {

        return {
            score: networkQuality,
            label: "GOOD",
            status: "ONLINE",
            bars: 3,
            message: "Connection is stable",
            impact: "Low impact"
        };
    }


    if (networkQuality >= 40) {

        return {
            score: networkQuality,
            label: "DEGRADED",
            status: "DEGRADED",
            bars: 2,
            message: "Reduced network quality detected",
            impact: "Moderate impact"
        };
    }


    return {
        score: networkQuality,
        label: "POOR",
        status: "DEGRADED",
        bars: 1,
        message:
            "Poor network quality; customers may experience slower service",
        impact: "High impact"
    };
}


function updateNetwork() {

    const quality =
        getConnectivityQuality();


    networkStatus.textContent =
        quality.status;

    networkCondition.textContent =
        quality.label;

    networkQualityEl.textContent =
        `${Math.round(quality.score)}%`;

    networkQualityBar.style.width =
        `${quality.score}%`;

    networkQualityMessage.textContent =
        quality.message;

    networkImpact.textContent =
        quality.impact;


    let color = "var(--green)";


    if (
        quality.score < 85 &&
        quality.score >= 65
    ) {
        color = "var(--blue)";
    }


    if (
        quality.score < 65 &&
        quality.score >= 40
    ) {
        color = "var(--yellow)";
    }


    if (quality.score < 40) {
        color = "var(--red)";
    }


    networkQualityBar.style.background =
        color;


    networkImpact.style.background =
        "#edf9f3";

    networkImpact.style.color =
        "var(--green)";


    if (
        quality.score < 85 &&
        quality.score >= 65
    ) {

        networkImpact.style.background =
            "#edf3ff";

        networkImpact.style.color =
            "var(--blue)";
    }


    if (
        quality.score < 65 &&
        quality.score >= 40
    ) {

        networkImpact.style.background =
            "#fff8df";

        networkImpact.style.color =
            "#a56d00";
    }


    if (quality.score < 40) {

        networkImpact.style.background =
            "#fff0f0";

        networkImpact.style.color =
            "var(--red)";
    }


    const bars =
        networkBars.querySelectorAll("span");


    bars.forEach(
        (bar, index) => {

            bar.classList.remove(
                "active",
                "warning",
                "critical"
            );


            if (
                index < quality.bars
            ) {

                if (
                    quality.score >= 65
                ) {

                    bar.classList.add(
                        "active"
                    );

                }

                else if (
                    quality.score >= 40
                ) {

                    bar.classList.add(
                        "warning"
                    );

                }

                else {

                    bar.classList.add(
                        "critical"
                    );
                }
            }
        }
    );


    networkCondition.classList.remove(
        "warning",
        "critical"
    );


    if (
        quality.score < 65 &&
        quality.score >= 40
    ) {

        networkCondition.classList.add(
            "warning"
        );
    }


    if (quality.score < 40) {

        networkCondition.classList.add(
            "critical"
        );
    }
}


/* =========================================================
   RECOVERY PANEL
========================================================= */

function updateRecovery(
    status,
    action,
    description,
    progress,
    recommendation,
    recommendationDescription,
    type = "normal"
) {

    recoveryStatus.textContent =
        status;

    recoveryStatus.className =
        `recovery-badge ${type}`;

    recoveryAction.textContent =
        action;

    recoveryDescription.textContent =
        description;

    recoveryProgress.textContent =
        `${progress}%`;

    recoveryProgressBar.style.width =
        `${progress}%`;

    recommendedAction.textContent =
        recommendation;

    recommendedDescription.textContent =
        recommendationDescription;
}


/* =========================================================
   NORMAL
========================================================= */

function activateNormalMode() {

    stopAllIntervals();

    systemMode = "normal";

    temperature = 34;

    battery = 91;

    networkOnline = true;

    gridPower = true;

    networkQuality = 98;

    temperatureHistory = [34];

    timeHistory = ["Now"];

    temperatureWarningTriggered = false;

    batteryWarningTriggered = false;


    updateSystem();


    updateRecovery(
        "STANDBY",
        "System monitoring",
        "All infrastructure systems are operating normally.",
        100,
        "Continue monitoring",
        "No immediate intervention required.",
        "normal"
    );
}


/* =========================================================
   POWER FAILURE
========================================================= */

function activatePowerFailure() {

    stopAllIntervals();

    systemMode = "power";

    gridPower = false;

    networkOnline = true;

    temperature = 36;

    battery = 64;

    networkQuality = 88;

    temperatureWarningTriggered = false;

    batteryWarningTriggered = false;


    updateSystem();


    updateRecovery(
        "RESPONDING",
        "Backup power activated",
        "Grid power has failed. NetGuard automatically switched the site to backup battery power.",
        65,
        "Restore grid power",
        "Restore the grid before backup capacity becomes critical.",
        "warning"
    );


    addEvent(
        "Grid power failure detected — backup activated",
        "warning"
    );


    telemetryInterval =
        setInterval(() => {

            battery =
                Math.max(
                    0,
                    battery - 1
                );


            if (temperature < 40) {
                temperature += 0.3;
            }


            const batteryLoss =
                Math.max(
                    0,
                    64 - battery
                );


            networkQuality =
                Math.max(
                    45,
                    Math.round(
                        88 -
                        batteryLoss * 0.9
                    )
                );


            updateSystem();


            const progress =
                Math.max(
                    10,
                    Math.round(
                        (battery / 64) * 65
                    )
                );


            updateRecovery(
                battery <= 30
                    ? "CRITICAL"
                    : "RESPONDING",

                battery <= 30
                    ? "Protecting network availability"
                    : "Running on backup power",

                battery <= 30
                    ? "Backup battery reserve is becoming critical. Network quality is being affected."
                    : "The site is operating on backup battery while grid power is unavailable.",

                progress,

                battery <= 30
                    ? "Restore grid power immediately"
                    : "Restore grid power",

                battery <= 30
                    ? "Restore the grid before the battery reaches critical level."
                    : "Restore grid power to recharge the battery and stabilize the site.",

                battery <= 30
                    ? "critical"
                    : "warning"
            );


            if (battery <= 0) {

                stopAllIntervals();

                networkQuality = 0;

                networkOnline = false;

                updateSystem();


                updateRecovery(
                    "CRITICAL",
                    "Network service lost",
                    "Backup battery has been depleted and network connectivity is unavailable.",
                    0,
                    "Restore grid power immediately",
                    "Power restoration is required to recover network service.",
                    "critical"
                );


                addEvent(
                    "Backup battery depleted — network offline",
                    "critical"
                );
            }

        }, 2000);
}


/* =========================================================
   RESTORE GRID POWER
========================================================= */

function restoreGridPower() {

    if (
        gridPower &&
        systemMode === "normal"
    ) {

        addEvent(
            "Grid power is already available",
            "success"
        );

        return;
    }


    stopAllIntervals();

    systemMode = "grid-recovery";

    gridPower = true;

    networkOnline = true;


    updateSystem();


    updateRecovery(
        "RECOVERING",
        "Grid power restored",
        "Grid power has returned. Battery recharge and network recovery are in progress.",
        35,
        "Monitor recovery",
        "Allow the battery and connectivity systems to stabilize.",
        "warning"
    );


    addEvent(
        "Grid power restored — recovery started",
        "success"
    );


    recoveryInterval =
        setInterval(() => {

            battery =
                Math.min(
                    91,
                    battery + 2
                );


            networkQuality =
                Math.min(
                    98,
                    networkQuality + 5
                );


            if (networkQuality > 0) {
                networkOnline = true;
            }


            updateSystem();


            const batteryProgress =
                Math.round(
                    (battery / 91) * 100
                );


            const networkProgress =
                Math.round(
                    (networkQuality / 98) * 100
                );


            const progress =
                Math.round(
                    (
                        batteryProgress +
                        networkProgress
                    ) / 2
                );


            updateRecovery(
                battery >= 91 &&
                networkQuality >= 98
                    ? "RECOVERED"
                    : "RECOVERING",

                battery >= 91 &&
                networkQuality >= 98
                    ? "Recovery complete"
                    : "Recharging backup system",

                battery >= 91 &&
                networkQuality >= 98
                    ? "Grid power is stable and network connectivity has returned to normal."
                    : "Grid power is available while NetGuard restores battery reserve and network quality.",

                progress,

                battery >= 91 &&
                networkQuality >= 98
                    ? "Continue monitoring"
                    : "Monitor recovery",

                battery >= 91 &&
                networkQuality >= 98
                    ? "Infrastructure is operating normally."
                    : "Allow the backup battery and network quality to fully recover.",

                battery >= 91 &&
                networkQuality >= 98
                    ? "normal"
                    : "warning"
            );


            if (
                battery >= 91 &&
                networkQuality >= 98
            ) {

                stopAllIntervals();

                systemMode = "normal";

                battery = 91;

                networkQuality = 98;

                networkOnline = true;

                gridPower = true;


                updateSystem();


                updateRecovery(
                    "RECOVERED",
                    "System fully restored",
                    "Grid power, battery reserve and customer connectivity have returned to normal.",
                    100,
                    "Continue monitoring",
                    "No immediate intervention required.",
                    "normal"
                );


                addEvent(
                    "Full system recovery completed",
                    "success"
                );
            }

        }, 1500);
}


/* =========================================================
   OVERHEATING
========================================================= */

function activateOverheating() {

    stopAllIntervals();

    systemMode = "heat";

    gridPower = true;

    networkOnline = true;

    temperature = 34;

    battery = 86;

    networkQuality = 96;

    temperatureWarningTriggered = false;

    batteryWarningTriggered = false;


    updateSystem();


    updateRecovery(
        "MONITORING",
        "Thermal protection active",
        "Equipment temperature is increasing. NetGuard is monitoring the site.",
        45,
        "Monitor temperature",
        "Reduce thermal load and inspect cooling equipment if temperature continues rising.",
        "warning"
    );


    addEvent(
        "Temperature rise detected",
        "warning"
    );


    telemetryInterval =
        setInterval(() => {

            temperature += 2;


            networkQuality =
                Math.max(
                    25,
                    Math.round(
                        96 -
                        (temperature - 34) * 2.8
                    )
                );


            if (temperature >= 55) {

                networkQuality =
                    Math.min(
                        networkQuality,
                        35
                    );
            }


            updateSystem();


            const progress =
                Math.max(
                    5,
                    Math.round(
                        100 -
                        ((temperature - 34) / 24) * 100
                    )
                );


            updateRecovery(
                temperature >= 55
                    ? "CRITICAL"
                    : "MONITORING",

                temperature >= 55
                    ? "Thermal protection required"
                    : "Monitoring equipment temperature",

                temperature >= 55
                    ? "Critical temperature has been reached and connectivity quality is being affected."
                    : "Temperature is rising and NetGuard is monitoring the equipment continuously.",

                progress,

                temperature >= 55
                    ? "Inspect cooling system"
                    : "Monitor temperature",

                temperature >= 55
                    ? "Immediate thermal inspection is recommended to protect network equipment."
                    : "Continue monitoring temperature and cooling performance.",

                temperature >= 55
                    ? "critical"
                    : "warning"
            );


            if (temperature >= 58) {

                stopAllIntervals();

                addEvent(
                    "Critical overheating detected",
                    "critical"
                );
            }

        }, 1500);
}


/* =========================================================
   NETWORK FAILURE
========================================================= */

function activateNetworkFailure() {

    stopAllIntervals();

    systemMode = "network";

    gridPower = true;

    networkOnline = false;

    networkQuality = 0;

    temperature = 38;

    battery = 84;

    temperatureWarningTriggered = false;

    batteryWarningTriggered = false;


    updateSystem();


    updateRecovery(
        "CRITICAL",
        "Network service interrupted",
        "The monitored site has lost network connectivity.",
        20,
        "Inspect network equipment",
        "Check transmission equipment, fiber/backhaul links and network power systems.",
        "critical"
    );


    addEvent(
        "Network connectivity failure detected",
        "critical"
    );
}


/* =========================================================
   TEMPERATURE
========================================================= */

function updateTemperature() {

    temperatureEl.textContent =
        `${temperature.toFixed(
            temperature % 1 === 0 ? 0 : 1
        )}°C`;


    const percentage =
        Math.min(
            100,
            Math.max(
                0,
                ((temperature - 30) / 30) * 100
            )
        );


    temperatureBar.style.width =
        `${percentage}%`;

    temperatureBar.style.background =
        "var(--green)";


    temperatureStatus.className = "";


    if (
        temperature >=
        TEMP_CRITICAL_LEVEL
    ) {

        temperatureStatus.textContent =
            "CRITICAL";

        temperatureStatus.classList.add(
            "critical"
        );

        temperatureBar.style.background =
            "var(--red)";

        trendMessage.textContent =
            "Critical temperature detected";
    }

    else if (
        temperature >=
        TEMP_WARNING_LEVEL
    ) {

        temperatureStatus.textContent =
            "WARNING";

        temperatureStatus.classList.add(
            "warning"
        );

        temperatureBar.style.background =
            "var(--yellow)";

        trendMessage.textContent =
            "Temperature above warning threshold";
    }

    else {

        temperatureStatus.textContent =
            "NORMAL";

        trendMessage.textContent =
            "Temperature stable";
    }
}


/* =========================================================
   POWER
========================================================= */

function updatePower() {

    batteryLevel.textContent =
        `${battery}%`;

    batteryBar.style.width =
        `${battery}%`;


    if (!gridPower) {

        powerStatus.textContent =
            "BACKUP";

        powerMessage.textContent =
            "Grid power unavailable";


        if (battery <= 10) {

            powerCondition.textContent =
                "CRITICAL";

            powerCondition.className =
                "critical";

            batteryBar.style.background =
                "var(--red)";
        }

        else if (
            battery <=
            BATTERY_WARNING_LEVEL
        ) {

            powerCondition.textContent =
                "WARNING";

            powerCondition.className =
                "warning";

            batteryBar.style.background =
                "var(--yellow)";
        }

        else {

            powerCondition.textContent =
                "BACKUP";

            powerCondition.className = "";

            batteryBar.style.background =
                "var(--blue)";
        }

        return;
    }


    if (
        systemMode ===
        "grid-recovery"
    ) {

        powerStatus.textContent =
            "RESTORING";

        powerMessage.textContent =
            "Grid restored · Battery charging";

        powerCondition.textContent =
            "RECOVERING";

        powerCondition.className =
            "warning";

        batteryBar.style.background =
            "var(--blue)";

        return;
    }


    powerStatus.textContent =
        "ONLINE";

    powerMessage.textContent =
        "Grid power available";

    powerCondition.textContent =
        "NORMAL";

    powerCondition.className = "";

    batteryBar.style.background =
        "var(--green)";
}


/* =========================================================
   OVERALL STATUS
========================================================= */

function updateOverallStatus() {

    let status = "NORMAL";

    let message =
        "All monitored systems are operating normally.";

    let color =
        "var(--green)";


    if (
        temperature >=
        TEMP_CRITICAL_LEVEL ||
        !networkOnline
    ) {

        status = "CRITICAL";

        if (!networkOnline) {

            message =
                "Network connectivity is unavailable.";

        }

        else {

            message =
                "Critical infrastructure condition detected.";
        }

        color =
            "var(--red)";
    }

    else if (
        temperature >= TEMP_WARNING_LEVEL ||
        !gridPower ||
        networkQuality < 65 ||
        systemMode === "grid-recovery"
    ) {

        status = "WARNING";


        if (!gridPower) {

            message =
                "Grid power is unavailable. Backup power is active.";

        }

        else if (
            systemMode ===
            "grid-recovery"
        ) {

            message =
                "Grid power restored. Infrastructure recovery is in progress.";

        }

        else if (
            networkQuality < 65
        ) {

            message =
                "Network connectivity quality has degraded.";

        }

        else {

            message =
                "Infrastructure conditions require attention.";
        }

        color =
            "var(--yellow)";
    }


    overallStatus.textContent =
        status;

    overallMessage.textContent =
        message;

    overallDot.style.background =
        color;
}


/* =========================================================
   TEMPERATURE HISTORY
========================================================= */

function recordTemperature() {

    temperatureHistory.push(
        Number(
            temperature.toFixed(1)
        )
    );

    timeHistory.push(
        nowTime()
    );


    if (
        temperatureHistory.length >
        20
    ) {

        temperatureHistory.shift();

        timeHistory.shift();
    }


    drawTemperatureChart();
}


/* =========================================================
   DRAW CHART
========================================================= */

function drawTemperatureChart() {

    const width =
        temperatureChart.clientWidth;

    const height =
        temperatureChart.clientHeight;


    if (
        !width ||
        !height
    ) {
        return;
    }


    let svg =
        chartLine.querySelector("svg");


    if (!svg) {

        svg =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );

        svg.classList.add(
            "chart-svg"
        );

        chartLine.appendChild(svg);
    }


    svg.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );


    svg.innerHTML = "";


    const points =
        temperatureHistory
            .map(
                (value, index) => {

                    const x =
                        temperatureHistory.length === 1
                            ? width / 2
                            : (
                                index /
                                (
                                    temperatureHistory.length - 1
                                )
                            ) * width;


                    const clamped =
                        Math.min(
                            60,
                            Math.max(
                                30,
                                value
                            )
                        );


                    const y =
                        height -
                        (
                            (clamped - 30) /
                            30
                        ) * height;


                    return `${x},${y}`;
                }
            )
            .join(" ");


    const polyline =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "polyline"
        );


    polyline.setAttribute(
        "points",
        points
    );


    polyline.classList.add(
        "chart-polyline"
    );


    svg.appendChild(
        polyline
    );


    temperatureHistory.forEach(
        (value, index) => {

            const x =
                temperatureHistory.length === 1
                    ? width / 2
                    : (
                        index /
                        (
                            temperatureHistory.length - 1
                        )
                    ) * width;


            const clamped =
                Math.min(
                    60,
                    Math.max(
                        30,
                        value
                    )
                );


            const y =
                height -
                (
                    (clamped - 30) /
                    30
                ) * height;


            const circle =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "circle"
                );


            circle.setAttribute(
                "cx",
                x
            );

            circle.setAttribute(
                "cy",
                y
            );

            circle.setAttribute(
                "r",
                3
            );

            circle.classList.add(
                "chart-point"
            );


            if (value >= 55) {

                circle.style.stroke =
                    "var(--red)";

            }

            else if (value >= 45) {

                circle.style.stroke =
                    "var(--yellow)";
            }


            svg.appendChild(
                circle
            );
        }
    );
}


/* =========================================================
   EARLY WARNINGS
========================================================= */

function checkEarlyWarnings() {

    if (
        temperatureHistory.length >= 4 &&
        temperature < TEMP_WARNING_LEVEL
    ) {

        const recent =
            temperatureHistory.slice(-4);

        const rise =
            recent[recent.length - 1] -
            recent[0];


        if (
            rise >=
            EARLY_WARNING_TEMP_RISE &&
            !temperatureWarningTriggered
        ) {

            temperatureWarningTriggered = true;

            addEvent(
                "Early temperature warning",
                "warning"
            );
        }
    }


    if (
        !gridPower &&
        battery <= BATTERY_WARNING_LEVEL &&
        !batteryWarningTriggered
    ) {

        batteryWarningTriggered = true;

        addEvent(
            "Low backup battery warning",
            "warning"
        );
    }
}


/* =========================================================
   UPDATE SYSTEM
========================================================= */

function updateSystem() {

    updateTemperature();

    updatePower();

    updateNetwork();

    updateOverallStatus();

    recordTemperature();

    checkEarlyWarnings();

    syncAlerts();

    syncIncidentHistory();

    updateReliability();
}


/* =========================================================
   EVENTS
========================================================= */

function addEvent(
    message,
    type = "success"
) {

    const event =
        document.createElement(
            "div"
        );

    event.className =
        "event";


    const icon =
        document.createElement(
            "span"
        );

    icon.className =
        `event-icon ${type}`;

    icon.textContent =
        type === "success"
            ? "✓"
            : type === "warning"
                ? "!"
                : "×";


    const content =
        document.createElement(
            "div"
        );


    const title =
        document.createElement(
            "strong"
        );

    title.textContent =
        message;


    const time =
        document.createElement(
            "small"
        );

    time.textContent =
        "Just now";


    content.appendChild(
        title
    );

    content.appendChild(
        time
    );

    event.appendChild(
        icon
    );

    event.appendChild(
        content
    );


    eventList.prepend(
        event
    );


    while (
        eventList.children.length >
        12
    ) {

        eventList.removeChild(
            eventList.lastElementChild
        );
    }
}


clearEvents.addEventListener(
    "click",
    () => {

        eventList.innerHTML = "";

        addEvent(
            "Event history cleared",
            "success"
        );
    }
);


/* =========================================================
   CURRENT FAULTS
========================================================= */

function getCurrentFaults() {

    const faults = [];


    if (!gridPower) {

        faults.push({

            key: "power",

            title:
                "Grid Power Failure",

            severity:
                "critical",

            description:
                "Grid power is unavailable and the site is operating on backup power.",

            action:
                "Restore grid power and monitor backup battery."
        });
    }


    if (
        !gridPower &&
        battery <= BATTERY_WARNING_LEVEL
    ) {

        faults.push({

            key: "battery",

            title:
                "Low Backup Battery",

            severity:
                battery <= 10
                    ? "critical"
                    : "warning",

            description:
                `Backup battery is at ${battery}% capacity.`,

            action:
                "Restore grid power before the battery is depleted."
        });
    }


    if (
        temperature >=
        TEMP_CRITICAL_LEVEL
    ) {

        faults.push({

            key:
                "temperature",

            title:
                "Critical Equipment Temperature",

            severity:
                "critical",

            description:
                `Equipment temperature has reached ${temperature.toFixed(1)}°C.`,

            action:
                "Inspect cooling equipment and reduce thermal load."
        });

    }

    else if (
        temperature >=
        TEMP_WARNING_LEVEL
    ) {

        faults.push({

            key:
                "temperature",

            title:
                "High Equipment Temperature",

            severity:
                "warning",

            description:
                `Equipment temperature is ${temperature.toFixed(1)}°C.`,

            action:
                "Monitor temperature and inspect cooling if it continues rising."
        });
    }


    if (!networkOnline) {

        faults.push({

            key:
                "network",

            title:
                "Network Connectivity Failure",

            severity:
                "critical",

            description:
                "The monitored site has lost network connectivity.",

            action:
                "Inspect transmission, backhaul and network equipment."
        });
    }


    return faults;
}


/* =========================================================
   ALERT SYNC
========================================================= */

function syncAlerts() {

    const faults =
        getCurrentFaults();


    const currentKeys =
        faults.map(
            fault =>
                fault.key
        );


    faults.forEach(
        fault => {

            const existing =
                alerts.find(
                    alert =>
                        alert.key ===
                        fault.key
                );


            if (!existing) {

                alerts.push({

                    id:
                        Date.now() +
                        Math.random(),

                    key:
                        fault.key,

                    title:
                        fault.title,

                    severity:
                        fault.severity,

                    description:
                        fault.description,

                    action:
                        fault.action,

                    site:
                        SITE_NAME,

                    detectedAt:
                        Date.now(),

                    status:
                        "ACTIVE"
                });

            }

            else {

                existing.title =
                    fault.title;

                existing.severity =
                    fault.severity;

                existing.description =
                    fault.description;

                existing.action =
                    fault.action;


                if (
                    existing.status ===
                    "RECOVERED"
                ) {

                    existing.status =
                        "ACTIVE";

                    existing.detectedAt =
                        Date.now();

                    delete existing.recoveredAt;
                }
            }
        }
    );


    alerts.forEach(
        alert => {

            if (
                alert.status ===
                    "ACTIVE" &&
                !currentKeys.includes(
                    alert.key
                )
            ) {

                alert.status =
                    "RECOVERED";

                alert.recoveredAt =
                    Date.now();

                alertHistory.unshift({
                    ...alert
                });
            }
        }
    );


    alerts =
        alerts.filter(
            alert => {

                if (
                    alert.status !==
                    "RECOVERED"
                ) {

                    return true;
                }

                return (
                    Date.now() -
                    alert.recoveredAt
                ) <
                RECOVERED_VISIBLE_MS;
            }
        );


    alertHistory =
        alertHistory.slice(
            0,
            MAX_ALERT_HISTORY
        );


    renderAlerts();
}


/* =========================================================
   RENDER ALERTS
========================================================= */

function renderAlerts() {

    const active =
        alerts.filter(
            alert =>
                alert.status ===
                "ACTIVE"
        );


    const recovered =
        alerts.filter(
            alert =>
                alert.status ===
                "RECOVERED"
        );


    const critical =
        active.filter(
            alert =>
                alert.severity ===
                "critical"
        ).length;


    const warning =
        active.filter(
            alert =>
                alert.severity ===
                "warning"
        ).length;


    activeAlertCount.textContent =
        active.length;

    criticalAlertCount.textContent =
        critical;

    warningAlertCount.textContent =
        warning;

    recoveredAlertCount.textContent =
        recovered.length;


    navAlertBadge.textContent =
        active.length;

    navAlertBadge.hidden =
        active.length === 0;


    alertsList.innerHTML = "";


    const displayAlerts =
        [
            ...active,
            ...recovered
        ].sort(
            (a, b) => {

                const rank = alert => {

                    if (
                        alert.status ===
                        "RECOVERED"
                    ) {
                        return 2;
                    }

                    return alert.severity ===
                        "critical"
                        ? 0
                        : 1;
                };


                const difference =
                    rank(a) - rank(b);


                if (difference !== 0) {
                    return difference;
                }

                return (
                    b.detectedAt -
                    a.detectedAt
                );
            }
        );


    if (
        !displayAlerts.length
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "alert-empty";

        empty.textContent =
            "No active alerts. All monitored systems are operating normally.";

        alertsList.appendChild(
            empty
        );

        return;
    }


    displayAlerts.forEach(
        alert => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                `alert-item ${
                    alert.status === "RECOVERED"
                        ? "recovered"
                        : alert.severity
                }`;


            const icon =
                document.createElement(
                    "div"
                );


            icon.className =
                `alert-icon ${
                    alert.status === "RECOVERED"
                        ? "recovered"
                        : alert.severity
                }`;


            icon.textContent =
                alert.status === "RECOVERED"
                    ? "✓"
                    : alert.severity ===
                      "critical"
                        ? "!"
                        : "•";


            const main =
                document.createElement(
                    "div"
                );

            main.className =
                "alert-main";


            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                alert.title;


            const description =
                document.createElement(
                    "p"
                );

            description.textContent =
                alert.description;


            const action =
                document.createElement(
                    "p"
                );

            action.textContent =
                `Recommended: ${alert.action}`;


            main.appendChild(
                title
            );

            main.appendChild(
                description
            );

            main.appendChild(
                action
            );


            const meta =
                document.createElement(
                    "div"
                );

            meta.className =
                "alert-meta";


            const severity =
                document.createElement(
                    "span"
                );


            severity.className =
                `alert-severity ${
                    alert.status === "RECOVERED"
                        ? "recovered"
                        : alert.severity
                }`;


            severity.textContent =
                alert.status ===
                "RECOVERED"
                    ? "RECOVERED"
                    : alert.severity.toUpperCase();


            const time =
                document.createElement(
                    "span"
                );

            time.className =
                "alert-time";


            time.textContent =
                alert.status ===
                "RECOVERED"
                    ? `Recovered ${shortTime(
                        alert.recoveredAt
                    )}`
                    : `Detected ${shortTime(
                        alert.detectedAt
                    )}`;


            meta.appendChild(
                severity
            );

            meta.appendChild(
                time
            );


            item.appendChild(
                icon
            );

            item.appendChild(
                main
            );

            item.appendChild(
                meta
            );


            alertsList.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   CLEAR RECOVERED ALERTS
========================================================= */

clearRecoveredAlerts.addEventListener(
    "click",
    () => {

        alerts =
            alerts.filter(
                alert =>
                    alert.status ===
                    "ACTIVE"
            );

        renderAlerts();
    }
);


/* =========================================================
   RELIABILITY
========================================================= */

function getPowerScore() {

    if (gridPower) {

        return {
            score: 100,
            detail:
                systemMode ===
                "grid-recovery"
                    ? "Grid restored · recovering"
                    : "Grid power normal"
        };
    }


    if (battery > 0) {

        return {
            score: 70,
            detail:
                `Backup power · ${battery}% battery`
        };
    }


    return {
        score: 20,
        detail:
            "No backup power available"
    };
}


function getBatteryScore() {

    if (battery >= 90) return 100;

    if (battery >= 70) return 90;

    if (battery >= 50) return 75;

    if (battery >= 30) return 55;

    if (battery >= 10) return 30;

    return 10;
}


function getTemperatureScore() {

    if (
        temperature >=
        TEMP_CRITICAL_LEVEL
    ) {
        return 20;
    }

    if (
        temperature >=
        TEMP_WARNING_LEVEL
    ) {
        return 60;
    }

    return 100;
}


function getNetworkScore() {

    const quality =
        getConnectivityQuality();


    if (!networkOnline) {

        return {
            score: 10,
            detail: "Offline"
        };
    }


    const q =
        Math.max(
            0,
            Math.min(
                100,
                networkQuality
            )
        );


    let score;


    if (q >= 85) {

        score = 100;

    }

    else if (q >= 65) {

        score = 80;

    }

    else if (q >= 40) {

        score = 55;

    }

    else {

        score = 30;
    }


    return {

        score,

        detail:
            `${Math.round(q)}% · ${quality.label}`
    };
}


function getFaultScore() {

    const faults =
        getCurrentFaults();


    if (!faults.length) {

        return {
            score: 100,
            detail:
                "No active faults"
        };
    }


    const critical =
        faults.filter(
            fault =>
                fault.severity ===
                "critical"
        ).length;


    const warning =
        faults.filter(
            fault =>
                fault.severity ===
                "warning"
        ).length;


    if (critical >= 2) {

        return {
            score: 20,
            detail:
                `${critical} critical faults`
        };
    }


    if (critical === 1) {

        return {
            score: 35,
            detail:
                "1 critical fault"
        };
    }


    if (warning >= 2) {

        return {
            score: 55,
            detail:
                `${warning} warnings`
        };
    }


    return {
        score: 75,
        detail:
            `${warning} warning`
    };
}


function reliabilityBand(score) {

    if (score >= 90) {

        return {
            label: "Excellent",
            className: "excellent"
        };
    }


    if (score >= 75) {

        return {
            label: "Good",
            className: "good"
        };
    }


    if (score >= 50) {

        return {
            label: "Warning",
            className: "warning"
        };
    }


    return {
        label: "Critical",
        className: "critical"
    };
}


function setReliabilityBar(
    element,
    score
) {

    element.style.width =
        `${score}%`;

    element.className =
        "reliability-bar-fill " +
        reliabilityBand(score).className;
}


function updateReliability() {

    const power =
        getPowerScore();

    const batteryScore =
        getBatteryScore();

    const temp =
        getTemperatureScore();

    const network =
        getNetworkScore();

    const faults =
        getFaultScore();


    const overall =
        Math.round(
            (
                power.score +
                batteryScore +
                temp +
                network.score +
                faults.score
            ) / 5
        );


    const band =
        reliabilityBand(
            overall
        );


    healthScore.textContent =
        `${overall}%`;

    reliabilityScore.textContent =
        `${overall}%`;

    reliabilityOverall.textContent =
        `${overall}%`;

    reliabilityLabel.textContent =
        band.label;


    reliabilityRing.className =
        `reliability-ring ${band.className}`;


    reliabilityRing.style.setProperty(
        "--score",
        overall
    );


    relPowerValue.textContent =
        `${power.score}%`;

    relPowerDetail.textContent =
        power.detail;

    setReliabilityBar(
        relPowerBar,
        power.score
    );


    relBatteryValue.textContent =
        `${batteryScore}%`;

    relBatteryDetail.textContent =
        `${battery}% charge`;

    setReliabilityBar(
        relBatteryBar,
        batteryScore
    );


    relTemperatureValue.textContent =
        `${temp}%`;

    relTemperatureDetail.textContent =
        `${temperature.toFixed(1)}°C · ${
            temperature >= 55
                ? "Critical"
                : temperature >= 45
                    ? "Warning"
                    : "Normal"
        }`;


    setReliabilityBar(
        relTemperatureBar,
        temp
    );


    relNetworkValue.textContent =
        `${network.score}%`;

    relNetworkDetail.textContent =
        network.detail;

    setReliabilityBar(
        relNetworkBar,
        network.score
    );


    relFaultsValue.textContent =
        `${faults.score}%`;

    relFaultsDetail.textContent =
        faults.detail;

    setReliabilityBar(
        relFaultsBar,
        faults.score
    );


    reliabilityUpdated.textContent =
        `Last updated: ${nowTime()}`;
}


/* =========================================================
   INCIDENT HISTORY
========================================================= */

function saveLastSeen() {

    try {

        localStorage.setItem(
            INCIDENT_SEEN_KEY,
            String(Date.now())
        );

    }

    catch (error) {

        /* storage unavailable */
    }
}


function saveIncidentHistory() {

    try {

        localStorage.setItem(
            INCIDENT_STORAGE_KEY,
            JSON.stringify(
                incidentHistory
            )
        );

        saveLastSeen();

    }

    catch (error) {

        console.error(
            "Unable to save incident history:",
            error
        );
    }
}


function loadIncidentHistory() {

    try {

        const saved =
            localStorage.getItem(
                INCIDENT_STORAGE_KEY
            );


        if (!saved) {

            incidentHistory = [];

            return;
        }


        incidentHistory =
            JSON.parse(saved);


        if (
            !Array.isArray(
                incidentHistory
            )
        ) {

            incidentHistory = [];
        }


        incidentHistory =
            incidentHistory
                .slice(
                    0,
                    MAX_INCIDENT_HISTORY
                )
                .map(
                    incident => {

                        incident.startTime =
                            Number(
                                incident.startTime
                            );


                        if (
                            incident.endTime
                        ) {

                            incident.endTime =
                                Number(
                                    incident.endTime
                                );
                        }


                        return incident;
                    }
                );


        /* Incidents left ACTIVE by a closed page are ended
           at the last time the page was seen running, so
           the closed time is not counted as duration. */

        let lastSeen =
            Number(
                localStorage.getItem(
                    INCIDENT_SEEN_KEY
                )
            );

        let closedStale = false;

        incidentHistory.forEach(
            incident => {

                if (
                    incident.status ===
                    "ACTIVE"
                ) {

                    incident.status =
                        "RECOVERED";

                    incident.endTime =
                        Math.max(
                            incident.startTime,
                            lastSeen || 0
                        );

                    closedStale = true;
                }
            }
        );

        if (closedStale) {

            saveIncidentHistory();
        }

    }

    catch (error) {

        console.error(
            "Unable to load incident history:",
            error
        );

        incidentHistory = [];
    }
}


function createIncident(
    fault
) {

    return {

        id:
            Date.now() +
            Math.random(),

        key:
            fault.key,

        title:
            fault.title,

        site:
            SITE_NAME,

        severity:
            fault.severity,

        description:
            fault.description,

        startTime:
            Date.now(),

        endTime:
            null,

        status:
            "ACTIVE"
    };
}


function getActiveIncident(
    key
) {

    return incidentHistory.find(
        incident =>
            incident.key === key &&
            incident.status ===
                "ACTIVE"
    );
}


function syncIncidentHistory() {

    const faults =
        getCurrentFaults();


    const currentKeys =
        faults.map(
            fault =>
                fault.key
        );


    let changed = false;


    faults.forEach(
        fault => {

            const existing =
                getActiveIncident(
                    fault.key
                );


            if (!existing) {

                incidentHistory.unshift(
                    createIncident(
                        fault
                    )
                );

                changed = true;

                return;
            }


            if (
                existing.title !==
                    fault.title ||
                existing.severity !==
                    fault.severity ||
                existing.description !==
                    fault.description
            ) {

                existing.title =
                    fault.title;

                existing.severity =
                    fault.severity;

                existing.description =
                    fault.description;

                changed = true;
            }
        }
    );


    incidentHistory.forEach(
        incident => {

            if (
                incident.status ===
                    "ACTIVE" &&
                !currentKeys.includes(
                    incident.key
                )
            ) {

                incident.status =
                    "RECOVERED";

                incident.endTime =
                    Date.now();

                changed = true;
            }
        }
    );


    incidentHistory =
        incidentHistory
            .sort(
                (a, b) =>
                    b.startTime -
                    a.startTime
            )
            .slice(
                0,
                MAX_INCIDENT_HISTORY
            );


    if (changed) {

        saveIncidentHistory();
    }


    renderIncidentHistory();
}


function renderIncidentHistory() {

    const total =
        incidentHistory.length;


    const active =
        incidentHistory.filter(
            incident =>
                incident.status ===
                "ACTIVE"
        ).length;


    const recovered =
        incidentHistory.filter(
            incident =>
                incident.status ===
                "RECOVERED"
        ).length;


    historyTotalCount.textContent =
        total;

    historyActiveCount.textContent =
        active;

    historyRecoveredCount.textContent =
        recovered;


    incidentHistoryList.innerHTML =
        "";


    if (
        !incidentHistory.length
    ) {

        const row =
            document.createElement(
                "tr"
            );


        const cell =
            document.createElement(
                "td"
            );


        cell.colSpan = 6;

        cell.className =
            "incident-empty-cell";

        cell.textContent =
            "No incidents recorded yet.";


        row.appendChild(
            cell
        );

        incidentHistoryList.appendChild(
            row
        );

        return;
    }


    incidentHistory.forEach(
        incident => {

            const row =
                document.createElement(
                    "tr"
                );


            const timeCell =
                document.createElement(
                    "td"
                );

            timeCell.textContent =
                shortTime(
                    incident.startTime
                );


            const incidentCell =
                document.createElement(
                    "td"
                );

            incidentCell.textContent =
                incident.title;


            const siteCell =
                document.createElement(
                    "td"
                );

            siteCell.textContent =
                incident.site;


            const severityCell =
                document.createElement(
                    "td"
                );


            const severity =
                document.createElement(
                    "span"
                );


            severity.className =
                `incident-severity ${incident.severity}`;

            severity.textContent =
                incident.severity.toUpperCase();


            severityCell.appendChild(
                severity
            );


            const durationCell =
                document.createElement(
                    "td"
                );


            durationCell.textContent =
                incident.status ===
                "ACTIVE"
                    ? `${formatDuration(
                        incident.startTime
                    )} · Ongoing`
                    : formatDuration(
                        incident.startTime,
                        incident.endTime
                    );


            const statusCell =
                document.createElement(
                    "td"
                );


            const status =
                document.createElement(
                    "span"
                );


            status.className =
                `incident-status ${
                    incident.status ===
                    "ACTIVE"
                        ? "active"
                        : "recovered"
                }`;


            status.textContent =
                incident.status;


            statusCell.appendChild(
                status
            );


            row.appendChild(
                timeCell
            );

            row.appendChild(
                incidentCell
            );

            row.appendChild(
                siteCell
            );

            row.appendChild(
                severityCell
            );

            row.appendChild(
                durationCell
            );

            row.appendChild(
                statusCell
            );


            incidentHistoryList.appendChild(
                row
            );
        }
    );
}


/* =========================================================
   CLEAR HISTORY
========================================================= */

clearHistory.addEventListener(
    "click",
    () => {

        if (
            !confirm(
                "Clear all incident history? Active incidents will stay."
            )
        ) {
            return;
        }


        incidentHistory =
            incidentHistory.filter(
                incident =>
                    incident.status ===
                    "ACTIVE"
            );


        saveIncidentHistory();

        renderIncidentHistory();
    }
);


/* =========================================================
   LIVE INCIDENT DURATION
========================================================= */

setInterval(
    () => {

        if (
            incidentHistory.some(
                incident =>
                    incident.status ===
                    "ACTIVE"
            )
        ) {

            saveLastSeen();

            renderIncidentHistory();
        }

    },
    1000
);


/* =========================================================
   BUTTONS
========================================================= */

normalBtn.addEventListener(
    "click",
    activateNormalMode
);

powerBtn.addEventListener(
    "click",
    activatePowerFailure
);

restoreGridBtn.addEventListener(
    "click",
    restoreGridPower
);

heatBtn.addEventListener(
    "click",
    activateOverheating
);

networkBtn.addEventListener(
    "click",
    activateNetworkFailure
);


/* =========================================================
   NAVIGATION
========================================================= */

document.querySelectorAll(
    ".nav-link"
).forEach(
    link => {

        link.addEventListener(
            "click",
            event => {

                if (
                    link.getAttribute("href") === "#"
                ) {
                    event.preventDefault();
                }

                document.querySelectorAll(
                    ".nav-link"
                ).forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                link.classList.add(
                    "active"
                );
            }
        );
    }
);


document.getElementById(
    "navAlerts"
).addEventListener(
    "click",
    event => {

        event.preventDefault();

        document.getElementById(
            "alerts"
        ).scrollIntoView({
            behavior: "smooth"
        });
    }
);


document.getElementById(
    "navHistory"
).addEventListener(
    "click",
    event => {

        event.preventDefault();

        document.getElementById(
            "incidentHistory"
        ).scrollIntoView({
            behavior: "smooth"
        });
    }
);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    drawTemperatureChart
);


window.addEventListener(
    "beforeunload",
    saveLastSeen
);


/* =========================================================
   INITIALIZATION
========================================================= */

loadIncidentHistory();

activateNormalMode();

renderIncidentHistory();

renderAlerts();