"use strict";
/*  Código desenvolvido por: W. Ramon Bessa e o NAP - Núcleo Amazônico de Pesquisa Musical
Registrado sob a licença  Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

*/
class ControlFiles {
    constructor() {
        // listUploadedFileNames: string[] = [];
        // listFilesInvalid: string[] = [];
        this.listColors = ["rgb(0,0,0)",
            "rgb(0,0,255)",
            "rgb(0,255,0)",
            "rgb(255,0,0)",
            "rgb(0,255,255)",
            "rgb(255,255,0)",
            "rgb(255,0,255)",
            "rgb(100,0,0)",
            "rgb(0,100,0)",
            "rgb(0,0,100)",
            "rgb(100,100,100)",
            "rgb(100,100,0)",
            "rgb(255,100,100)",
            "rgb(100,100,255)",
            "rgb(100,255,100)",
            "rgb(100,100,10)",
            "rgb(140,10,0)",
            "rgb(0,130,144)",
            "rgb(30,40,133)",
            "rgb(180,10,13)",
            "rgb(103,1,5)",
            "rgb(20,140,255)",
            "rgb(90,180,144)",
            "rgb(120,0,144)",
            "rgb(120,110,144)",
            "rgb(120,0,0)",
            "rgb(255,10,148)",
            "rgb(19,100,148)",
            "rgb(19,1,14)",
            "rgb(19,24,8)",
            "rgb(19,200,86)",
            "rgb(19,30,18)",
            "rgb(19,100,48)",
            "rgb(255,10,98)",
            "rgb(7,10,148)",
            "rgb(7,100,8)",
            "rgb(5,50,13)",
            "rgb(5,200,85)",
            "rgb(5,0,18)",
            "rgb(5,130,48)",
            "rgb(5,20,148)",
            "rgb(55,10,148)",
            "rgb(55,100,18)",
            "rgb(55,170,48)",
            "rgb(55,1,238)",
            "rgb(55,190,89)",
            "rgb(55,250,18)",
            "rgb(55,167,48)",
        ];
        //Funções para ordenação
    }
    //Verifica se o arquivoo já foi carregado
    // fileLoaded(name: string): boolean {
    //     for (var i = 0; i < this.listUploadedFileNames.length; i++) {
    //         console.log(`Verificando nome: ${this.listUploadedFileNames[i]} se é igual a ${name}`)
    //         if (this.listUploadedFileNames[i] == name) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    //Adiciona a lista passada como parametro no final da lista existente
    // addList(lista: any): void {
    //     this.listUploadedFileNames = this.listUploadedFileNames.concat(lista.sort(sortByDataString));
    // };
    getColor(j) {
        return this.listColors[j];
    }
    ;
    orderListByName(lista) {
        console.log("Order by name");
        console.log(lista);
        //Adiciona a lista passada como parametro no final da lista existente
        return lista.sort(sortByDataString);
    }
    ;
}
function isNumber(n) {
    "use strict";
    return !isNaN(parseFloat(n)) && isFinite(n);
}
// String sorting function
function sortByDataString(a1, b2) {
    let a = a1.toLowerCase();
    let b = b2.toLowerCase();
    console.log("A1 " + a1 + "a " + a);
    if (a === null) {
        return 1;
    }
    if (b === null) {
        return -1;
    }
    if (isNumber(a) && isNumber(b)) {
        if (parseInt(a, 10) === parseInt(b, 10)) {
            return 0;
        }
        return parseInt(a, 10) > parseInt(b, 10) ? 1 : -1;
    }
    if (isNumber(a)) {
        return -1;
    }
    if (isNumber(b)) {
        return 1;
    }
    if (a === b) {
        return 0;
    }
    return a > b ? 1 : -1;
}
//Função antiga para remvoer itens invalidos
//Remover item da lista de arquivos validos por ser diferente de stero
//ControlColor.prototype.removeFile = function(index) {
//  console.log("vai ser removido: " + this.listUploadedFileNames[index]);
//    var node = document.getElementById(index+"div");
//    node.style.display="none";
//    listNamesInvalid.push(this.listUploadedFileNames[index] + ": só são permitidos arquivos mono, stereo, quad e 5.1  ");
//}
//Get tamanho
// ControlColor.prototype.listUploadedFileNamesLenght = function (j) {
//     return this.listUploadedFileNames.length;
// };
//Passa a posição de acordo com o nome
// ControlColor.prototype.getPosition = function (fileName) {
//     "use strict";
//     var i;
//     for (i = 0; i < this.listUploadedFileNames.length; i = i + 1) {
//         if (this.listUploadedFileNames[i] === fileName) {
//             return i;
//         }
//     }
// };
// //Passa o nome de acordo com a posição
// ControlColor.prototype.getName = function (j) {
//     "use strict";
//     return this.listUploadedFileNames[j];
// };
