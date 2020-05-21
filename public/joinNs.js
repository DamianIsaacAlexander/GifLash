function joinNs(endpoint){

    if(nsSocket)
    {
        nsSocket.close();
    }
    nsSocket = io(`https://murmuring-island-19258.herokuapp.com${endpoint}`);

    nsSocket.on('initGame', (data) => {  
        $('#main-window').empty();
        $('#main-window').append(data.html);
        $('.announcer-text').text(data.text);
        searchState();
        votingState();
        outcomeState();
    });

    $(document).on('submit', '#user-input', function(event) {
        event.preventDefault();
        const newMessage = $('#user-message').val();
        nsSocket.emit('newMessageToServer', {text: newMessage});
    });
    

    nsSocket.on('messageToClients', (data) =>{
        let li = ` <li><div class="user-name">${data.message.username}: <span class="message-text">${data.message.text}</span></div></li>`
        $('#messages').append(li);
    });

    nsSocket.on('historyCatchUp', (data) =>{
        data.messages.forEach((msg)=> {
            console.log(msg.text)
            let li = ` <li><div class="user-name">${msg.username}: <span class="message-text">${msg.text}</span></div></li>`
            $('#messages').append(li);
        });
    });

    nsSocket.on('redirect', (data) => {
        nsSocket.close();
        $('#main-window').empty();
        $('#main-window').append(data.html);
        $('.welcome-lobby-text').text(data.text);
    });

    nsSocket.on('closeGame', (data) => {
        socket.emit('closeNs', {endpoint: data.endpoint});
        nsSocket.close();
        window.location.href = 'https://murmuring-island-19258.herokuapp.com/game';
    });

}