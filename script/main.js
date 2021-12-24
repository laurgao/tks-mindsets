// const MINDSETS = [{name: "Seek understanding", description: ""}, "Bias towards action", "Compounding"]
// const MINDSETS = require('./data.json');
let MINDSETS;
fetch("./data.json")
    .then(response => {
        return response.json();
    })
    .then(jsondata => MINDSETS = jsondata);
console.log(MINDSETS)
async function main() {
    console.log("js works!")
    await document.fonts.ready;
    const nameTextBox = document.getElementById("title")
    const descriptionTextBox = document.getElementById("description")
    const mindset = MINDSETS[Math.floor(Math.random() * MINDSETS.length)]
    nameTextBox.innerHTML = mindset.name;
    descriptionTextBox.innerHTML = mindset.description;
}

window.addEventListener('load', () => {
    main();
});