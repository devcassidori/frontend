$(document).ready(function () {
    $("#content").load("../html/login.html");
});

function principal() {
    $("#content").load("../html/principal.html");
}

function exit() {
    $("#content").load("../html/login.html");
}

function toggle_warning() {
    $("#warning").toggle();
    $("#warning").toggleClass("blink-warning");
}
function blink_warning() {
    $(".blink-warning").fadeToggle(blink_warning());
}

function main_measurements() {
    $(".link-menu").removeClass("active-menu");
    $("#menu-1").addClass("active-menu");
    $("#display-content").load("../html/main-measurements.html");
    close_menu();
    setSelectPage("main-measurements");
}

function user_settings() {
    $(".link-menu").removeClass("active-menu");
    $("#display-content").load("../html/user-settings.html");
    close_menu();
    setSelectPage("user-settings");
}

function total_reverse() {
    $(".link-menu").removeClass("active-menu")
    $("#menu-2").addClass("active-menu");
    $("#display-content").load("../html/total-reverse.html");
    close_menu();
    setSelectPage("total-reverse");
}

function total_power() {
    $(".link-menu").removeClass("active-menu");
    $("#menu-3").addClass("active-menu");
    $("#display-content").load("../html/total-power.html");
    close_menu();
    setSelectPage("total-power");
}

function temperature_measurements() {
    $(".link-menu").removeClass("active-menu");
    $("#menu-8").addClass("active-menu");
    $("#display-content").load("../html/temperature-measurements.html");
    close_menu();
    setSelectPage("temperature-measurements");
}

function consumption_performance() {
    $(".link-menu").removeClass("active-menu");
    $("#menu-9").addClass("active-menu");
    $("#display-content").load("../html/consumption-performance.html");
    close_menu();
    setSelectPage("consumption-performance");
}

function external_combiner_status() {
    $(".link-menu").removeClass("active-menu");
    $("#menu-6").addClass("active-menu");
    $("#display-content").load("../html/external-combiner-status.html");
    close_menu();
    setSelectPage("external-combiner-status");
}

function external_faults_logs() {
    $(".link-menu").removeClass("active-menu");
    $("#menu-4").addClass("active-menu");
    $("#display-content").load("../html/external-faults-logs.html");
    close_menu();
    setSelectPage("external-faults-logs");
}

function local_combiner_status() {
    $(".link-menu").removeClass("active-menu");
    $("#menu-7").addClass("active-menu");
    $("#display-content").load("../html/local-combiner-status.html");
    close_menu();
    setSelectPage("local-combiner-status");
}

function local_combiner_rejection_load() {
    $(".link-menu").removeClass("active-menu");
    $("#menu-7-1").addClass("active-menu");
    $("#display-content").load("../html/local-combiner-rejection-load.html");
    close_menu();
    setSelectPage("local-combiner-rejection-load");
}

function local_combiner_pa_current() {
    $(".link-menu").removeClass("active-menu");
    $("#menu-7-2").addClass("active-menu");
    $("#display-content").load("../html/local-combiner-pa-current.html");
    close_menu();
    setSelectPage("local-combiner-pa-current");
}

function local_faults_logs() {
    $(".link-menu").removeClass("active-menu");
    $("#menu-5").addClass("active-menu");
    $("#display-content").load("../html/local-faults-logs.html");
    close_menu();
    setSelectPage("local-faults-logs");
}

function pa_current_measurements() {
    $(".link-menu").removeClass("active-menu");
    $("#menu-12").addClass("active-menu");
    $("#display-content").load("../html/pa-current-measurements.html");
    close_menu();
    setSelectPage("pa-current-measurements");
}

function pa_driver_status() {
    $(".link-menu").removeClass("active-menu");
    $("#menu-10").addClass("active-menu");
    $("#display-content").load("../html/pa-driver-status.html");
    close_menu();
    setSelectPage("pa-driver-status");
}

function voltage_meters() {
    $(".link-menu").removeClass("active-menu");
    $("#menu-11").addClass("active-menu");
    $("#display-content").load("../html/voltage-meters.html");
    close_menu();
    setSelectPage("voltage-meters");
}

function open_menu() {
    $("#menu-links").fadeIn(500);
    $("#menu-header").fadeIn(100);
    $("#menu-content").css("width", "580px").fadeIn(100);
    $(".blur").css("filter", "blur(5px)");
}
function close_menu() {
    $("#menu-links").fadeOut(200);
    $("#menu-header").fadeOut(200);
    $("#menu-content").css("width", "0").fadeOut(800);
    $(".blur").css("filter", "blur(0px)");
}

function leds_blink() {
    setTimeout(function () {
        $("#pll-icon").hide();
        $("#pll-icon-on").show();
        $("#pll-txt").css("color", "var(--red)");
        $("#pll-txt").addClass("on-red");
        $("#swr-icon").hide();
        $("#swr-icon-on").show();
        $("#swr-txt").css("color", "var(--red)");
        $("#swr-txt").addClass("on-red");
        $("#temp-icon").hide();
        $("#temp-icon-on").show();
        $("#temp-txt").css("color", "var(--red)");
        $("#temp-txt").addClass("on-red");
        $("#pa-icon").hide();
        $("#pa-icon-on").show();
        $("#pa-txt").css("color", "var(--red)");
        $("#pa-txt").addClass("on-red");
        $("#ac-icon").hide();
        $("#ac-icon-on").show();
        $("#ac-txt").css("color", "var(--red)");
        $("#ac-txt").addClass("on-red");
        $("#mute-icon").hide();
        $("#mute-icon-on").show();
        $("#mute-txt").css("color", "var(--yllw)");
        $("#mute-txt").addClass("on-yllw");
        $("#power-icon").hide();
        $("#power-icon-on").show();
        $("#off-txt").css("color", "var(--yllw)");
        $("#off-txt").addClass("on-yllw");
        $("#mic-icon").hide();
        $("#mic-icon-on").show();
        $("#on-txt").css("color", "var(--verde-linha-s)");
        $("#on-txt").addClass("on-green");
        $("#low-icon").hide();
        $("#low-icon-on").show();
        $("#low-txt").css("color", "var(--verde-linha-s)");
        $("#low-txt").addClass("on-green");
        $("#mid-icon").hide();
        $("#mid-icon-on").show();
        $("#mid-txt").css("color", "var(--verde-linha-s)");
        $("#mid-txt").addClass("on-green");
        $("#high-icon").hide();
        $("#high-icon-on").show();
        $("#high-txt").css("color", "var(--verde-linha-s)");
        $("#high-txt").addClass("on-green");
    }, 200);
    setTimeout(function () {
        $("#pll-icon-on").hide();
        $("#pll-icon").show();
        $("#pll-txt").css("color", "var(--lightgray)");
        $("#pll-txt").removeClass("on-red");
        $("#swr-icon-on").hide();
        $("#swr-icon").show();
        $("#swr-txt").css("color", "var(--lightgray)");
        $("#swr-txt").removeClass("on-red");
        $("#temp-icon-on").hide();
        $("#temp-icon").show();
        $("#temp-txt").css("color", "var(--lightgray)");
        $("#temp-txt").removeClass("on-red");
        $("#pa-icon-on").hide();
        $("#pa-icon").show();
        $("#pa-txt").css("color", "var(--lightgray)");
        $("#pa-txt").removeClass("on-red");
        $("#ac-icon-on").hide();
        $("#ac-icon").show();
        $("#ac-txt").css("color", "var(--lightgray)");
        $("#ac-txt").removeClass("on-red");
        $("#mute-icon-on").hide();
        $("#mute-icon").show();
        $("#mute-txt").css("color", "var(--lightgray)");
        $("#mute-txt").removeClass("on-yllw");
        $("#power-icon-on").hide();
        $("#power-icon").show();
        $("#off-txt").css("color", "var(--lightgray)");
        $("#off-txt").removeClass("on-yllw");
        $("#mic-icon-on").hide();
        $("#mic-icon").show();
        $("#on-txt").css("color", "var(--lightgray)");
        $("#on-txt").removeClass("on-green");
        $("#low-icon-on").hide();
        $("#low-icon").show();
        $("#low-txt").css("color", "var(--lightgray)");
        $("#low-txt").removeClass("on-green");
        $("#mid-icon-on").hide();
        $("#mid-icon").show();
        $("#mid-txt").css("color", "var(--lightgray)");
        $("#mid-txt").removeClass("on-green");
        $("#high-icon-on").hide();
        $("#high-icon").show();
        $("#high-txt").css("color", "var(--lightgray)");
        $("#high-txt").removeClass("on-green");
    }, 730);
    setTimeout(function () {
        $("#low-icon").hide();
        $("#low-icon-on").show();
        $("#low-txt").css("color", "var(--verde-linha-s)");
        $("#low-txt").addClass("on-green");
    }, 1100)
}

function pll_on() {
    let pll = $("#pll-txt");
    if (pll.val() === "0" || pll.val() === "" || pll.val() === "null") {
        $("#pll-icon").hide();
        $("#pll-icon-on").show();
        $("#pll-txt").css("color", "var(--red)");
        $("#pll-txt").addClass("on-red");
        pll.val("1");
    } else {
        $("#pll-txt").css("color", "var(--lightgray)");
        $("#pll-txt").removeClass("on-red");
        $("#pll-icon-on").hide();
        $("#pll-icon").show();
        pll.val("0");
    }
}

function swr_on() {
    let swr = $("#swr-txt");
    if (swr.val() === "0" || swr.val() === "" || swr.val() === "null") {
        $("#swr-icon").hide();
        $("#swr-icon-on").show();
        $("#swr-txt").css("color", "var(--red)");
        $("#swr-txt").addClass("on-red");
        swr.val("1");
    } else {
        $("#swr-txt").css("color", "var(--lightgray)");
        $("#swr-txt").removeClass("on-red");
        $("#swr-icon-on").hide();
        $("#swr-icon").show();
        swr.val("0");
    }
}

function temp_on() {
    let temp = $("#temp-txt");
    if (temp.val() === "0" || temp.val() === "" || temp.val() === "null") {
        $("#temp-icon").hide();
        $("#temp-icon-on").show();
        $("#temp-txt").css("color", "var(--red)");
        $("#temp-txt").addClass("on-red");
        temp.val("1");
    } else {
        $("#temp-txt").css("color", "var(--lightgray)");
        $("#temp-txt").removeClass("on-red");
        $("#temp-icon-on").hide();
        $("#temp-icon").show();
        temp.val("0");
    }
}

function pa_on() {
    let pa = $("#pa-txt");
    if (pa.val() === "0" || pa.val() === "" || pa.val() === "null") {
        $("#pa-icon").hide();
        $("#pa-icon-on").show();
        $("#pa-txt").css("color", "var(--red)");
        $("#pa-txt").addClass("on-red");
        pa.val("1");
    } else {
        $("#pa-txt").css("color", "var(--lightgray)");
        $("#pa-txt").removeClass("on-red");
        $("#pa-icon-on").hide();
        $("#pa-icon").show();
        pa.val("0");
    }
}

function ac_on() {
    let ac = $("#ac-txt");
    if (ac.val() === "0" || ac.val() === "" || ac.val() === "null") {
        $("#ac-icon").hide();
        $("#ac-icon-on").show();
        $("#ac-txt").css("color", "var(--red)");
        $("#ac-txt").addClass("on-red");
        ac.val("1");
    } else {
        $("#ac-txt").css("color", "var(--lightgray)");
        $("#ac-txt").removeClass("on-red");
        $("#ac-icon-on").hide();
        $("#ac-icon").show();
        ac.val("0");
    }
}

function mute_on() {
    let mute = $("#mute-txt");
    if (mute.val() === "0" || mute.val() === "" || mute.val() === "null") {
        $("#mute-icon").hide();
        $("#mute-icon-on").show();
        $("#mute-txt").css("color", "var(--yllw)");
        $("#mute-txt").addClass("on-yllw");
        mute.val("1");
    } else {
        $("#mute-txt").css("color", "var(--lightgray)");
        $("#mute-txt").removeClass("on-yllw");
        $("#mute-icon-on").hide();
        $("#mute-icon").show();
        mute.val("0");
    }
}

async function enviarSnmp() {
    const ft = await fetch('http://localhost:3000')
    
    console.log("funcionou");
    
    
}


