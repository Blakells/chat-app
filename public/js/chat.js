const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')



socket.on('message', (message) => {
    console.log(message)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')


    const msg = e.target.message.value

    socket.emit('sendMessage', msg, (error) => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('message delivered')
    })
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported on your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
        })

    })
})