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
    ?placeInJapan skos:prefLabel ?placeInJapanLabel .      ?cho     edm:isRelatedTo <https://hdl.handle.net/20.500.11840/termmaster2815> ; # selecteer handwapens
    dc:type ?type ;
    dct:created ?yearSpan ;
    edm:isShownBy ?imageLink ;
    dct:spatial ?placeInJapan ;
    dc:title ?title .      FILTER langMatches(lang(?title), "ned")
} ORDER BY ?cho
`;

runQuery(endpoint, queryWeaponsJapan)
    .then(data => {
        const properData = data;

        console.log(properData);
    });

    function runQuery(url, query) {
        return fetch(url + "?query=" + encodeURIComponent(query) + "&format=json")
            .then(res => res.json())
            .then(data => data.results.bindings)
            .catch(error => {
                console.log(error);
            })
    }



