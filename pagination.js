function addPagesIntoHTML(totalPages) {
  const footer = document.createElement('footer')

  const startPagesContent = `<button class="btn-prev hidden"><i class="fas fa-angle-left"></i></button>
        <button class="btn active">1</button>
        <button class="not-active">...</button>`
  footer.innerHTML = startPagesContent
  const endPagesContent = `<button class="not-active">...</button>
        <button class="btn">${totalPages}</button>
        <button class="btn-next"><i class="fas fa-angle-right"></i></button>`
  for (let i = 2; i < totalPages; i++) {
    footer.innerHTML += `<button class="btn">${i}</button>`
  }
  footer.innerHTML += endPagesContent
  document.body.appendChild(footer)
}

function createPagination(totalPages) {
  const btn = document.querySelectorAll('.btn')
  const firstBtn = document.querySelector('.btn')
  const dots = document.querySelectorAll('.not-active')
  const secondBtn = btn[1]
  const thirdBtn = btn[2]
  const lastBtn = btn[totalPages - 1]
  const secondToLastBtn = btn[totalPages - 2]
  const thirdToLastBtn = btn[totalPages - 3]
  const activeButton = document.querySelector('.btn.active')
  const prevToActive = btn[activeButton.innerText - 2]
  const nextToActive = btn[activeButton.innerText]

  btn.forEach(button => {
    button.classList.add('hidden')
  })
  firstBtn.classList.remove('hidden')
  lastBtn.classList.remove('hidden')

  activeButton.classList.remove('hidden')
  if (prevToActive) {
    prevToActive.classList.remove('hidden')
  }

  if (nextToActive) {
    nextToActive.classList.remove('hidden')
  }
  if (
    firstBtn.classList.contains('active') ||
    secondBtn.classList.contains('active') ||
    thirdBtn.classList.contains('active')
  ) {
    firstBtn.classList.remove('hidden')
    secondBtn.classList.remove('hidden')
    thirdBtn.classList.remove('hidden')
    dots[0].classList.add('hidden')
    dots[1].classList.remove('hidden')
  } else if (
    lastBtn.classList.contains('active') ||
    secondToLastBtn.classList.contains('active') ||
    thirdToLastBtn.classList.contains('active')
  ) {
    lastBtn.classList.remove('hidden')
    secondToLastBtn.classList.remove('hidden')
    thirdToLastBtn.classList.remove('hidden')
    dots[1].classList.add('hidden')
    dots[0].classList.remove('hidden')
  } else {
    dots[0].classList.remove('hidden')
    dots[1].classList.remove('hidden')
  }
}

export { createPagination, addPagesIntoHTML }
