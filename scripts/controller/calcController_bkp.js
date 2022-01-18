class CalcController{
    constructor(){
        this._operation = [];
        this._locale = navigator.language;
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }

    initialize(){
        // setInterval = repete a cada x ms
        // setTimeout = espera x ms e executa

        this.setDisplayDateTime();
        let interval = setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);

        /*setTimeout(()=>{
            clearInterval(interval);
        }, 10000);*/

    }

    addEventListenerAllMod(element, events, fn){
        //String to array
        // divido a string em um array e em cada evento,
        // executo o evento: click, drag...
        events.split(' ').forEach(event=>{
            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){
        this._operation = [];
    }

    cancelEntry(){
        this._operation.pop();
    }

    getLastOperation(){
        //alert('getLastOperation: '+this._operation);
        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){
        //alert('setLastOperation: '+value);
        this._operation[this._operation.length-1] = value;
    }

    isOperator(value){
        // Verifica se o usuário substituiu o operador
        // Verifica no array se o valor é um operador
        //alert('isOperator: '+value);
        return (['+', '-', '*', '/', '%', ].indexOf(value)>-1);
    }

    makecalculation(){
        let resultado=0;
        // Percorro o array e gero uma string
        this._operation.forEach((v)=>{
            resultado += v;
        });

        // Transformar string em script
        resultado = eval(resultado.toString());
        console.log(parseInt(resultado));
    }

    // Verificação se o caractere for número,
    // para concatenar valores ao invés de separar
    // ex: Quero adicionar 111, ele concatena os uns ao
    // invés de adicionar 1, 1, 1
    addOperation(value){

        // isNan = is not a number
        if (isNaN(this.getLastOperation())){
            // String
            if(this.isOperator(value)){
                // Trocar o operador
                // Se for operador, substitua
                this.setLastOperation(value);
            }else if(isNaN(value)){ // array vazio: undefined

            }else{
                this._operation.push(value);
            }
        }else{
            if(this.isOperator(value)){
                this._operation.push(value);
            }else{
                // Number
                let newValue = this.getLastOperation().toString() + value.toString(); // Converter pra string para concatenar os números
                this.setLastOperation(parseInt(newValue));
            }

        }



        console.log(this._operation);
    }

    setError(){
        this.displayCalc = 'Error';
    }


    execBtn(value){
        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.cancelEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
            break;

            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.addOperation('=');
                this.makecalculation();
                break;

            case 'ponto':
                this.addOperation('.');
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents(){

        /* selecionando apenas 1 click
        let buttons = document.querySelectorAll('#buttons>g.btn-9');
        // Parãmetro do arrow function e=>
            addEventListener('click', e=>{
                console.log(e);
            });
        */


        let buttons = document.querySelectorAll('#buttons>g,#parts>g');

        buttons.forEach((btn, index)=>{
            this.addEventListenerAllMod(btn, 'click drag', e=>{
                let textBtn = btn.className.baseVal.replace('btn-', '');
                this.execBtn(textBtn);
                this.getLastOperation();
            });

            this.addEventListenerAllMod(btn, 'mouseover mouseup mousedown ', e=>{
                btn.style.cursor = 'pointer';
            });
        })
    }

    setDisplayDateTime(){
        //seters
        // Entra no set dateEl e no get currentDate
        this.dateEl = this.currentDate.toLocaleDateString(this._locale);
        this.timeEl = this.currentDate.toLocaleTimeString(this._locale);
    }

    /* geters and setters */

    // currentDate
    get currentDate(){
        return new Date();
    }
    set currentDate(value){
        this._currentDate = value;
    }

    // displayCalc
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }

    // dateEl
    get dateEl(){
        return this._dateEl;
    }
    set dateEl(value){
        this._dateEl.innerHTML = value;
    }

    // timeEl
    get timeEl(){
        return this._timeEl;
    }
    set timeEl(value){
        this._timeEl.innerHTML = value;
    }

}
