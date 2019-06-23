export default () => {
  const infoContent = document.querySelector('.info-content')
  const infoHider = document.querySelector('.hide-info-button')

  document.getElementById('info').style.display = 'inline'

  infoHider.addEventListener('click', () => {
    if (infoHider.innerHTML === 'Hide') {
      infoHider.innerHTML = 'Show'
      infoContent.style.display = 'none'
    } else {
      infoHider.innerHTML = 'Hide'
      infoContent.style.display = 'block'
    }
  })
}
