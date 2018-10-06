/*
Global
*/
    let passwordAccess = undefined;
    let tokenAccess = undefined;
    let pageData = undefined;
//

/*
Function to get the credentials
*/
    const fetchCredentials = () => {
        // Fetch JSON data
        fetch('./content.json')
        .then( rawData => rawData.json() )
        .then( async formatedData => {
            // Set credential
            passwordAccess = formatedData.credentials.password;
            tokenAccess = formatedData.credentials.token;
            
            // Set page content
            pageData = {
                document: formatedData.document,
                content: formatedData.content,
                summary: formatedData.summary
            }

            // Check user connexion
            checkUser();
        })
        .catch( errorData => {
            alert('Error while fetching content data, check yout console')
            console.error(errorData)
        });
    };
//

/*
Function to checkUser
*/
    const checkUser = async () => {
        const userAccessToken = await localStorage.getItem('user_mooc_access');
        userAccessToken ? checkUserToken(userAccessToken) : logUser();
    };
/**/

/*
Function to check user token
*/
    const checkUserToken = async token => {
        if(token === tokenAccess){
            await setDocumentContent(pageData)
            fetchPage(pageData.summary[0].link);
            setUserInteraction();

        } else logUser()
    };
/**/


/*
Function to protect access
*/
    const logUser = async () => {
        const userResponse = prompt('What is the magic word?');
        if(userResponse === passwordAccess){
            await localStorage.setItem('user_mooc_access', tokenAccess);
            await setDocumentContent(pageData)
            fetchPage(pageData.summary[0].link);
            setUserInteraction();

        } else {
            alert('Access not allowed');
            window.location = "presentation_sld.html";
        };
    }
/**/

/*
Function to add htHTML content
*/
    const setDocumentContent = data => {
        // Get HTML tag
        let lang = document.querySelector('html');
        let keywords = document.querySelector('[name="keywords"]');
        let description = document.querySelector('[name="description"]');
        let author = document.querySelector('[name="author"]');
        let nav = document.querySelector('nav');
        let title = document.querySelector('header p');
        let footer = document.querySelector('footer p');

        // Set document head
        lang.setAttribute('lang', data.document.lang);
        document.title = data.document.title;
        keywords.setAttribute('content', data.document.keywords);
        description.setAttribute('content', data.document.description);
        author.setAttribute('content', data.content.author);

        // Add title
        title.innerHTML = `${data.content.title}<em>${data.content.author}</em>`;

        // Add footer
        footer.innerHTML = `<b>${data.content.author}</b> &copy; ${data.content.date}`;

        // Add nav button
        nav.innerHTML += data.summary.map(data => `<button data-link="${data.link}">${data.name}</button>`).join('\n');
    }
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
    window.addEventListener('load', () => fetchCredentials());
//