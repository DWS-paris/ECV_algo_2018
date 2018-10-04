/*
Function to get the summary
*/
       const fetchSummary = () => {
        // Get nav tag
        const nav = document.querySelector('nav');

        // Fetch JSON data
        fetch('./summary.json')
        .then( rawData => rawData.json() )
        .then( formatedData => {
            nav.innerHTML += formatedData.map(data => `<button data-link="${data.link}">${data.name}</button>`).join('\n');
            fetchPage(formatedData[0].link);
            setUserInteraction();
        })
        .catch( errorData => console.error(errorData) );
    };
//

/*
Function to start UI
*/
    const setUserInteraction = () => {
        // Get button tags
        const navButtons = document.querySelectorAll('nav button');

        // Add event listener
        for( let i = 0; i < navButtons.length; i++ ){
            navButtons[i].addEventListener('click', () => fetchPage(navButtons[i].getAttribute('data-link')));
        };
    };
//

/*
Function to fecth page data
*/
    const fetchPage = link => {
        fetch(link).then( rawData => rawData.text() )
        .then( formatedData => document.querySelector('main').innerHTML = formatedData )
        .catch( errorData => console.error(errorData) );
    };
//

/*
Wait before start interface
*/
    window.addEventListener('load', () => fetchSummary());
//