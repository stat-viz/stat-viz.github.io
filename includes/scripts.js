<script>

var sessionID = (Math.random() + 1).toString(36);
console.log("sessionID: " + sessionID);

var dataURL =  "https://docs.google.com/spreadsheets/d/e/2PACX-1vROebIG122A68wIC0kyMzhH7GNP3ye6Xhyl0CyV-7q8-N_B7hUMgkaADGjJy2Y3LD-lqXNJS0FVk8lm/pub?gid=2089079954&single=true&output=csv";

dataURL = 'https://corsproxy.io/?' + encodeURIComponent(dataURL);

fetch(dataURL)
  .then(response => response.text())
  .then(csvText => {
    // Parse CSV text to array of objects
    const rows = csvText.split('\n').map(row => row.split(','));
    const headers = rows.shift().map(header => header.trim());
    const data = rows.map(row => {
      let obj = {};
      row.forEach((val, idx) => {
        obj[headers[idx]] = val.trim().replace(/[\r\n]+/g, ''); // Remove any extra characters
      });
      return obj;
    });
    
    console.log('data:', data); // Debugging log to check matching entry


    document.querySelectorAll('.star-rating').forEach(function(star) {
      var resourceID = star.getAttribute('data-id');
      var entry = data.find(row => row['Resource'] === resourceID);

      if (entry) {
        console.log('Matching Entry for resourceID', resourceID, ':', entry); // Debugging log 
        var rating = parseFloat(entry['Rating']).toFixed(1);
        var count = entry['Count'];
        star.innerHTML = `${rating} (${count})`;
      } else {
        star.innerHTML = "N/A";
      }
    });
  })
  .catch(error => console.error('Error fetching the CSV data:', error));

document.querySelectorAll('.star').forEach(function(star) {
  star.addEventListener('click', function() {
    var widget = this.parentElement;
    
    // return if already set
    if (widget.classList.contains('star-set')) return null;
    
    var resourceID = widget.getAttribute('data-id');
    var value = this.getAttribute('data-value');
    var url = "https://docs.google.com/forms/d/e/1FAIpQLSff8ZWiZDSgojHxcFeb_L-TbO5klCxAyIBZkgcEzq8tAfTODw/formResponse?usp=pp_url" +
    "&entry.496682832=" + resourceID +
    "&entry.1274867230=" + sessionID + 
    "&entry.1648203726=" + value +
    "&submit=Submit";
    
    //console.log(url);
    
    fetch(url, {mode: "no-cors"})
      .then(function(response) {
        console.log("success")
        widget.classList.add('star-set');
        widget.classList.add('star-set-' + value);
      })
      .catch(function(error) {
        console.log("error: " + error )
      });

  });
});

</script>