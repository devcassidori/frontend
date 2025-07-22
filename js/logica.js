var power = "LOW";
var carrier = "off";
var led_pll = "off";
var led_temp = "off";
var led_swr = "off";
var led_pa = "off";
var led_ac = "off";
var led_mute = "off";
var gateway = `ws://${window.location.hostname}/ws`; // Endereco do servidor Websocket
var websocket;
window.addEventListener('load', onLoad);


const ws = new WebSocket('ws://localhost:3000/ws');
ws.onmessage = function (event) {
  const data = JSON.parse(event.data);
  if (data.total_reverse_power !== undefined) {
    document.getElementById('TotalReverse').textContent = data.total_reverse_power;
  }
};



function onLoad(event) {
  initWebSocket();//inicia a conexao websocket
  // Sincroniza power level inicial com o backend
  syncPowerLevelFromBackend();
}

// Função para sincronizar power level com o backend
function syncPowerLevelFromBackend() {
  console.log("🔄 Syncing power level from backend...");
  fetch('/power-status')
    .then(response => response.json())
    .then(data => {
      console.log("📡 Backend power status:", data);
      if (data.current_power) {
        const level = data.current_power.toUpperCase();
        // Simula mensagem WebSocket para atualizar frontend
        const syntheticMessage = {
          action: 'powerLevelChanged',
          level: level,
          timestamp: new Date().toISOString()
        };
        
        // Processa a mensagem como se tivesse vindo do WebSocket
        console.log("🔄 Processing synthetic message:", syntheticMessage);
        onMessage({ data: JSON.stringify(syntheticMessage) });
      }
    })
    .catch(error => {
      console.error("❌ Error syncing power level:", error);
    });
}

function initWebSocket() {
  console.log("Trying to open a WebSocket connection...");
  websocket = new WebSocket(gateway);
  websocket.onopen = onOpen;
  websocket.onclose = onClose;
  websocket.onmessage = onMessage; // <-- add this line
}

//===============Funcao para acetar a pagina=============
function setSelectPage(pageSel) {
  page = pageSel;
  console.log("Pagina Selecionada-->" + page);
  enviaRasp();
}

//================Eventos de WebSocket===================
function onOpen(event) {
  console.log('Connection opened');
  // Sincroniza power level quando WebSocket conecta
  setTimeout(syncPowerLevelFromBackend, 1000);
}
function onClose(event) {
  console.log('Connection closed');
  setTimeout(initWebSocket, 2000); //Tenta reconexao a cada 2 segundos
}

function onMessage(event) { // Recebe mensagem String JSON do Raspberry
  var stringRxJSON = event.data;
  console.log("Recebendo string JSON do Rasp-->" + stringRxJSON);
  let jsonRx = {};
  try {
    jsonRx = JSON.parse(stringRxJSON);
  } catch (e) {
    console.warn("Mensagem WebSocket não é JSON válido:", stringRxJSON);
    return;
  }

  // Se vier do backend: { action: 'powerButton', value }
  if (jsonRx.action === 'powerButton') {
    // Aciona as funções do botão de potência conforme valor recebido
    if (jsonRx.value === 1) {
      // Simula clique no botão de potência
      if (power === "LOW") {
        power = "MID";
        $("#low-icon-on").hide();
        $("#low-icon").show();
        $("#low-txt").css("color", "var(--lightgray)");
        $("#low-txt").removeClass("on-green");
        $("#mid-icon").hide();
        $("#mid-icon-on").show();
        $("#mid-txt").css("color", "var(--verde-linha-s)");
        $("#mid-txt").addClass("on-green");
        enviaRasp();
      } else if (power === "MID") {
        power = "HIGH";
        $("#mid-icon-on").hide();
        $("#mid-icon").show();
        $("#mid-txt").css("color", "var(--lightgray)");
        $("#mid-txt").removeClass("on-green");
        $("#high-icon").hide();
        $("#high-icon-on").show();
        $("#high-txt").css("color", "var(--verde-linha-s)");
        $("#high-txt").addClass("on-green");
        enviaRasp();
      } else {
        power = "LOW";
        $("#high-icon-on").hide();
        $("#high-icon").show();
        $("#high-txt").css("color", "var(--lightgray)");
        $("#high-txt").removeClass("on-green");
        $("#low-icon").hide();
        $("#low-icon-on").show();
        $("#low-txt").css("color", "var(--verde-linha-s)");
        $("#low-txt").addClass("on-green");
        enviaRasp();
      }
    }
    // Se quiser tratar value === 0, adicione aqui
    return;
  }

  // Se vier do backend: { action: 'powerLevelChanged', level }
  if (jsonRx.action === 'powerLevelChanged') {
    console.log("🔋 Power level changed to:", jsonRx.level);
    console.log("🔧 Updating frontend display...");
    
    // Primeiro limpa todos os estados
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
    
    // Atualiza para o nível ativo
    if (jsonRx.level === 'LOW') {
      power = "LOW";
      $("#low-icon").hide();
      $("#low-icon-on").show();
      $("#low-txt").css("color", "var(--verde-linha-s)");
      $("#low-txt").addClass("on-green");
      console.log("✅ Frontend set to LOW power");
    } else if (jsonRx.level === 'MID') {
      power = "MID";
      $("#mid-icon").hide();
      $("#mid-icon-on").show();
      $("#mid-txt").css("color", "var(--verde-linha-s)");
      $("#mid-txt").addClass("on-green");
      console.log("✅ Frontend set to MID power");
    } else if (jsonRx.level === 'HIGH') {
      power = "HIGH";
      $("#high-icon").hide();
      $("#high-icon-on").show();
      $("#high-txt").css("color", "var(--verde-linha-s)");
      $("#high-txt").addClass("on-green");
      console.log("✅ Frontend set to HIGH power");
    }
    
    // Chama enviaRasp para sincronizar com o sistema
    console.log("📡 Calling enviaRasp() to sync...");
    enviaRasp();
    return;
  }

  // ...lógica original para páginas...
  let pagina = jsonRx.pag;
  console.log("Pagina-->" + pagina);
  if (pagina === "pcp") setPagPrincipal(jsonRx);
  else if (pagina === "mm") setPagMain(jsonRx);
  else if (pagina === "ttrev") setPagTotalRev(jsonRx);
  else if (pagina === "ttpw") setPagTotalPw(jsonRx);
  else if (pagina === "extflts") setPagExtFlts(jsonRx);
  else if (pagina === "localflts") setPagLocalFlts(jsonRx);
  else if (pagina === "extcombsts") setPagExtComb(jsonRx);
  else if (pagina === "localcombsts") setPagLocalComb(jsonRx);
  else if (pagina === "localcomrej") setPagLocalCombRej(jsonRx);
  else if (pagina === "localcombpa") setPagLocalCombPa(jsonRx);
  else if (pagina === "tempmsr") setPagTempMsr(jsonRx);
  else if (pagina === "consperf") setPagConsPerf(jsonRx);
  else if (pagina === "padrists") setPagPaDri(jsonRx);
  else if (pagina === "vltmtrs") setPagVoltMtrs(jsonRx);
  else if (pagina === "pacurmsr") setPagPaCurMsr(jsonRx);
  else console.warn("Pagina desconhecida: " + pagina);
}

//===========Ajusta pagina main-measurements.html=================================================
function setPagMain(jsonRx) {
  const wattsElem = document.getElementById("mainWatts");
  const kwElem = document.getElementById("mainKW");
  const ampElem = document.getElementById("mainAmp");
  const voltsElem = document.getElementById("mainVolts");
  const barGraph = document.getElementById("progress-bar");
  // Protege com verificação se os elementos existem antes de atualizar
  if (!wattsElem || !kwElem || !ampElem || !voltsElem || !barGraph) {     // Interrompe se algum dos elementos não existe
    console.warn("Elementos da página principal ainda não estão disponíveis no DOM.");
    return;
  }
  else {
    // Atualiza valores com fallback em caso de dados faltantes
    wattsElem.textContent = jsonRx.potRev ?? "0"; // Watts 
    kwElem.textContent = jsonRx.potFW ?? "0"; // Kw
    ampElem.textContent = jsonRx.paCorr ?? "0"; // Amp
    voltsElem.textContent = jsonRx.paVolts ?? "0"; // Volts 
    //Atualizar o bargraph de modulacao no main-measurements.html
    window.updateBar(parseInt(jsonRx.mod));
  }
}
//======Ajusta pagina principal.html============================================
function setPagPrincipal(jsonRx) {
  const modelElem = document.getElementById("TX_Model");
  const modeElem = document.getElementById("ModeSelect");
  const serieElem = document.getElementById("TX_Serial");
  const txDDElem = document.getElementById("TX_DD");
  const txMMElem = document.getElementById("TX_MM");
  const txAAElem = document.getElementById("TX_AA");

  if (!modelElem || !modeElem || !serieElem || !txDDElem || !txMMElem || !txAAElem) {
    console.warn("Elementos da página principal ainda não estão disponíveis no DOM.");
    return;
  }
  else {
    modelElem.textContent = jsonRx.model ?? "0"; // Model
    modeElem.textContent = jsonRx.mode ?? "0"; // Mode
    serieElem.textContent = jsonRx.serie ?? "0"; // Serie
    txDDElem.textContent = jsonRx.dd ?? "0"; // dia
    txMMElem.textContent = jsonRx.mm ?? "0"; // mes
    txAAElem.textContent = jsonRx.aa ?? "0"; // ano
  }
}

//======Ajusta pagina total-reverse.html============================================
function setPagTotalRev(jsonRx) {
  const TX_model = document.getElementById("TX_Model");
  const TotalR = document.getElementById("TotalReverse");
  const PowerReverse = document.getElementById("PowerReverse");
  if (!TX_model || !TotalR || !PowerReverse) {
    console.warn("Elementos da página total-reverse ainda não estão disponíveis no DOM.");
    return;
  }
  else {
    TX_model.textContent = jsonRx.TX_modelR ?? "0"; // Model
    TotalR.textContent = jsonRx.TotalR ?? "0"; // Total Reverse
    PowerReverse.textContent = jsonRx.PowerReverse ?? "0"; // Power Reverse
  }
}

//======Ajusta pagina total-power.html============================================
function setPagTotalPw(jsonRx) {
  const TX_model = document.getElementById("TX_Model");
  const TotalP = document.getElementById("TotalPower");
  const PowerPower = document.getElementById("PowerPower");
  if (!TX_model || !TotalP || !PowerPower) {
    console.warn("Elementos da página total-power ainda não estão disponíveis no DOM.");
    return;
  }
  else {
    TX_model.textContent = jsonRx.TX_modelP ?? "0"; // Model
    TotalP.textContent = jsonRx.TotalP ?? "0"; // Total Power
    PowerPower.textContent = jsonRx.PowerPower ?? "0"; // Power Forward
  }
}

//======Ajusta pagina external-faults-logs.html============================================
function setPagExtFlts(jsonRx) {
  const ReverseRF = document.getElementById("ReverseRF");
  const CombinerAB = document.getElementById("CombinerAB");
  const CombinerCD = document.getElementById("CombinerCD");
  const CombinerABCD = document.getElementById("CombinerABCD");
  const CombinerTemp = document.getElementById("CombinerTemp");
  if (!ReverseRF || !CombinerAB || !CombinerCD || !CombinerABCD || !CombinerTemp) {
    console.warn("Elementos da página external-faults-logs ainda não estão disponíveis no DOM.");
    return;
  }
  else {
    ReverseRF.textContent = jsonRx.RverseRF ?? "0"; // Reverse RF Power
    CombinerAB.textContent = jsonRx.CombinerAB ?? "0"; // Combiner A + B Rej. Overload
    CombinerCD.textContent = jsonRx.CombinerCD ?? "0"; // Combiner C + D Rej. Overload
    CombinerABCD.textContent = jsonRx.CombinerABCD ?? "0"; // Combiner ABCD Rej. Overload
    CombinerTemp.textContent = jsonRx.CombinerTemp ?? "0"; // Combiner Temperature
  }
}

//======Ajusta pagina local-faults-logs.html============================================
function setPagLocalFlts(jsonRx) {
  const RverseRFlcl = document.getElementById("RverseRFlcl");
  const PACombinerlcl = document.getElementById("PACombinerlcl");
  const VoltageTrip = document.getElementById("VoltageTrip");
  const CurrentTrip = document.getElementById("CurrentTrip");
  const LPFSpike = document.getElementById("LPFSpike");
  const PATemperature = document.getElementById("PATemperature");
  const ACPhase = document.getElementById("ACPhase");
  const ACUndervoltage = document.getElementById("ACUndervoltage");
  const PLLUnlock = document.getElementById("PLLUnlock");
  const PeripheralOverload = document.getElementById("PeripheralOverload");

  if (!RverseRFlcl || !PACombinerlcl || !VoltageTrip || !CurrentTrip || !LPFSpike || !PATemperature || !ACPhase || !ACUndervoltage || !PLLUnlock || !PeripheralOverload) {
    console.warn("Elementos da página local-faults-logs ainda não estão disponíveis no DOM.");
    return;
  }
  else {
    RverseRFlcl.textContent = jsonRx.RverseRFlcl ?? "0"; // Reverse RF Power
    PACombinerlcl.textContent = jsonRx.PACombinerlcl ?? "0"; // PA Combiner Overload
    VoltageTrip.textContent = jsonRx.VoltageTrip ?? "0"; // PA Voltage Trip
    CurrentTrip.textContent = jsonRx.CurrentTrip ?? "0"; // PA Current Trip
    LPFSpike.textContent = jsonRx.LPFSpike ?? "0"; // PA or LPF Spike
    PATemperature.textContent = jsonRx.PATemperature ?? "0"; // PA Temperature
    ACPhase.textContent = jsonRx.ACPhase ?? "0"; // AC Phase
    ACUndervoltage.textContent = jsonRx.ACUndervoltage ?? "0"; // AC Undervoltage
    PLLUnlock.textContent = jsonRx.PLLUnlock ?? "0"; // PLL Unlock
    PeripheralOverload.textContent = jsonRx.PeripheralOverload ?? "0"; // Peripheral Overload
  }

}

//======Ajusta pagina external-combiner-status.html============================================
function setPagExtComb(jsonRx) {
  const RejectionPowerTxAB = document.getElementById("RejectionPowerTxAB");
  const RejectionPowerTxCD = document.getElementById("RejectionPowerTxCD");
  const RejectionPowerTxABCD = document.getElementById("RejectionPowerTxABCD");
  const ForwardPowerTxABCD = document.getElementById("ForwardPowerTxABCD");
  const ReversePowerTxABCD = document.getElementById("ReversePowerTxABCD");
  const LocalPowerTxA = document.getElementById("LocalPowerTxA");
  const LocalCurrentTxA = document.getElementById("LocalCurrentTxA");

  if (!RejectionPowerTxAB || !RejectionPowerTxCD || !RejectionPowerTxABCD || !ForwardPowerTxABCD || !ReversePowerTxABCD || !LocalPowerTxA || !LocalCurrentTxA) {
    console.warn("Elementos da página external-combiner-status ainda não estão disponíveis no DOM.");
    return;
  }
  else {
    RejectionPowerTxAB.textContent = jsonRx.RejectionPowerTxAB ?? "0"; // Rejection Power Tx A + B
    RejectionPowerTxCD.textContent = jsonRx.RejectionPowerTxCD ?? "0"; // Rejection Power Tx C + D
    RejectionPowerTxABCD.textContent = jsonRx.RejectionPowerTxABCD ?? "0"; // Rejection Power Tx AB + CD
    ForwardPowerTxABCD.textContent = jsonRx.ForwardPowerTxABCD ?? "0"; // Forward Power Tx ABCD
    ReversePowerTxABCD.textContent = jsonRx.ReversePowerTxABCD ?? "0"; // Reverse Power Tx ABCD
    LocalPowerTxA.textContent = jsonRx.LocalPowerTxA ?? "0"; // Local Power Tx A
    LocalCurrentTxA.textContent = jsonRx.LocalCurrentTxA ?? "0"; // Local Current Tx A
  }

}

//======Ajusta pagina local-combiner-status.html============================================
function setPagLocalComb(jsonRx) {
  const RP_A = document.getElementById("RP_A");
  const RP_B = document.getElementById("RP_B");
  const RP_C = document.getElementById("RP_C");
  const RP_D = document.getElementById("RP_D");
  const RP_E = document.getElementById("RP_E");
  const RP_F = document.getElementById("RP_F");
  const RP_G = document.getElementById("RP_G");
  const RP_H = document.getElementById("RP_H");
  const RP_I = document.getElementById("RP_I");
  const RP_J = document.getElementById("RP_J");
  const RP_K = document.getElementById("RP_K");
  const RP_L = document.getElementById("RP_L");
  const RP_M = document.getElementById("RP_M");
  const RP_N = document.getElementById("RP_N");
  const RP_TOTAL = document.getElementById("RP_TOTAL");
  const TotalPower = document.getElementById("TotalPower");
  const OutputEfficiency = document.getElementById("OutputEfficiency");
  const PA_A = document.getElementById("PA_A");
  const PA_B = document.getElementById("PA_B");
  const PA_C = document.getElementById("PA_C");
  const PA_D = document.getElementById("PA_D");
  const PA_E = document.getElementById("PA_E");
  const PA_F = document.getElementById("PA_F");
  const PA_G = document.getElementById("PA_G");
  const PA_H = document.getElementById("PA_H");
  const PA_I = document.getElementById("PA_I");
  const PA_J = document.getElementById("PA_J");
  const PA_K = document.getElementById("PA_K");
  const PA_L = document.getElementById("PA_L");
  const PA_M = document.getElementById("PA_M");
  const PA_N = document.getElementById("PA_N");

  if (!RP_A || !RP_B || !RP_C || !RP_D || !RP_E || !RP_F || !RP_G || !RP_H || !RP_I || !RP_J || !RP_K || !RP_L || !RP_M || !RP_N ||
    !RP_TOTAL || !TotalPower || !OutputEfficiency || !PA_A || !PA_B || !PA_C || !PA_D || !PA_E || !PA_F || !PA_G || !PA_H ||
    !PA_I || !PA_J || !PA_K || !PA_L || !PA_M || !PA_N) {
    console.warn("Elementos da página local-combiner-status ainda não estão disponíveis no DOM.");
    return;
  }

  RP_A.textContent = jsonRx.RP_A ?? "0"; // Rejection Power A
  RP_B.textContent = jsonRx.RP_B ?? "0"; // Rejection Power B
  RP_C.textContent = jsonRx.RP_C ?? "0"; // Rejection Power C
  RP_D.textContent = jsonRx.RP_D ?? "0"; // Rejection Power D
  RP_E.textContent = jsonRx.RP_E ?? "0"; // Rejection Power E
  RP_F.textContent = jsonRx.RP_F ?? "0"; // Rejection Power F
  RP_G.textContent = jsonRx.RP_G ?? "0"; // Rejection Power G
  RP_H.textContent = jsonRx.RP_H ?? "0"; // Rejection Power H
  RP_I.textContent = jsonRx.RP_I ?? "0"; // Rejection Power I
  RP_J.textContent = jsonRx.RP_J ?? "0"; // Rejection Power J
  RP_K.textContent = jsonRx.RP_K ?? "0"; // Rejection Power K
  RP_L.textContent = jsonRx.RP_L ?? "0"; // Rejection Power L
  RP_M.textContent = jsonRx.RP_M ?? "0"; // Rejection Power M
  RP_N.textContent = jsonRx.RP_N ?? "0"; // Rejection Power N
  RP_TOTAL.textContent = jsonRx.RP_TOTAL ?? "0"; // Total Rejection Power
  TotalPower.textContent = jsonRx.TotalPower ?? "0"; // Total Power
  OutputEfficiency.textContent = jsonRx.OutputEfficiency ?? "0"; // Output Efficiency
  PA_A.textContent = jsonRx.PA_A ?? "0"; // PA A
  PA_B.textContent = jsonRx.PA_B ?? "0"; // PA B
  PA_C.textContent = jsonRx.PA_C ?? "0"; // PA C
  PA_D.textContent = jsonRx.PA_D ?? "0"; // PA D
  PA_E.textContent = jsonRx.PA_E ?? "0"; // PA E
  PA_F.textContent = jsonRx.PA_F ?? "0"; // PA F
  PA_G.textContent = jsonRx.PA_G ?? "0"; // PA G
  PA_H.textContent = jsonRx.PA_H ?? "0"; // PA H
  PA_I.textContent = jsonRx.PA_I ?? "0"; // PA I
  PA_J.textContent = jsonRx.PA_J ?? "0"; // PA J
  PA_K.textContent = jsonRx.PA_K ?? "0"; // PA K
  PA_L.textContent = jsonRx.PA_L ?? "0"; // PA L
  PA_M.textContent = jsonRx.PA_M ?? "0"; // PA M
  PA_N.textContent = jsonRx.PA_N ?? "0"; // PA N
}

//======Ajusta pagina local-combiner-rejection-load.html============================================
function setPagLocalCombRej(jsonRx) {
  const RP_A = document.getElementById("RP_A");
  const RP_B = document.getElementById("RP_B");
  const RP_C = document.getElementById("RP_C");
  const RP_D = document.getElementById("RP_D");
  const RP_E = document.getElementById("RP_E");
  const RP_F = document.getElementById("RP_F");
  const RP_G = document.getElementById("RP_G");
  const RP_H = document.getElementById("RP_H");
  const RP_I = document.getElementById("RP_I");
  const RP_J = document.getElementById("RP_J");
  const RP_K = document.getElementById("RP_K");
  const RP_L = document.getElementById("RP_L");
  const RP_M = document.getElementById("RP_M");
  const RP_N = document.getElementById("RP_N");
  const RP_TOTAL = document.getElementById("RP_TOTAL");
  const TotalPower = document.getElementById("TotalPower");
  const OutputEfficiency = document.getElementById("OutputEfficiency");

  if (!RP_A || !RP_B || !RP_C || !RP_D || !RP_E || !RP_F || !RP_G || !RP_H || !RP_I || !RP_J || !RP_K || !RP_L || !RP_M || !RP_N ||
    !RP_TOTAL || !TotalPower || !OutputEfficiency) {
    console.warn("Elementos da página local-combiner-rejection-load ainda não estão disponíveis no DOM.");
    return;
  }

  RP_A.textContent = jsonRx.RP_ARej ?? "0"; // Rejection Power A
  RP_B.textContent = jsonRx.RP_BRej ?? "0"; // Rejection Power B
  RP_C.textContent = jsonRx.RP_CRej ?? "0"; // Rejection Power C
  RP_D.textContent = jsonRx.RP_DRej ?? "0"; // Rejection Power D
  RP_E.textContent = jsonRx.RP_ERej ?? "0"; // Rejection Power E
  RP_F.textContent = jsonRx.RP_FRej ?? "0"; // Rejection Power F
  RP_G.textContent = jsonRx.RP_GRej ?? "0"; // Rejection Power G
  RP_H.textContent = jsonRx.RP_HRej ?? "0"; // Rejection Power H
  RP_I.textContent = jsonRx.RP_IRej ?? "0"; // Rejection Power I
  RP_J.textContent = jsonRx.RP_JRej ?? "0"; // Rejection Power J
  RP_K.textContent = jsonRx.RP_KRej ?? "0"; // Rejection Power K
  RP_L.textContent = jsonRx.RP_LRej ?? "0"; // Rejection Power L
  RP_M.textContent = jsonRx.RP_MRej ?? "0"; // Rejection Power M
  RP_N.textContent = jsonRx.RP_NRej ?? "0"; // Rejection Power N
  RP_TOTAL.textContent = jsonRx.RP_TOTALRej ?? "0"; // Total Rejection Power
  TotalPower.textContent = jsonRx.TotalPowerRej ?? "0"; // Total Power
  OutputEfficiency.textContent = jsonRx.OutputEfficiencyRej ?? "0"; // Output Efficiency

}

//======Ajusta pagina local-combiner-pa-current.html============================================
function setPagLocalCombPa(jsonRx) {
  const TotalPower = document.getElementById("TotalPower");
  const OutputEfficiency = document.getElementById("OutputEfficiency");
  const PA_A = document.getElementById("PA_A");
  const PA_B = document.getElementById("PA_B");
  const PA_C = document.getElementById("PA_C");
  const PA_D = document.getElementById("PA_D");
  const PA_E = document.getElementById("PA_E");
  const PA_F = document.getElementById("PA_F");
  const PA_G = document.getElementById("PA_G");
  const PA_H = document.getElementById("PA_H");
  const PA_I = document.getElementById("PA_I");
  const PA_J = document.getElementById("PA_J");
  const PA_K = document.getElementById("PA_K");
  const PA_L = document.getElementById("PA_L");
  const PA_M = document.getElementById("PA_M");
  const PA_N = document.getElementById("PA_N");

  if (!TotalPower || !OutputEfficiency || !PA_A || !PA_B || !PA_C || !PA_D || !PA_E || !PA_F || !PA_G || !PA_H ||
    !PA_I || !PA_J || !PA_K || !PA_L || !PA_M || !PA_N) {
    console.warn("Elementos da página local-combiner-pa-current ainda não estão disponíveis no DOM.");
    return;
  }

  TotalPower.textContent = jsonRx.TotalPowerPA ?? "0"; // Total Power
  OutputEfficiency.textContent = jsonRx.OutputEfficiencyPA ?? "0"; // Output Efficiency
  PA_A.textContent = jsonRx.PA_APA ?? "0"; // PA A
  PA_B.textContent = jsonRx.PA_BPA ?? "0"; // PA B
  PA_C.textContent = jsonRx.PA_CPA ?? "0"; // PA C
  PA_D.textContent = jsonRx.PA_DPA ?? "0"; // PA D
  PA_E.textContent = jsonRx.PA_EPA ?? "0"; // PA E
  PA_F.textContent = jsonRx.PA_FPA ?? "0"; // PA F
  PA_G.textContent = jsonRx.PA_GPA ?? "0"; // PA G
  PA_H.textContent = jsonRx.PA_HPA ?? "0"; // PA H
  PA_I.textContent = jsonRx.PA_IPA ?? "0"; // PA I
  PA_J.textContent = jsonRx.PA_JPA ?? "0"; // PA J
  PA_K.textContent = jsonRx.PA_KPA ?? "0"; // PA K
  PA_L.textContent = jsonRx.PA_LPA ?? "0"; // PA L
  PA_M.textContent = jsonRx.PA_MPA ?? "0"; // PA M
  PA_N.textContent = jsonRx.PA_NPA ?? "0"; // PA N
}

//======Ajusta pagina temperature-measurements.html============================================
function setPagTempMsr(jsonRx) {
  const TEMP_OUT = document.getElementById("TEMP_OUT");
  const TEMP_IN = document.getElementById("TEMP_IN");
  const TEMP_Difference = document.getElementById("TEMP_Difference");
  const Power_Dissipation = document.getElementById("Power_Dissipation");
  const PWM_Fan_Speed = document.getElementById("PWM_Fan_Speed");
  if (!TEMP_OUT || !TEMP_IN || !TEMP_Difference || !Power_Dissipation || !PWM_Fan_Speed) {
    console.warn("Elementos da página temperature-measurements ainda não estão disponíveis no DOM.");
    return;
  }
  else {
    TEMP_OUT.textContent = jsonRx.TEMP_OUT ?? "0"; // Temperature Outside
    TEMP_IN.textContent = jsonRx.TEMP_IN ?? "0"; // Temperature Inside
    TEMP_Difference.textContent = jsonRx.TEMP_Difference ?? "0"; // Temperature Difference
    Power_Dissipation.textContent = jsonRx.Power_Dissipation ?? "0"; // Power Dissipation
    PWM_Fan_Speed.textContent = jsonRx.PWM_Fan_Speed ?? "0"; // PWM Fan Speed
  }

}

//======Ajusta pagina consumption-performance.html============================================
function setPagConsPerf(jsonRx) {
  const PA_DC_Ampers = document.getElementById("PA_DC_Ampers");
  const PA_DC_Volts = document.getElementById("PA_DC_Volts");
  const RF_Forward_Power = document.getElementById("RF_Forward_Power");
  const PA_Efficiency = document.getElementById("PA_Efficiency");
  const AC_RFefficiency = document.getElementById("AC_RFefficiency");
  const BTU = document.getElementById("BTU");

  if (!PA_DC_Ampers || !PA_DC_Volts || !RF_Forward_Power || !PA_Efficiency || !AC_RFefficiency || !BTU) {
    console.warn("Elementos da página consumption-performance ainda não estão disponíveis no DOM.");
    return;
  }
  else {
    PA_DC_Ampers.textContent = jsonRx.PA_DC_Ampers ?? "0"; // PA DC Ampers
    PA_DC_Volts.textContent = jsonRx.PA_DC_Volts ?? "0"; // PA DC Volts
    RF_Forward_Power.textContent = jsonRx.RF_Forward_Power ?? "0"; // RF Forward Power
    PA_Efficiency.textContent = jsonRx.PA_Efficiency ?? "0"; // PA Efficiency
    AC_RFefficiency.textContent = jsonRx.AC_RFefficiency ?? "0"; // AC RF Efficiency
    BTU.textContent = jsonRx.BTU ?? "0"; // BTU
  }

}

//======Ajusta pagina pa-driver-status.html============================================
function setPagPaDri(jsonRx) {
  const PowerExciterA = document.getElementById("PowerExciterA");
  const PowerExciterB = document.getElementById("PowerExciterB");
  const PowerDriverOut = document.getElementById("PowerDriverOut");
  const PowerForwardPA = document.getElementById("PowerForwardPA");
  const DriverVoltage = document.getElementById("DriverVoltage");
  const DriverCommandVoltage = document.getElementById("DriverCommandVoltage");
  const CommandIPAPowerSupply = document.getElementById("CommandIPAPowerSupply");
  const CommandPreDriverPowerSupply = document.getElementById("CommandPreDriverPowerSupply");
  const SlaveVoltageIn = document.getElementById("SlaveVoltageIn");

  if (!PowerExciterA || !PowerExciterB || !PowerDriverOut || !PowerForwardPA || !DriverVoltage || !DriverCommandVoltage ||
    !CommandIPAPowerSupply || !CommandPreDriverPowerSupply || !SlaveVoltageIn) {
    console.warn("Elementos da página pa-driver-status ainda não estão disponíveis no DOM.");
    return;
  }
  else {
    PowerExciterA.textContent = jsonRx.PowerExciterA ?? "0"; // Power Exciter A
    PowerExciterB.textContent = jsonRx.PowerExciterB ?? "0"; // Power Exciter B
    PowerDriverOut.textContent = jsonRx.PowerDriverOut ?? "0"; // Power Driver Out
    PowerForwardPA.textContent = jsonRx.PowerForwardPA ?? "0"; // Power Forward PA
    DriverVoltage.textContent = jsonRx.DriverVoltage ?? "0"; // Driver Voltage
    DriverCommandVoltage.textContent = jsonRx.DriverCommandVoltage ?? "0"; // Driver Command Voltage
    CommandIPAPowerSupply.textContent = jsonRx.CommandIPAPowerSupply ?? "0"; // Command IPA Power Supply
    CommandPreDriverPowerSupply.textContent = jsonRx.CommandPreDriverPowerSupply ?? "0"; // Command Pre-Driver Power Supply
    SlaveVoltageIn.textContent = jsonRx.SlaveVoltageIn ?? "0"; // Slave Voltage In
  }
}

//======Ajusta pagina voltage-meters.html============================================
function setPagVoltMtrs(jsonRx) {
  const PA_DC_Voltage = document.getElementById("PA_DC_Voltage");
  const Driver_Voltage = document.getElementById("Driver_Voltage");
  const Driver_Command_Voltage = document.getElementById("Driver_Command_Voltage");
  const AC_R_Voltage = document.getElementById("AC_R_Voltage");
  const AC_S_Voltage = document.getElementById("AC_S_Voltage");
  const AC_T_Voltage = document.getElementById("AC_T_Voltage");
  const Spike_Voltage = document.getElementById("Spike_Voltage");

  if (!PA_DC_Voltage || !Driver_Voltage || !Driver_Command_Voltage || !AC_R_Voltage || !AC_S_Voltage || !AC_T_Voltage || !Spike_Voltage) {
    console.warn("Elementos da página voltage-meters ainda não estão disponíveis no DOM.");
    return;
  }
  else {
    PA_DC_Voltage.textContent = jsonRx.PA_DC_Voltage ?? "0"; // PA DC Voltage
    Driver_Voltage.textContent = jsonRx.Driver_Voltage ?? "0"; // Driver Voltage
    Driver_Command_Voltage.textContent = jsonRx.Driver_Command_Voltage ?? "0"; // Driver Command Voltage
    AC_R_Voltage.textContent = jsonRx.AC_R_Voltage ?? "0"; // AC R Voltage
    AC_S_Voltage.textContent = jsonRx.AC_S_Voltage ?? "0"; // AC S Voltage
    AC_T_Voltage.textContent = jsonRx.AC_T_Voltage ?? "0"; // AC T Voltage
    Spike_Voltage.textContent = jsonRx.Spike_Voltage ?? "0"; // Spike Voltage
  }
}

//======Ajusta pagina pa-current-measurements.html============================================
function setPagPaCurMsr(jsonRx) {
  const PA_A = document.getElementById("PA_A");
  const PA_B = document.getElementById("PA_B");
  const PA_C = document.getElementById("PA_C");
  const PA_D = document.getElementById("PA_D");
  const PA_E = document.getElementById("PA_E");
  const PA_F = document.getElementById("PA_F");
  const PA_G = document.getElementById("PA_G");
  const PA_H = document.getElementById("PA_H");
  const PA_I = document.getElementById("PA_I");
  const PA_J = document.getElementById("PA_J");
  const PA_K = document.getElementById("PA_K");
  const PA_L = document.getElementById("PA_L");
  const PA_M = document.getElementById("PA_M");
  const PA_N = document.getElementById("PA_N");
  const PA_TOTAL = document.getElementById("PA_TOTAL");

  if (!PA_A || !PA_B || !PA_C || !PA_D || !PA_E || !PA_F || !PA_G || !PA_H || !PA_I || !PA_J || !PA_K || !PA_L || !PA_M || !PA_N ||
    !PA_TOTAL) {
    console.warn("Elementos da página pa-current-measurements ainda não estão disponíveis no DOM.");
    return;
  }
  else {
    PA_A.textContent = jsonRx.PA_Acur ?? "0"; // PA A
    PA_B.textContent = jsonRx.PA_Bcur ?? "0"; // PA B
    PA_C.textContent = jsonRx.PA_Ccur ?? "0"; // PA C
    PA_D.textContent = jsonRx.PA_Dcur ?? "0"; // PA D
    PA_E.textContent = jsonRx.PA_Ecur ?? "0"; // PA E
    PA_F.textContent = jsonRx.PA_Fcur ?? "0"; // PA F
    PA_G.textContent = jsonRx.PA_Gcur ?? "0"; // PA G
    PA_H.textContent = jsonRx.PA_Hcur ?? "0"; // PA H
    PA_I.textContent = jsonRx.PA_Icur ?? "0"; // PA I
    PA_J.textContent = jsonRx.PA_Jcur ?? "0"; // PA J
    PA_K.textContent = jsonRx.PA_Kcur ?? "0"; // PA K
    PA_L.textContent = jsonRx.PA_Lcur ?? "0"; // PA L
    PA_M.textContent = jsonRx.PA_Mcur ?? "0"; // PA M
    PA_N.textContent = jsonRx.PA_Ncur ?? "0"; // PA N
    PA_TOTAL.textContent = jsonRx.PA_TOTALcur ?? "0"; // PA Total
  }

}

//=========Evento do botao btn-power=====================
$(document).on("click", "#Btn_PW", function clickPw () {
  console.log("Botão btn-pw!");
  if (power === "LOW") {
    power = "MID";
    $("#low-icon-on").hide();
    $("#low-icon").show();
    $("#low-txt").css("color", "var(--lightgray)");
    $("#low-txt").removeClass("on-green");
    $("#mid-icon").hide();
    $("#mid-icon-on").show();
    $("#mid-txt").css("color", "var(--verde-linha-s)");
    $("#mid-txt").addClass("on-green");
    enviaRasp();
    return;
  }
  else if (power === "MID") {
    power = "HIGH";
    $("#mid-icon-on").hide();
    $("#mid-icon").show();
    $("#mid-txt").css("color", "var(--lightgray)");
    $("#mid-txt").removeClass("on-green");
    $("#high-icon").hide();
    $("#high-icon-on").show();
    $("#high-txt").css("color", "var(--verde-linha-s)");
    $("#high-txt").addClass("on-green");
    enviaRasp();
    return;
  }
  else {
    power = "LOW";
    $("#high-icon-on").hide();
    $("#high-icon").show();
    $("#high-txt").css("color", "var(--lightgray)");
    $("#high-txt").removeClass("on-green");
    $("#low-icon").hide();
    $("#low-icon-on").show();
    $("#low-txt").css("color", "var(--verde-linha-s)");
    $("#low-txt").addClass("on-green");
    enviaRasp();
    return;
  }
});

//=========Evento do botao btn-on=====================
$(document).on("click", "#Btn_ON", function clickOn () {
  console.log("Botão btn ON clicado!");
  if (carrier === "off") {
    carrier = "on";
    $("#off-txt").css("color", "var(--lightgray)");
    $("#off-txt").removeClass("on-yllw");
    $("#power-icon-on").hide();
    $("#power-icon").show();
    $("#mic-icon").hide();
    $("#mic-icon-on").show();
    $("#on-txt").css("color", "var(--verde-linha-s)");
    $("#on-txt").addClass("on-green");
  }
  enviaRasp();
});

//=========Evento do botao btn-off=====================
$(document).on("click", "#Btn_SB", function clickOff () {
  console.log("Botão btn OFF clicado!");
  if (carrier === "on") {
    carrier = "off";
    $("#on-txt").css("color", "var(--lightgray)");
    $("#on-txt").removeClass("on-green");
    $("#mic-icon-on").hide();
    $("#mic-icon").show();
    $("#power-icon").hide();
    $("#power-icon-on").show();
    $("#off-txt").css("color", "var(--yllw)");
    $("#off-txt").addClass("on-yllw");
  }
  enviaRasp();
});

//============Envia comandos para o Rasp==============
function enviaRasp() {
  var obJson = { // cria objeto JSON de comando do TX
    "power": power,
    "carrier": carrier,
    "page": page,
    "led_pll": led_pll,
    "led_pa": led_pa,
    "led_temp": led_temp,
    "led_ac": led_ac,
    "led_swr": led_swr,
    "led_mute": led_mute
  }
  let msgComando = JSON.stringify(obJson); //Converte objeto Json para string
  console.log("Enviando para o Rasp");
  console.log(msgComando);
  websocket.send(msgComando); // Envia para o Rasp via websocket
}

