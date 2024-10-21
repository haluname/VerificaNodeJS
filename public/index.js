var ricette = []

var secLista, secRicetta, 
    ingredienti, preparazione, titolo, tipo, txtCerca, btnSalva;
    window.onload = () => {
        secRicetta = document.getElementById("secRicetta");
        secLista = document.getElementById("secListRicette");
        let listaRicette = secLista.querySelector("main");
        titolo = secRicetta.querySelector("#datiRicetta h1");
        tipo = secRicetta.querySelector("#datiRicetta h3");
        ingredienti = secRicetta.querySelector("#ingredienti main");
        preparazione = secRicetta.querySelector("#preparazione main");
        txtCerca = document.querySelector("input[type=search]");
        txtCerca.addEventListener("change", aggiornaLista);
        btnSalva = document.getElementById("btnSalva");
        btnSalva.addEventListener("click", salvaRicetta);
    
        let btnCreaNuovaRicetta = document.getElementById("btnCreaNuovaRicetta");
        btnCreaNuovaRicetta.addEventListener("click", createRecipe);
    
        fetch("/getRicette")
            .then(response => response.json())
            .then(ricette => {
                refreshList(ricette);
            })
            .catch(err => console.error("errore nelle ricette:", err));
    };
    
    

function aggiornaLista() {
    let filtro = txtCerca.value;

    fetch(`/getRicetteByFilter?filtro=${filtro}`)
        .then(response => response.json())
        .then(ricette => {
            refreshList(ricette);
        })
        .catch(err => console.error("Errore nel filtrare le ricette:", err));
}


function refreshList(ricette) {
    let listaRicette = secLista.querySelector("main");
    listaRicette.innerHTML = ""; 

    for (let ricetta of ricette) {
        let art = document.createElement("article");
        art.innerHTML = ricetta.titolo;
        art.addEventListener("click", () => {
            titolo.innerText = ricetta.titolo;
            tipo.innerText = ricetta.tipo;
            ingredienti.innerHTML = "";
            preparazione.innerHTML = "";

            for (let item of ricetta.elenchi) {
                if (item.titolo === "ingredienti" || item.titolo === "ingrediente") {
                    for (let ing of item.elementi) {
                        inserisciIngrediente(ing);
                    }
                } else {
                    for (let idProc in item.elementi) {
                        inserisciPreparazione(idProc, item.elementi[idProc]);
                    }
                }
            }

            secLista.style.display = "none";
            secRicetta.style.display = "flex";
        });
        listaRicette.appendChild(art);
    }
}


function inserisciIngrediente(item){
    let article = document.createElement("article");
    let h1 = document.createElement("div");
    h1.innerText = item.desc;
    article.appendChild(h1);
    if(item.qta){
       let h3 = document.createElement("div");
       h3.innerText = item.qta + (item.qta>10?" gr":""); 
       article.appendChild(h3);
    }
    ingredienti.appendChild(article);
}

function inserisciPreparazione(nPassaggio, item){
    let article = document.createElement("article");
    let num = document.createElement("div");
    num.className = "numero";
    num.innerText = nPassaggio;
    article.appendChild(num);
    addImage(article, item.desc);
    let desc = document.createElement("div");
    desc.className = "desc";
    desc.innerText = item.desc;
    article.appendChild(desc);
    preparazione.appendChild(article);
}

function addImage(article, desc){
    let img = ["aggiunger", "bollir", "cuocer",
        "forno", "mescolar", "pelar", "tagliar"];
    desc = desc.toLowerCase();
    let i=0;
    while(i<img.length && !desc.includes(img[i]))
        i++;
    if(i<img.length){
        let imgTag = document.createElement("img");
        imgTag.src = "img/"+img[i]+".png";
        article.appendChild(imgTag);
    }
}

function createRecipe(){
    titolo.innerHTML = "Nome ricetta: <input type='text'>";
    tipo.innerHTML = "Categoria ricetta: <input type='text'>";
   
    addIngrediente();
    addPreparazione();
    
    btnSalva.style.display = "block";
    secLista.style.display = "none";
    secRicetta.style.display = "flex";
}

function addPreparazione(){
    let art = document.createElement("article"),
        texta = document.createElement("textarea"),
        div0 = document.createElement("div"),
        div1 = document.createElement("div"),
        div2 = document.createElement("div"),
        btnP = document.createElement("button"),
        btnR = document.createElement("button"),
        btnPrec = document.createElement("button"),
        btnSucc = document.createElement("button");
    btnP.innerText = "+"; btnR.innerText = "x";
    btnPrec.innerText = "◄"; btnSucc.innerText = "►";
    div1.appendChild(btnP); div1.appendChild(btnR);
    div2.appendChild(btnPrec); div2.appendChild(btnSucc);
    art.appendChild(texta); art.appendChild(div0); 
    div0.appendChild(div1); div0.appendChild(div2);

    btnP.addEventListener("click", addPreparazione.bind(this));
    btnR.addEventListener("click", ()=>{ art.remove(); })

    preparazione.appendChild(art);
}

function addIngrediente(){
    let art = document.createElement("article"),
        div1 = document.createElement("div"),
        div2 = document.createElement("div"),
        btnP = document.createElement("button"),
        btnR = document.createElement("button");
    div1.innerHTML = `<div>
            <input type="text" placeholder="Ingrediente">
            <input type="number" placeholder="Quantità">
        </div>`;
    btnP.innerText = "+"; btnR.innerText = "x";
    div2.appendChild(btnP); div2.appendChild(btnR);
    art.appendChild(div1); art.appendChild(div2);

    btnP.addEventListener("click", addIngrediente.bind(this));
    btnR.addEventListener("click", ()=>{ art.remove(); })
    ingredienti.appendChild(art);
}

function salvaRicetta() {
    let ricetta = {};
    ricetta.titolo = titolo.querySelector("input").value;
    ricetta.tipo = tipo.querySelector("input").value;

    if (ricetta.titolo != "" && ricetta.tipo != "") {
        ricetta.elenchi = [];

        let ingredientiArt = ingredienti.querySelectorAll("article");
        let elencoIngredienti = { titolo: "ingredienti", elementi: [] };
        let tmp;
        for (let art of ingredientiArt) {
            tmp = {};
            tmp.desc = art.querySelector("input[type=text]").value;
            tmp.qta = art.querySelector("input[type=number]").value;
            tmp.qta == "" ? tmp.qta = null : null;
            if (tmp.desc != "")
                elencoIngredienti.elementi.push(tmp);
        }
        ricetta.elenchi.push(elencoIngredienti);

        let preparazioneArt = preparazione.querySelectorAll("article");
        let elencoPreparazione = { titolo: "preparazione", elementi: [] };
        for (let art of preparazioneArt) {
            tmp = {};
            tmp.desc = art.querySelector("textarea").value;
            if (tmp.desc != "")
                elencoPreparazione.elementi.push(tmp);
        }
        ricetta.elenchi.push(elencoPreparazione);

        console.log(ricetta);

        fetch("/addRicetta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ricetta)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                aggiornaLista();
            })
            .catch(err => console.error(err));
    } else {
        alert("Titolo e tipo della ricetta sono obbligatori");
    }
}
