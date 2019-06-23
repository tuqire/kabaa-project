export default () => {
  const infoContent = document.querySelector('.info-content')
  const infoHider = document.querySelector('.hide-info-button')

  document.getElementById('info').style.display = 'inline'

  infoHider.addEventListener('click', () => {
    if (infoHider.innerHTML === 'Close') {
      infoHider.innerHTML = 'Open Info'
      infoContent.style.display = 'none'
    } else {
      infoHider.innerHTML = 'Close'
      infoContent.style.display = 'block'
    }
  })
}
