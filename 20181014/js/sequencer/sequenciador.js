"use strict";
/*  Código edsddddesenvolvido por: W. Ramon Bessa e o NAP - Núcleo Amazônico de Pesquisa Musical
Registrado sob a licença  Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

*/
class Sequenciador {
    constructor(controlFiles, tooltip, dao, audioCtx) {
        this.testeThis = "This do sequenciador está ok";
        this.listCodesBuffersEdited = [];
        this.playedCurrentAudio = false;
        this.activePlay = false;
        this.activeLoop = false;
        this.activePause = false;
        this.activecurrentAudio = false;
        this.activeAudioOptionsPanel = false;
        this.bufferList = [];
        //Listas de controle de inserção
        this.newListBufferError = [];
        this.newListBufferOk = [];
        this.newListBufferProv = [];
        //
        this.startAt = 0;
        this.pauseAt = 0;
        this.generateIcons = true;
        this.controlIdItemMix = 1;
        this.audioOptionsPanel = false;
        this.stopFlag = true;
        this.nameList = [];
        //counterListDecode do buffer list da funcao de loadBufferList
        this.counterListDecode = 0;
        this.controlFiles = controlFiles;
        this.tooltip = tooltip;
        this.dao = dao;
        this.audioCtx = audioCtx;
    }
    stop(callback) {
        if (this.activePlay || this.activePause) {
            //   this.tooltip.showMessage("Pausado")
            if (!this.stopFlag) {
                this.pauseAt = 0;
                this.mixing.stop(0);
                this.stopFlag = true;
                this.activePlay = false;
                this.painel.stopDrawLoopMarker();
                callback();
            }
        }
    }
    ;
    changeLoop() {
        if (this.activeLoop) {
            this.activeLoop = false;
        }
        else {
            this.activeLoop = true;
        }
    }
    ;
    getTotalTime() {
        var totalTime = 0;
        var l, o;
        for (l = 0; l < this.dao.listItemMixPanel.length; l = l + 1) {
            if (this.dao.listItemMixPanel[l]) {
                for (o = 0; o < this.dao.listItemMixPanel[l].length; o = o + 1) {
                    if (this.dao.listItemBuffer[this.dao.listItemMixPanel[l][o].idBuffer].timeDuration + this.dao.listItemMixPanel[l][o].startTime > totalTime) {
                        //console.log("Start time: " + this.dao.listItemMixPanel[l][o].startTime + " Duração: " + this.dao.listItemBuffer[this.dao.listItemMixPanel[l][o].idBuffer].timeDuration);
                        //console.log("Alterando total time p/ : " + (this.dao.listItemBuffer[this.dao.listItemMixPanel[l][o].idBuffer].timeDuration + this.dao.listItemMixPanel[l][o].startTime));
                        //console.log("Tipo do objeto: " + typeof (this.dao.listItemMixPanel[l][o].startTime));
                        totalTime = this.dao.listItemBuffer[this.dao.listItemMixPanel[l][o].idBuffer].timeDuration + this.dao.listItemMixPanel[l][o].startTime;
                        //console.log("Total time alterado p/: " + totalTime);
                    }
                }
            }
        }
        //console.log("Total time final: " + totalTime);
        return totalTime;
    }
    ;
    //Verifica se tem algum item no painel
    haveItemMix() {
        var possuiItemMix = false;
        //console.log("have item mix")
        //console.log(this.dao.listItemMixPanel);
        //console.log("this.dao.listItemMixPanel.length")
        //console.log(this.dao.listItemMixPanel.length);
        for (let l = 0; l < this.dao.listItemMixPanel.length; l = l + 1) {
            if (this.dao.listItemMixPanel[l]) {
                for (let o = 0; o < this.dao.listItemMixPanel[l].length; o = o + 1) {
                    possuiItemMix = true;
                    break;
                    break;
                }
            }
        }
        return possuiItemMix;
    }
    ;
    pause(callback) {
        if (this.activePlay) {
            this.activePause = true;
            this.activePlay = false;
            this.mixing.stop(0);
            this.pauseAt = Date.now() - this.startAt;
            this.painel.pauseDrawLoopMarker();
            callback();
        }
    }
    ;
    //FUnção que starta e faz as verifcacoes
    // de requisitos para que se possa executar o play da aplicação
    play(onPlay, onEndPlayList) {
        // this.dao.saveLocalStorage();
        console.log("play - Iniciando Play");
        if (this.haveItemMix()) {
            if (!this.activePlay) {
                const callback = (bufferRendered) => {
                    console.log("play - Callback - recebendo valor final para executar ");
                    const buffer = bufferRendered;
                    this.activePause = false;
                    //   var l, o;
                    this.activePlay = true;
                    this.stopFlag = false;
                    this.mixing = this.audioCtx.createBufferSource();
                    this.mixing.buffer = buffer;
                    this.mixing.connect(this.audioCtx.destination);
                    this.mixing.onended = () => { this.onEndPlayDefault(onEndPlayList); };
                    if (this.pauseAt) {
                        this.startAt = Date.now() - this.pauseAt;
                        this.painel.continueLoopMarker(this.pauseAt);
                        this.mixing.start(0, this.pauseAt / 1000);
                        this.unPause();
                    }
                    else {
                        this.painel.startLoopMarker(this.getTotalTime());
                        this.startAt = Date.now();
                        this.mixing.start(0);
                    }
                    //se tiver algum onPlay como parametro
                    if (onPlay) {
                        onPlay();
                    }
                };
                console.log("play - antes de this.mix(callback); ");
                this.mix(callback);
                console.log("play - depois de this.mix(callback); ");
            }
        }
        else {
            this.tooltip.showMessage("Não existem itens no painel.");
        }
    }
    ;
    //res
    unPause() {
        this.activePause = false;
        this.pauseAt = 0;
    }
    ;
    getMaxChannelsPlayList() {
        var maxChannels = 0;
        var l, o;
        for (l = 0; l < this.dao.listItemMixPanel.length; l = l + 1) {
            if (this.dao.listItemMixPanel[l]) {
                for (o = 0; o < this.dao.listItemMixPanel[l].length; o = o + 1) {
                    if (this.dao.listItemBuffer[this.dao.listItemMixPanel[l][o].idBuffer].numberOfChannels > maxChannels) {
                        maxChannels = this.dao.listItemBuffer[this.dao.listItemMixPanel[l][o].idBuffer].numberOfChannels;
                        //console.log("maximo de canais: " + maxChannels);
                    }
                }
            }
        }
        return maxChannels;
    }
    ;
    codeRegitred(list, codeEdited) {
        const codigoJaInserido = list.some((item) => {
            return (item.idBuffer == codeEdited.idBuffer) && (item.volume == codeEdited.volume) && (item.idSemanticDescriptor == codeEdited.idSemanticDescriptor);
        });
    }
    getIdBuffersEdited(codeSearsh) {
        for (let index = 0; index < this.listCodesBuffersEdited.length; index++) {
            if ((this.listCodesBuffersEdited[index].idBuffer == codeSearsh.idBuffer) && (this.listCodesBuffersEdited[index].volume == codeSearsh.volume) && (this.listCodesBuffersEdited[index].idSemanticDescriptor == codeSearsh.idSemanticDescriptor)) {
                return index;
            }
        }
        return -1;
    }
    //Função para retorna a lista de buffers modificados
    async returnListBufferEdited() {
        this.listCodesBuffersEdited = [];
        console.log("returnListBufferEdited");
        let promises = [];
        let codes = [];
        for (let line = 0; line < this.dao.listItemMixPanel.length; line++) {
            //Se a linha tiver algo
            if (this.dao.listItemMixPanel[line]) {
                for (let itemOfLine = 0; itemOfLine < this.dao.listItemMixPanel[line].length; itemOfLine++) {
                    //Se os valores forem difrente dos iniciais volume==100 e 
                    //idDescritor!= undefinide
                    //então vai ser preciso gerar o novo buffer dele
                    if (!this.dao.listItemMixPanel[line][itemOfLine].getStandardValues()) {
                        //console.log("async returnListBufferEdited() { verificando o "+ this.dao.listItemMixPanel[line][itemOfLine].getCodeIdentificationItemMixPanel())
                        console.log(this.dao.listItemMixPanel[line][itemOfLine].getCodeIdentificationItemMixPanel());
                        if (!this.codeRegitred(codes, this.dao.listItemMixPanel[line][itemOfLine].getCodeIdentificationItemMixPanel())) {
                            console.log("Insere");
                            promises.push(this.mixItemOption2(this.dao.listItemMixPanel[line][itemOfLine]));
                            codes.push(this.dao.listItemMixPanel[line][itemOfLine].getCodeIdentificationItemMixPanel());
                        }
                        else {
                            console.log("Não precisa");
                        }
                    }
                }
            }
        }
        let listAudioBuffer = [];
        try {
            console.log("Complete returnListBufferEdited");
            listAudioBuffer = await Promise.all(promises);
            console.log("TEste getChanel data");
            console.log(listAudioBuffer);
            //console.log(codes)
            console.log("newsBuffes in  async returnListBuffer() {");
            console.log(listAudioBuffer);
            this.listCodesBuffersEdited = codes;
            return listAudioBuffer;
        }
        catch (error) {
            console.log("Error ao criar buffers editados");
            console.log(error);
        }
    }
    getListBuffersSourceEdited(listAudioBuffer) {
        let listBufferSourceEdited = [];
        for (let index = 0; index < listAudioBuffer.length; index++) {
            const bufferSourceEdited = this.audioCtx.createBufferSource();
            bufferSourceEdited.buffer = listAudioBuffer[index];
            //bufferSourceEdited.code = listAudioBuffer[index]
            listBufferSourceEdited.push(bufferSourceEdited);
        }
        return listBufferSourceEdited;
    }
    mix(callback) {
        console.log("Mix - Ao entrar");
        this.returnListBufferEdited().then(listAudioBufferPromisses => {
            console.log("Mix then returnListBufferEdited");
            let listBuffersSourceEdited = this.getListBuffersSourceEdited(listAudioBufferPromisses);
            if (this.haveItemMix()) {
                var maxChannels = this.getMaxChannelsPlayList();
                var frameCount = this.audioCtx.sampleRate * this.getTotalTime();
                var out = this.audioCtx.createBuffer(maxChannels, frameCount, this.audioCtx.sampleRate);
                //Percorrer todos os buffers
                for (var l = 0; l < this.dao.listItemMixPanel.length; l = l + 1) {
                    //percorrer os itensMixPanel de cada buffer ( se a linha tiver algo)
                    if (this.dao.listItemMixPanel[l]) {
                        for (var o = 0; o < this.dao.listItemMixPanel[l].length; o = o + 1) {
                            //Percorrer os canais
                            //Se for mute e  excluido não entra na mixagem
                            if (this.dao.listItemMixPanel[l][o].solo && !this.dao.listItemMixPanel[l][o].excluded) {
                                for (var channel = 0; channel < maxChannels; channel++) {
                                    if (channel <= (this.dao.listItemBuffer[this.dao.listItemMixPanel[l][o].idBuffer].numberOfChannels - 1)) {
                                        var v = out.getChannelData(channel);
                                        //Verifica se os valores iniciais foram alterados ou não
                                        //se estiver sem alterações pega o valor do buffer
                                        //se tiver sido alterado faz a busca
                                        let mix;
                                        if (this.dao.listItemMixPanel[l][o].getStandardValues()) {
                                            mix = this.dao.listItemBuffer[this.dao.listItemMixPanel[l][o].idBuffer].buffer.getChannelData(channel);
                                        }
                                        else {
                                            console.log("this.getIdBuffersEdited(listBuffersSourceEdited, this.dao.listItemMixPanel[l][o].getCodeIdentificationItemMixPanel())");
                                            console.log(this.getIdBuffersEdited(this.dao.listItemMixPanel[l][o].getCodeIdentificationItemMixPanel()));
                                            console.log(listBuffersSourceEdited);
                                            mix = listBuffersSourceEdited[this.getIdBuffersEdited(this.dao.listItemMixPanel[l][o].getCodeIdentificationItemMixPanel())].buffer.getChannelData(channel);
                                        }
                                        for (var i = 0; i < mix.length; i++) {
                                            var r = Math.floor(i + (this.audioCtx.sampleRate * this.dao.listItemMixPanel[l][o].startTime));
                                            v[r] += (mix[i]);
                                            /*Antes quando o volume era editado sem o gainnode
                                            v[r] += (mix[i] * (this.dao.listItemMixPanel[l][o].getVolume() / 100));
                                            */
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                callback(out);
            }
            else {
                //console.log("não tem nada");
            }
        });
    }
    ;
    mixItemOption(itemMixOption) {
        let maxChannels = this.getMaxChannelsPlayList();
        let frameCount = this.audioCtx.sampleRate * this.dao.listItemBuffer[itemMixOption.idBuffer].timeDuration;
        let out = this.audioCtx.createBuffer(maxChannels, frameCount, this.audioCtx.sampleRate);
        //Percorrer todos os buffers
        if (itemMixOption.solo) {
            for (var channel = 0; channel < maxChannels; channel++) {
                if (channel <= (this.dao.listItemBuffer[itemMixOption.idBuffer].numberOfChannels - 1)) {
                    var v = out.getChannelData(channel);
                    var mix = this.dao.listItemBuffer[itemMixOption.idBuffer].buffer.getChannelData(channel);
                    for (var i = 0; i < mix.length; i++) {
                        var r = Math.floor(i);
                        //   v[r] += mix[i];
                        // //console.log("Volume"+itemMixOption.volume)
                        // v[r] += (mix[i] * (itemMixOption.volume / 100));
                        v[r] += (mix[i]);
                    }
                }
            }
        }
        return out;
    }
    ;
    startDownload(onStartDownload) {
        var index = 0, inputIndex = 0;
        var result = [];
        if (this.haveItemMix()) {
            const callback = (bufferRendered) => {
                console.log("startDownload - Callback - recebendo valor final para executar ");
                console.log(bufferRendered);
                let mixingDownload = this.audioCtx.createBufferSource();
                mixingDownload.buffer = bufferRendered;
                //  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                var worker = new WorkerWav(this.audioCtx.sampleRate);
                var buffer2 = [];
                var now = new Date();
                var nameFile = "SoundSphere A" + now.getFullYear() + "M" + (now.getMonth() + 1) + "D" + now.getDate() + "H" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds();
                var maxChannels = mixingDownload.buffer.numberOfChannels;
                console.log("mixingDownload");
                console.log(mixingDownload);
                console.log("maxChannels");
                console.log(maxChannels);
                var i;
                for (i = 0; i < maxChannels; i = i + 1) {
                    console.log("mixingDownload.getChannelData(i)");
                    console.log(mixingDownload.buffer.getChannelData(i));
                    buffer2[i] = mixingDownload.buffer.getChannelData(i);
                }
                // send the channel data from our buffer to the worker
                worker.record(buffer2);
                var blob2 = worker.exportWAV();
                var url = URL.createObjectURL(blob2);
                var li = document.createElement('li');
                var au = document.createElement('audio');
                var hf = document.createElement('a');
                au.controls = true;
                au.src = url;
                hf.href = url;
                hf.download = nameFile + '.wav';
                hf.innerHTML = hf.download;
                li.appendChild(au);
                li.appendChild(hf);
                hf.click();
                onStartDownload();
            };
            this.mix(callback);
        }
        else {
            this.tooltip.showMessage("Nenhum item carregado na mixagem.");
            onStartDownload();
        }
    }
    stopOneSound() {
        this.tooltip.removeMessageFixed();
        if (this.activecurrentAudio) {
            //console.log("chamou stop one sound")
            //console.log(this.currentAudio.buffer)
            if (this.currentAudio.buffer) {
                this.currentAudio.stop(0);
            }
            this.activecurrentAudio = false;
        }
    }
    ;
    fomateFilters(filters, ctx) {
        let filtersList_1 = [];
        if (filters != null) {
            for (let index = 0; index < filters.length; index++) {
                if (filters[index].status) {
                    let filter = ctx.createBiquadFilter();
                    filter.type = filters[index].type;
                    filter.name = filters[index].name;
                    filters[index].frequency ? filter.frequency.value = filters[index].frequency : "";
                    filters[index].Q ? filter.Q.value = filters[index].Q : "";
                    filters[index].gain ? filter.gain.value = filters[index].gain : "";
                    filtersList_1.push(filter);
                }
            }
        }
        return filtersList_1;
    }
    getBufferOfItemMixPanel() {
    }
    //Função usada para fazer o download de um item mix de acordo
    //com as edições que foram realziados nele
    mixItemOption2(itemMixPanel) {
        //console.log("xxxxxxxxxxxxxxxxxxxxxxxxSize variable dao: " + roughSizeOfObject(this.dao))
        let maxChannels = this.getMaxChannelsPlayList();
        //console.log("TIME DURATION")
        let frameCount = this.audioCtx.sampleRate * this.dao.listItemBuffer[itemMixPanel.idBuffer].timeDuration;
        let out = this.audioCtx.createBuffer(maxChannels, frameCount, this.audioCtx.sampleRate);
        // this.activecurrentAudio = true;
        let offlineCtx = new OfflineAudioContext(maxChannels, frameCount, this.audioCtx.sampleRate);
        let currentAudio2 = offlineCtx.createBufferSource();
        currentAudio2.buffer = this.dao.listItemBuffer[itemMixPanel.idBuffer].buffer;
        let gainNode = offlineCtx.createGain();
        let filtersList_1;
        //console.log("Volume: " + (itemMixPanel.volume / 100))
        gainNode.gain.value = (itemMixPanel.getVolume() / 100);
        if (itemMixPanel.getidSemanticDescriptor() != undefined) {
            filtersList_1 = this.fomateFilters(this.dao.listSemanticDescriptors[itemMixPanel.getidSemanticDescriptor()].getFilters(), offlineCtx);
        }
        else {
            filtersList_1 = [];
        }
        if (filtersList_1.length) {
            currentAudio2.connect(filtersList_1[0]);
            for (var index = 0; index < filtersList_1.length; index++) {
                if (index + 1 < filtersList_1.length) {
                    filtersList_1[index].connect(filtersList_1[index + 1]);
                }
                else {
                    filtersList_1[index].connect(gainNode);
                    gainNode.connect(offlineCtx.destination);
                }
            }
        }
        else {
            currentAudio2.connect(gainNode);
            gainNode.connect(offlineCtx.destination);
        }
        currentAudio2.start();
        return offlineCtx.startRendering();
        // offlineCtx.startRendering().then((renderedBuffer: any) => {
        //     callback(renderedBuffer);
        // }).catch(function (err: Error) {
        //     //console.log('Rendering failed: ' + err);
        //     // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
        // });
    }
    playOneSoundDescitor(id, callBack, filters) {
        //console.log("sequenciador.playonesound")
        //  if (!this.activecurrentAudio) {
        //console.log("if (!this.activecurrentAudio) { sequenciador.playonesound")
        this.activecurrentAudio = true;
        this.currentAudio = this.audioCtx.createBufferSource();
        this.currentAudio.buffer = this.dao.listItemBuffer[id].buffer;
        let filtersList_1 = this.fomateFilters(filters, this.audioCtx);
        if (filtersList_1.length) {
            let connections = "Filtros: <br/>";
            this.currentAudio.connect(filtersList_1[0]);
            for (var index = 0; index < filtersList_1.length; index++) {
                if (index + 1 < filtersList_1.length) {
                    connections += " " + filtersList_1[index].name + " -> <br/>";
                    filtersList_1[index].connect(filtersList_1[index + 1]);
                }
                else {
                    connections += filtersList_1[index].name + "-> <br/> Saída de Audio";
                    filtersList_1[index].connect(this.audioCtx.destination);
                }
            }
            this.tooltip.showMessageFixed(connections);
        }
        else {
            this.tooltip.showMessageFixed("Nenhum filtro sendo utilizado!");
            this.currentAudio.connect(this.audioCtx.destination);
        }
        this.currentAudio.onended = (e) => {
            this.activecurrentAudio = false;
            this.tooltip.removeMessageFixed();
        };
        this.currentAudio.start(0);
        this.activecurrentAudio = true;
    }
    ;
    playOneSound(id, callBack) {
        this.activecurrentAudio = true;
        this.currentAudio = this.audioCtx.createBufferSource();
        this.currentAudio.buffer = this.dao.listItemBuffer[id].buffer;
        this.currentAudio.connect(this.audioCtx.destination);
        this.currentAudio.onended = callBack;
        this.currentAudio.start(0);
        this.activecurrentAudio = true;
    }
    ;
    playOneSoundOption(itemMixOption) {
        this.activecurrentAudio = true;
        this.currentAudio = this.audioCtx.createBufferSource();
        let teste = [];
        teste.push(this.mixItemOption2(itemMixOption));
        Promise.all(teste)
            .then((values) => {
            let rendered = values[0];
            if (this.activecurrentAudio) {
                let mensagem = `Amostra: ${this.dao.listItemBuffer[itemMixOption.idBuffer].name} </br>`;
                mensagem += `Status: ${itemMixOption.solo ? `Solo` : `<b> Mute</b>`} </br>`;
                if (itemMixOption.idSemanticDescriptor != undefined) {
                    mensagem += `Decritor: ${this.dao.listSemanticDescriptors[itemMixOption.idSemanticDescriptor].name} </br>`;
                }
                else {
                    mensagem += `Decritor: nenhum </br>`;
                }
                mensagem += `Volume: ${itemMixOption.volume} </br>`;
                this.tooltip.showMessageFixed(mensagem);
                //console.log("no callback")
                //console.log("Antes")
                //console.log(this.currentAudio.buffer)
                this.currentAudio.buffer = rendered;
                //console.log("no callback")
                //console.log("depois")
                //console.log(this.currentAudio.buffer)
                this.currentAudio.connect(this.audioCtx.destination);
                this.currentAudio.onended = (e) => {
                    //console.log("no end")
                    //console.log("callback activecurrentAudio")
                    //console.log(this.activecurrentAudio)
                    this.activecurrentAudio = false;
                    this.tooltip.removeMessageFixed();
                };
                this.currentAudio.start(0);
                //console.log("callback activecurrentAudio")
                //console.log(this.activecurrentAudio)
            }
        })
            .catch((err) => {
            //console.log('catch', err);
        });
    }
    ;
    onEndPlayDefault(callBack) {
        //console.log("onEndPlayDefault")
        this.activePlay = false;
        if (this.activeLoop && (!this.stopFlag) && (!this.activePause)) {
            //console.log("LoopAtivo")
            this.play(undefined, callBack);
        }
        else {
            //console.log("Encerrando")
            callBack();
        }
    }
}
function roughSizeOfObject(object) {
    var objectList = [];
    var stack = [object];
    var bytes = 0;
    while (stack.length) {
        var value = stack.pop();
        if (typeof value === 'boolean') {
            bytes += 4;
        }
        else if (typeof value === 'string') {
            bytes += value.length * 2;
        }
        else if (typeof value === 'number') {
            bytes += 8;
        }
        else if (typeof value === 'object'
            && objectList.indexOf(value) === -1) {
            objectList.push(value);
            for (var i in value) {
                stack.push(value[i]);
            }
        }
    }
    return bytes;
}
