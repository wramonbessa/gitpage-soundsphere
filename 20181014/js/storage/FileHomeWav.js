"use strict";
class FileHomeWav extends FileWav {
    constructor(sequenciador, dao, tooltip, simplePage) {
        super(sequenciador, dao);
        this.listNamesValid = [];
        this.callBackToLoadWav = function () {
            this.desativaModalLoad();
            this.listNamesInvalid = this.listNamesInvalid.concat(this.dao.listMessagesError);
            if (this.listNamesInvalid.length > 0) {
                this.simplePage.showErrorMessageJson3(this.listNamesInvalid);
            }
            console.log("CHEGOUIUUUUUUUUUUUUUUUU");
            this.simplePage.nextStepJson2To3();
        }.bind(this);
        this.simplePage = simplePage;
        $('#fileHomeWav').on('change', (evt) => {
            "use strict";
            console.log("Chamou handledFIleselect file home");
            this.listNamesInvalid = [];
            this.listNamesValid = this.dao.getListNameOfBuffers();
            let files = [], divLoading = document.getElementById('divLoading'), i, f, reader, audio, result;
            if (navigator.userAgent.match(/Android/i)) {
                files = evt.target.files;
            }
            else {
                for (let i = 0; i < evt.target.files.length; i++) {
                    let sameName = false;
                    for (let index = 0; index < this.listNamesValid.length; index++) {
                        if (evt.target.files[i].name == this.listNamesValid[index]) {
                            sameName = true;
                        }
                    }
                    if (sameName) {
                        files.push(evt.target.files[i]);
                    }
                    else {
                        this.listNamesInvalid.push(evt.target.files[i].name + ": - Arquivo não carregado, pois não está na lista");
                    }
                }
            }
            //Se os arquivos carregados tiver algum que pode ser utilizado e que atenda os requisitos
            //ele entra no primeiro IF, se não é exibido logo a mensagem de erro  
            if (files.length == this.listNamesValid.length) {
                if (divLoading) {
                    divLoading.setAttribute('class', 'ui inverted dimmer active');
                }
                this.dao.listItemBuffer = [];
                this.loadFilesWav(files);
            }
            else {
                this.desativaModalLoad();
                this.showMessageErrorWav();
            }
        });
    }
    onReaderWav(bufferList) {
        this.dao.loadBufferList(bufferList, this.callBackToLoadWav);
    }
    showMessageErrorWav() {
        this.simplePage.showErrorMessageJson2(this.listNamesInvalid);
    }
}
