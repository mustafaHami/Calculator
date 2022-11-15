var edition = false;

// appuis sur le bouton CE
function rab(){ 
    var aff = document.getElementById("zone_affichage");
    aff.value = "";

}
document.getElementById("CE").setAttribute("onclick", "rab()");


// appuis sur le bouton =
document.getElementById("egale").setAttribute("onclick", "calcul()");

function calcul(){ 
    var aff = document.getElementById("zone_affichage");
    var valeur = aff.value;
    try {
        //aff.value = ajax_get_request(null,"calcul-serveur.php?data=valeur",false)
        var data = "calcul-serveur.php?data=";
        var chaine = valeur;
        chaine = chaine.replace(/Math./g, "");
        chaine = chaine.replace(/PI/g, "pi()");
        chaine = encodeURIComponent(chaine);
        data += chaine;
        ajax_get_request(maj_zone_affichage,data,true);
        //aff.value = eval(valeur);
      } catch (e) {
        alert("La saisie est fausse !!!!");
      }
}


//document.onclick = function affiche(elm){
    //const objetClique = elm.target;
    //console.log(objetClique.value);
    // tu en fais ce que tu veux }

function affiche(elm){
    var attribue = elm.getAttribute("value");
    var aff = document.getElementById("zone_affichage");
    aff.value += attribue;
}

function init(){
    var btnSimple = document.getElementsByClassName("bouton_simple");
    var boutons2 = document.getElementsByClassName("bouton_libre"); 

    for (i = 0; i < btnSimple.length; i++){
        btnSimple[i].setAttribute('onclick', 'affiche(this)');
    } 
    for (var bouton2 of boutons2) {
        bouton2.setAttribute("onclick","affiche(this)");
        bouton2.value = getCookie(bouton2.getAttribute("id")); 
    }

    ajax_post_request(maj_etat,"recup-etat.php",true,null)
}

function plusmoins(){
    var aff = document.getElementById("zone_affichage");
    var valeur = aff.value;
    var moin = "-";

    if(valeur[0] == '-'){
        aff.value = valeur.slice(1,valeur.length);
    }else{
        moin += valeur;
        aff.value = moin ; 
    }
}
var memory = 10;
function range_memory(){

    affichage = document.getElementById("zone_affichage");

    var maRegEx = /^\d+\.?\d*$/;

    if(maRegEx.test(affichage.value)){
        memory = affichage.value;
    }else{
        alert("saisie fausse !!!")
    }
    save();
}
function affiche_memory() {
    var aff = document.getElementById("zone_affichage");
    if(typeof memory !== "undefined" ){
        aff.value += memory;
    }
}
function raz_memory(){
    memory = undefined;
}
function mode_edition(){

    edition = true;
    var elm = document.getElementById("E");
    elm.style.color = "#FF0000";
    elm.setAttribute('onclick', 'mode_calcul()')
    var btnLibre = document.getElementsByClassName("bouton_libre");

    for (i = 0; i < btnLibre.length; i++){
        btnLibre[i].removeAttribute("onclick");
        btnLibre[i].setAttribute('ondblclick', 'edit(this)');
    } 
    console.log(edition);
}
function mode_calcul(){
    edition = false;
    var elm = document.getElementById("E");
    elm.style.color = "#000000"; 
    elm.setAttribute('onclick', 'mode_edition()')
    var btnLibre = document.getElementsByClassName("bouton_libre");

    for (i = 0; i < btnLibre.length; i++){
        btnLibre[i].removeAttribute("ondblclick");
        btnLibre[i].setAttribute('onclick', 'affiche(this)');
        btnLibre[i].removeAttribute("onblur");   
        btnLibre[i].setAttribute('type','button');
    } 
    console.log(edition);
}
function save(){
    //Définissez ensuite la fonction save() qui ajoute un 
    //Cookie dont le nom correspond à l'ID de l'élément édité (libre1, libre2, ..., libre6) 
    //et dont la valeur correspond au contenu de l'élément.
    //setCookie(elt.getAttribute("id"),elt.getAttribute("value")); 
    var retour = toJson();
    ajax_post_request(null,"sauvegarde-serveur.php",true,retour)
}
function edit(elt){
    if(edition == true){
    elt.setAttribute('type','text');
    elt.setAttribute('ondblclick','fix(this)');
    elt.setAttribute('onblur','fix(this)');
    }
    
}
function fix(elt) {
    elt.setAttribute('type','button');
    elt.setAttribute('ondblclick','edit(this)');
    elt.removeAttribute("onblur");
    save(elt);  

}

function ajax_get_request(callback, url, async = true) {
	// Instanciation d'un objet XHR
	var xhr = new XMLHttpRequest(); 

	// Définition de la fonction à exécuter à chaque changement d'état
	xhr.onreadystatechange = function(){
		if (callback && xhr.readyState == XMLHttpRequest.DONE 
				&& (xhr.status == 200 || xhr.status == 0))
		{
			// Si une fonction callback est définie + que le serveur a fini son travail
			// + que le code d'état indique que tout s'est bien passé
			// => On appelle la fonction callback en passant en paramètre
			//		les données récupérées sous forme de texte brut
			callback(xhr.responseText);
		}
	};

	// Initialisation de l'objet puis envoi de la requête
	xhr.open("GET", url, async); 
	xhr.send();
}

function maj_zone_affichage(res){
    document.querySelector("#zone_affichage").value = res;
}
function maj_etat(res){

    var obj = JSON.parse(res);
    var aff = document.querySelector("#zone_affichage");
    aff.value =obj.memoire;
    
    for(var bouton of obj.fonctions){
        var btn = document.getElementById(bouton.id);
        btn.setAttribute("value",bouton.val);
    }

}

function toJson() {
    /*var obj = {};
    var obj2 = {};
    var fonctions = [];
    var btnLibre = document.getElementsByClassName("bouton_libre");
    for(var i =0; i<btnLibre.length; i++ ){
        obj2.id = btnLibre[i].id;
        obj2.value = btnLibre[i].value;
        fonctions[i] = obj2;
        console.log(obj2);
        obj.fonctions = fonctions[i];
    }
    //obj.fonctions = fonctions;
    obj.memoire = memory;
    
    console.log(JSON.stringify(obj));*/
    var chaine = "{\"fonctions\":[";
    var btnLibre = document.getElementsByClassName("bouton_libre");
    for(var boutone of btnLibre){
        var id = boutone.getAttribute("id");
        var value = boutone.getAttribute("value");
        chaine += "{\"id\":\""+ id +"\", \"val\":\""+ value + "\"}";
        
        if(id!= "libre6"){
            chaine+= ","
        }
    }
    chaine += "],";
    var aff = document.getElementById("zone_affichage");
    if(aff.value != ""){
        chaine += "\"memoire\":" +  aff.value;
    }else{
        chaine += "\"memoire\": \"\"";
    }
    chaine +="}";
    console.log(chaine);
    return chaine;
}
/*var obj = {};
var obj2 = {};
var fonctions = [];
var btnLibre = document.getElementsByClassName("bouton_libre");
var i =0;
for(var boutone of btnLibre){
    
    obj2.id = boutone.id;
    obj2.value = boutone.value;

    fonctions[i] = obj2;
    console.log(obj2);
    obj.fonctions = fonctions;
    console.log(obj);
}
//obj.fonctions = fonctions;
obj.memoire = memory;

console.log(JSON.stringify(obj));*/






function ajax_post_request(callback, url, async = true, data = null) {
	// Instanciation d'un objet XHR
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (callback && xhr.readyState == XMLHttpRequest.DONE
			&& (xhr.status == 200 || xhr.status == 0))
		{
			// => On appelle la fonction callback
			callback(xhr.responseText);
		}
	};

	// Initialisation de l'objet
	// (avec la définition du format des données envoyées)
	xhr.open("POST", url, async); 
	xhr.setRequestHeader("Content-Type",
		"application/x-www-form-urlencoded");

	// Envoi de la requête (avec ou sans paramètre)
	if(data === null){
		xhr.send(null);
	} else {
		xhr.send("data=" + data);
	}
}
