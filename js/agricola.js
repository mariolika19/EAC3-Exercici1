window.onload = function () {
  var tipus = ["Cria", "Engreix", "Femelles", "Mascles", "Reposició"];
  var quantitats;
  //Configurem i creem el tipus de gràfic
  const ctx = document.getElementById("grafica");
  const grafica = new Chart(ctx, {
    type: "bar",
    data: {
      labels: tipus,
      datasets: [
        {
          label: "Quantitat",
          data: quantitats,
          backgroundColor: [
            "rgba(255, 99, 132)",
            "rgba(54, 162, 235)",
            "rgba(255, 206, 86)",
            "rgba(75, 192, 192)",
            "rgba(153, 102, 255)",
          ],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 20,
              weight: "bold",
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 20,
              weight: "bold",
            },
          },
        },
      },
    },
  });

  /*Funció per dibuixar la gràfica*/
  function dibuixaGrafica(quantitats) {
    grafica.data.datasets[0].data = quantitats;
    grafica.update();
  }

  //------------EJERCICIO 1 --------------//
  //Petición AJAX que nos abre el listado de comarcas
  let peticioComarques = new XMLHttpRequest();
  let URL = "https://analisi.transparenciacatalunya.cat/resource/7bpt-5azk.xml";
  peticioComarques.open("GET", URL, true);
  peticioComarques.send(null);
  peticioComarques.onload = rellenaComarcaL;

  function rellenaComarcaL() {
    let fitxerXML = peticioComarques.responseXML;
    let desplegable = document.getElementById("comarca");
    procesarRespuesta(fitxerXML, desplegable, "comarca");
  }

  //Añadimos elementos donde queremos designar un evento concreto
  let listadoComarca = document.getElementById("comarca");
  let lupaBtn = document.getElementById("cercar");


  //------------EJERCICIO 2 --------------//
  //Función que salta cuando el listado de las comarcas cambia
  listadoComarca.addEventListener("change", buscaPoblacion);
  
  // Función que salta cuando elegimos una opción del primer desplegable
  function buscaPoblacion() {
    //Cogemos el valor de la comarca seleccionada
    let nomComarca = listadoComarca.value;

    //Nueva petición AJAX con el nombre de la comarca seleccionada
    let consultaPoblac = new XMLHttpRequest();
    let poblacionsURL = URL+"?comarca="+nomComarca;
    consultaPoblac.open("GET", poblacionsURL, true);
    consultaPoblac.send(null);
    consultaPoblac.onload = rellenaPoblacionL;


    function rellenaPoblacionL() {
      let xmlPoblacions = consultaPoblac.responseXML;
      let desplegable = document.getElementById("poblacio");
      procesarRespuesta(xmlPoblacions, desplegable, "municipi");
    }
  }


  //------------EJERCICIO 3 --------------//
  //Función que salta cuando le damos al botón de (lupa)
  lupaBtn.addEventListener("click", mostraDades);

  function mostraDades() {
    let desplegable = document.getElementById("poblacio");

    //El usuario debe haber seleccionado una población antes de darle a la lupa
    if (desplegable.length > 1) {
      //Cogemos el valor de la población seleccionada
      let nomPoblacio = desplegable.value;

      //Última petición AJAX con valor de comarca y municipio
      let consultaGranja = new XMLHttpRequest();
      let grangesURL = URL + "?municipi=" + nomPoblacio;

      consultaGranja.open("GET", grangesURL, true);
      consultaGranja.send(null);
      consultaGranja.onload = ompleDades;

      function ompleDades() {

        //Creamos las variables donde queremos pasar la información
        let nom = document.getElementById("nom");
        let adreca = document.getElementById("adresa");
        let especie = document.getElementById("especie");
        let fitxerDadesFinals = consultaGranja.responseXML;
        console.log(fitxerDadesFinals);

        //Buscamos los valores de los elementos con el nombre del archivo XML
        let nomGranja = fitxerDadesFinals.getElementsByTagName("nom_explotaci")[0].textContent;
        let adrecaGranja = fitxerDadesFinals.getElementsByTagName("adre_a_explotaci")[0].textContent;
        let especieGranja = fitxerDadesFinals.getElementsByTagName("esp_cie")[0].textContent;

        //Rellenamos los elementos con los valores
        nom.innerText = nomGranja;
        adreca.innerText = adrecaGranja;
        especie.innerText = especieGranja;

        
        //------------EJERCICIO 4 --------------//
        //Buscamos los valores para rellenar la gráfica
        let cria = fitxerDadesFinals.getElementsByTagName("cap_cria")[0].textContent;
        let engreix = fitxerDadesFinals.getElementsByTagName("cap_engreix")[0].textContent;
        let femelles = fitxerDadesFinals.getElementsByTagName("cap_femelles")[0].textContent;
        let mascles = fitxerDadesFinals.getElementsByTagName("cap_mascles")[0].textContent;
        let reposicio = fitxerDadesFinals.getElementsByTagName("cap_reposici")[0].textContent;

        valorsGrafica = [cria, engreix, femelles, mascles, reposicio];
        dibuixaGrafica(valorsGrafica);
      }
    }
  }

  /*Funció que omple una llista desplegable concreta (llista) 
  * a partir del contingut d'una etiqueta concreta (etiqueta)
  * d'un fitxer XML (fitxer)
  */
  function procesarRespuesta(fitxer, llista, etiqueta) {
    let elements = fitxer.getElementsByTagName(etiqueta);
    
    //Vaciamos la lista antes de abrirla (por si hay resultados de una búsqueda anterior)
    while (llista.length > 1) {
      llista.remove(llista.length - 1);
    }

    //Añadimos los valores de la etiqueta pasados por parámetro sin repetir
    let conjunt = [];
    for (let i=0; i < elements.length; i++) {
      let valor = elements[i].textContent;
      if (!conjunt.includes(valor)){
        conjunt.push(valor);
      } 
    }

    //Rellenamos la vista desplegable con los valores
    for (let i = 0; i < conjunt.length; i++) {
      let element = conjunt[i];
      let opcio = document.createElement("option");
      opcio.text = element;
      opcio.value = element;
      llista.appendChild(opcio);
    }
  }
};
