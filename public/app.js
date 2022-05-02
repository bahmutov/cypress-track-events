document
  .querySelector('form input[type=submit]')
  .addEventListener('click', (e) => {
    e.preventDefault()
    // grab the form element and form the data to be sent
    const form = document.querySelector('form')
    const formData = new FormData(form)
    const data = {}
    formData.forEach((value, key) => {
      data[key] = value
    })
    if (data.phone) {
      // clean up the phone number by removing all non-digit characters
      data.phone = data.phone.replace(/[^\d]/g, '')
    }

    // if we are running the application inside a Cypress browser test
    // send the internal data to be confirmed or used by the test
    // We are using optional chaining operator "?." to safely
    // access each property if it exists (or do nothing if it doesn't)
    // including the last call to the "track()" method if it exists
    // See https://github.com/tc39/proposal-optional-chaining
    window?.Cypress?.track?.('form', data)

    // send the Ajax request to the server
    const request = new XMLHttpRequest()
    request.open('POST', '/api/v1/message')
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(JSON.stringify(data))
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status === 200) {
          // all good
        } else {
          alert('Error: ' + request.status)
        }
      }
    }
  })
