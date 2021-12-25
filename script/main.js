let MINDSETS;
fetch("./data.json")
    .then(response => {
        return response.json();
    })
    .then(jsondata => MINDSETS = jsondata);

async function main() {
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