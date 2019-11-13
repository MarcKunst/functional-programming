const endpoint = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-18/sparql";
const queryWeaponsJapan = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX ns: <http://example.com/namespace># handwapens uit Japan
SELECT ?cho (SAMPLE(?imageLink) AS ?imageLinkSample) ?title ?type ?yearSpan ?placeInJapanLabel WHERE {      <https://hdl.handle.net/20.500.11840/termmaster6917> skos:narrower* ?placeInJapan .
  
  VALUES ?type { "zwaard" "Zwaard" "boog" "Boog" "lans" "Lans" "mes" "knots" "Piek" "vechtketting" "dolk" "bijl" "strijdzeis"}.
  
     ?placeInJapan skos:prefLabel ?placeInJapanLabel .      ?cho edm:isRelatedTo <https://hdl.handle.net/20.500.11840/termmaster2815>; # selecteer handwapens
                                                                                                                     
     dc:type ?type ;
     dct:created ?yearSpan ;
     edm:isShownBy ?imageLink ;
     dct:spatial ?placeInJapan ;
     dc:title ?title .
  	 #?type skos:broader ?newType.
  	 #?newType skos:prefLabel ?typeLabel.
  FILTER langMatches(lang(?title), "ned")
} ORDER BY ?cho
`;

runQuery(endpoint, queryWeaponsJapan)
    .then(data => handleData(data)
    );

    function handleData(data) {
        const cleanedData = loopData(data);
        const nestedData = nestObjects(cleanedData);
        // schrijf nieuwe const voor aangepaste data

        nestObjects(cleanedData)
        d3Circles(nestedData)
        // geef hier de data weer door aan de volgende functie
    }  

    function loopData(data) {
        return data.map(dataItem => theNestProperties(dataItem));
    }

    function theNestProperties(data) {
        return Object.assign({}, data, {
            cho: data.cho.value,
            imageLinkSample: data.imageLinkSample.value,
            placeInJapanLabel: data.placeInJapanLabel.value,
            title: data.title.value,
            type: data.type.value.toLowerCase(),
            yearSpan: data.yearSpan.value
        });
    }

    function nestObjects(cleanedData) {
        const expensesByType = d3.nest()
        .key(function(d) { return d.type; })
        .rollup(function(v) { return v.length; })
        .entries(cleanedData)
        return expensesByType;
    }


function runQuery(url, query) {
    return fetch(url + "?query=" + encodeURIComponent(query) + "&format=json")
        .then(res => res.json())
        .then(data => data.results.bindings)
        .catch(error => {
            console.log(error);
        });
}

//d3

function d3Circles(nestedData){
    const dataset = {
        children: nestedData
    };
    console.log(dataset)
    let diameter = 600;
        let color = d3.scaleOrdinal(d3.schemeCategory20);

        let bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

        let svg = d3.select("body")
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");

        let nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.value; });

        let node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        node.append("title")
            .text(function(d) {
                return d.key + ": " + d.value;
            });

        node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d,i) {
                return color(i);
            });

        node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.key.substring(0, d.r / 3);
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

        node.append("text")
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.value;
            })
            .attr("font-family",  "Gill Sans", "Gill Sans MT")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

        d3.select(self.frameElement)
            .style("height", diameter + "px");
}        

