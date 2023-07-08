import { GithubUser } from "./githubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector (root)
    this.load()
    this.checkEmpty()
  }

  load() {
    this.entries =  JSON.parse(localStorage.getItem
    ('@github-favorites:')) || [] 
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const repeatedUser = this.entries.find(user => user.login === username)
      
      if (repeatedUser) {
        throw new Error('User already registrated')
      }

      const user = await GithubUser.search(username)
      if(user.login === undefined) {
        throw new Error('Usuario não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
      this.checkEmpty()
    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
    .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
    this.checkEmpty()
  }

  checkEmpty() {
    const emptyDisplay = document.querySelector('.empty') 
    if (this.entries.length > 0) {
      emptyDisplay.classList.add('hide')
      return
    }

    emptyDisplay.classList.remove('hide')
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')
      this.add(value)
    }

    window.onkeydown = (event) => {
      const { value } = this.root.querySelector('.search input')
      const keyPressed = event.code
      if (keyPressed === 'Enter') {
        this.add(value)
      }
    }
  }

  update() {
   this.removeAllTr()

    this.entries.forEach( user => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.user a').hef = `https://github.com/${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    }) 
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
      <img src="https://github.com/KioryFNC.png" alt="Imagem de perfil">
      <a href="https://github.com/KioryFNC" target="_blank">
        <p>Yuri Barros Luz</p>
        <span>KioryFNC</span>
      </a>
    </td>
    <td class="repositories">
      16
    </td>
    <td class="followers">
      1
    </td>
    <td>
      <button class="remove">&times;</button>
    </td>
   `

   return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
}