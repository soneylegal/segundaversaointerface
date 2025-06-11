// public/js/dialogos.js

async function carregarDialogos() {
    try {
      const resposta = await fetch('/api/dialogos')
      const dialogos = await resposta.json()
  
      const container = document.getElementById('dialogos')
      container.innerHTML = ''
  
      dialogos.forEach(d => {
        const linha = document.createElement('p')
        linha.textContent = `${d.nome}: ${d.fala}`
        container.appendChild(linha)
      })
    } catch (erro) {
      console.error('Erro ao carregar os diálogos:', erro)
    }
  }
  
  window.onload = carregarDialogos
  