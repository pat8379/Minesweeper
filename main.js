const stop1 = document.querySelector('.stop-button')
let input = document.getElementById('am-mines')
const box = document.querySelectorAll('.box')
let start = document.querySelector('.startt')
let cont1 = document.querySelector('.container')
let cont2 = document.querySelector('.sec-container')
let flagText = document.querySelector('.flag-text')
let flagCont = document.querySelector('.flag-container')
let helpCont = document.querySelector('.help-container')
let quesMark = document.querySelector('.help-sign')
// let faFlag = document.querySelector('.fa-flag')
let body = document.body
let gameStartsignal = false
let x = 12
let y = 12
let pressedBox
let numberOfBombWithInRange = true
let tops = [1,2,3,4,5,6,7,8]
let right = [19,29,39,49,59,69,79,89]
let left = [10,20,30,40,50,60,70,80]
let bottom = [91,92,93,94,95,96,97,98]
let corners = [0,9,90,99] // ----------- top,left,right,bottom doesnt include the corners
let topCorn = [0,9]
let botCorn = [90,99]
let lefCorn = [0,90]
let rigCorn = [9,99]
let bombs = []
let pressedHistory = []
let secPressedHistory = []
let AllBoxes = [...Array(100).keys()]
// let totalBombsAround = 0
let temporaryCont = []
let currentIndex
let iterationSignal = true
let fullBottom = bottom.concat(botCorn)
let fullTop = tops.concat(topCorn)
let fullRight = right.concat(rigCorn)
let fullLeft = left.concat(lefCorn)
let edge = tops.concat(right,left,bottom,corners)
let difference = AllBoxes.filter(x => !edge.includes(x));
let winTest = []
let flagSign = false
let helpSign = false

// console.log(cont2.childElementCount)
// console.log(gameStartsignal)
// console.log(AllBoxes)
// console.log(difference)
// console.log(fullLeft)
/* console.log(cont2.children.item(-1))
 ----- outputs 'null*/

window.onscroll = () => {
    let value = window.scrollY;
    let spin = ((value*0.4) + 45) % 360
    body.style.background = `linear-gradient(${spin}deg, rgba(242,193,174,1) 20%, rgba(237,136,97,1) 58%)`
}

input.addEventListener('keyup', function(e){
    x = document.getElementById('am-mines').value
    // inputKeyUp += 1
    if (parseInt(x) >= 1 && parseInt(x) < 100){
        // console.log(x)
        if (parseInt(x) >= 90){
            document.querySelector('.ebol').innerHTML = `gila sih ${x} mines klo bs menang`
            document.querySelector('.ebol2').innerHTML = 'Press Otillingam to start'
            numberOfBombWithInRange = true
        } else if (parseInt(x) >= 50){
            document.querySelector('.ebol').innerHTML = `${x} mines gk mungkn menang aying`
            document.querySelector('.ebol2').innerHTML = 'Press Otillingam to start'
            numberOfBombWithInRange = true
        } else if(parseInt(x) >= 20){
            document.querySelector('.ebol').innerHTML = `${x} mines lmao goodluck`
            document.querySelector('.ebol2').innerHTML = 'Press Otillingam to start'
            numberOfBombWithInRange = true
        } else if(parseInt(x) >= 5 && parseInt(x) < 10){
            document.querySelector('.ebol').innerHTML = `${parseInt(x)} mines too ez but aight`
            document.querySelector('.ebol2').innerHTML = 'Press Otillingam to start'
            numberOfBombWithInRange = true
        } else if(parseInt(x) < 5){
            document.querySelector('.ebol').innerHTML = `Minimum 5 mines`
            document.querySelector('.ebol2').innerHTML = '<br>'
            numberOfBombWithInRange = false
        } else {
            document.querySelector('.ebol').innerHTML = `${x} mines`
            document.querySelector('.ebol2').innerHTML = 'Press Otillingam to start'
            numberOfBombWithInRange = true
        }
    } else {
        document.querySelector('.ebol').innerHTML = 'Invalid number bruh'
        document.querySelector('.ebol2').innerHTML = '<br>'
        numberOfBombWithInRange = false
    }

    if (e.key === 'Enter'){
        input.blur()
    }
})

flagCont.addEventListener('click',()=> {
    if (!flagSign) {
        flagCont.classList.add('flag-container-active')
        flagSign = !flagSign
    } else {
        flagCont.classList.remove('flag-container-active')
        flagSign = !flagSign
    }
})

helpCont.addEventListener('click', ()=> {
    if (!helpSign){
        helpCont.classList.add('help-container-active')
        document.querySelector('.pop-up1').classList.add('pop-up-help')
        quesMark.style.fontSize = '2rem'
        quesMark.innerHTML = '&times'
        helpSign = !helpSign
    } else {
        helpCont.classList.remove('help-container-active')
        document.querySelector('.pop-up1').classList.remove('pop-up-help')
        quesMark.style.fontSize = '1rem'
        quesMark.innerHTML = '?'
        helpSign = !helpSign
    }
})

const generateRandomBombs = (numBombs) => { 
    // let iter1 = 0
    varSendtoArr = 0
    while (bombs.length < numBombs){
        varSendtoArr = Math.floor(Math.random()*100)
        if (!bombs.includes(varSendtoArr)){
            bombs.push(varSendtoArr)
        }
    }
}

box.forEach(cels => {
    cels.addEventListener('click', function indexerFunction(){
        pressedBox = Array.prototype.indexOf.call(cont2.children,cels)
        // console.log(pressedBox)
        // console.log(pressedHistory)
    })
})

const checkingAlgorithm = () => { 
    // console.log(pressedBox)
    if (!pressedHistory.includes(currentIndex)){
        pressedHistory.push(currentIndex)
        cont2.children.item(currentIndex).classList.add('black')
        if (cont2.children.item(currentIndex).children.item(2).classList.contains('fa-flag')){
            cont2.children.item(currentIndex).children.item(2).classList.remove('fa-flag')
            y++
            flagText.innerHTML = y
        }
        // console.log(pressedBox)
        // console.log(pressedHistory)
        // console.log('im activated')
        // iterationSignal = true
        let totalBombsAround = 0
        // check adjacent left and right boxes for tops,bottom, and rest
        if (!right.includes(currentIndex) && !left.includes(currentIndex) && !corners.includes(currentIndex)){
            if(bombs.includes(currentIndex + 1)){
                totalBombsAround++
            }
            if (bombs.includes(currentIndex - 1)){
                totalBombsAround++
            }
        }

        // check adjacent top and bottom boxes for right,left, and rest
        if (!tops.includes(currentIndex) && !bottom.includes(currentIndex) && !corners.includes(currentIndex)){
            if(bombs.includes(currentIndex + 10)){
                totalBombsAround++
            }
            if (bombs.includes(currentIndex - 10)){
                totalBombsAround++
            }
        }

        // check bottom boxes for top and topCorn
        if (tops.includes(currentIndex) || topCorn.includes(currentIndex)){
            if(bombs.includes(currentIndex + 10)){
                totalBombsAround++
            }
        }

        // check above boxes for bottom and botCorn
        if (bottom.includes(currentIndex) || botCorn.includes(currentIndex)){
            if (bombs.includes(currentIndex - 10)){
                totalBombsAround++
            }
        }

        // check the adjecent left boxes for right corners and boxes
        if (rigCorn.includes(currentIndex) || right.includes(currentIndex)){
            if (bombs.includes(currentIndex - 1)){
                totalBombsAround++
            }
        }

        // check the adjacent right boxes for left corners and boxes
        if (lefCorn.includes(currentIndex) || left.includes(currentIndex)){
            if (bombs.includes(currentIndex + 1)){
                totalBombsAround++
            }
        }

        // check if bottom right and bottom left boxes for top and rest (no corners)
        if (tops.includes(currentIndex) || (!corners.includes(currentIndex) && !right.includes(currentIndex) && !left.includes(currentIndex) && !bottom.includes(currentIndex))){
            if (bombs.includes(currentIndex + 11)){
                totalBombsAround++
            }
            if (bombs.includes(currentIndex + 9)){
                totalBombsAround++
            }
        }

        // check if top right and top left boxes for bottom and rest (no corners)
        if (bottom.includes(currentIndex) || (!corners.includes(currentIndex) && !right.includes(currentIndex) && !left.includes(currentIndex) && !tops.includes(currentIndex))){
            if (bombs.includes(currentIndex - 11)){
                totalBombsAround++
            }
            if (bombs.includes(currentIndex - 9)){
                totalBombsAround++
            }
        }

        // check if top right and bottom right for left (no corners)
        if (left.includes(currentIndex)){
            if (bombs.includes(currentIndex - 9)){
                totalBombsAround++
            }
            if (bombs.includes(currentIndex + 11)){
                totalBombsAround++
            }
        }

        // check if top left and bottom left for right (no corners)
        if (right.includes(currentIndex)){
            if (bombs.includes(currentIndex + 9)){
                totalBombsAround++
            }
            if (bombs.includes(currentIndex - 11)){
                totalBombsAround++
            }
        }

        // diagonals for corners
        if (corners.includes(currentIndex)){
            if (currentIndex === 0){
                if (bombs.includes(currentIndex + 11)){
                    totalBombsAround++
                }
            } else if (currentIndex === 9){
                if (bombs.includes(currentIndex + 9)){
                    totalBombsAround++
                }
            } else if (currentIndex === 90){
                if (bombs.includes(currentIndex - 9)){
                    totalBombsAround++
                }
            } else if (currentIndex === 99){
                if (bombs.includes(currentIndex - 11)){
                    totalBombsAround++
                }
            }
        }

        // Find Total
        if (totalBombsAround !== 0){
            cont2.children.item(currentIndex).children.item(1).innerHTML = totalBombsAround
            // iterationSignal = false
        }
        winTest = AllBoxes.filter(n => !bombs.includes(n))
        if(winTest.every(n => pressedHistory.includes(n))){
            // console.log('DONE')
            restartGame()
            // faFlag.style.color = 'white'
            bombs.forEach(n => {
                cont2.children.item(n).classList.add('win-boi')
            })
            // greenAlert()
        }
        // console.log(winTest)
        return totalBombsAround
    }   
}

const iter8 = (nop) => { 
    // console.log('hi')
    if (difference.includes(nop)){
        currentIndex = nop
        // secPressedHistory = []
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex -= 2
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex += 10
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex -= 20
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex--
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex--
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
    } else if (bottom.includes(nop)){
        currentIndex = nop
        // secPressedHistory = []
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex -= 2
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex -= 10
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
    } else if (tops.includes(nop)){
        currentIndex = nop
        // secPressedHistory = []
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex -= 2
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex += 10
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
    } else if (right.includes(nop)){
        currentIndex = nop
        currentIndex--
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex += 10
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex -= 20
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex--
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
    } else if (left.includes(nop)){
        currentIndex = nop
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex += 10
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex--
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex -= 20
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
    } else if (nop === 0){
        currentIndex = nop
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex += 10
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex--
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
    } else if (nop === 9){
        currentIndex = nop
        currentIndex--
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex += 10
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
    } else if(nop === 90){
        currentIndex = nop
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex -= 10
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex--
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
    } else if (nop === 99){
        currentIndex = nop
        currentIndex--
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex -= 10
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
        currentIndex++
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            secPressedHistory.push(currentIndex)
        }
    }
    // console.log(secPressedHistory)
}

const gusFring = () => { 
    if (!flagSign) {
        // console.log(bombs)
        if (cont2.children.item(pressedBox).children.item(2).classList.contains('fa-flag')){
            cont2.children.item(pressedBox).children.item(2).classList.remove('fa-flag')
            y++
            flagText.innerHTML = y
        }
        gameStartsignal = true
        // bombs.forEach(n => {
        //     cont2.children.item(n).children.item(1).innerHTML = 'B'
        // })
        if (bombs.includes(pressedBox)){
            // console.log('boom')
            restartGame()
            bombs.forEach(n => {
                cont2.children.item(n).classList.add('red-boi')
                cont2.children.item(n).children.item(0).classList.add('fa-bomb')
                if (cont2.children.item(n).children.item(2).classList.contains('fa-flag')){
                    cont2.children.item(n).children.item(2).classList.remove('fa-flag')
                    y++
                    flagText.innerHTML = y
                }
            })
            return
        }
        // console.log(checkingAlgorithm()
        currentIndex = pressedBox
        theAnswer = checkingAlgorithm()
        if (theAnswer === 0){
            iterationSignal = true
            // Second Version
            secPressedHistory.push(currentIndex)
            while (iterationSignal){
                while(secPressedHistory.length !== 0){
                    temporaryCont = [...secPressedHistory]
                    // console.log(temporaryCont)
                    secPressedHistory.forEach(nop => {
                        iter8(nop)
                    })
                    secPressedHistory = secPressedHistory.filter(xuio => !temporaryCont.includes(xuio))
                    // console.log(secPressedHistory)
                    // break
                }
                iterationSignal = false
                break
            }
        }
        // console.log(gameStartsignal)
    } else {
        if (!pressedHistory.includes(pressedBox) && !cont2.children.item(pressedBox).children.item(2).classList.contains('fa-flag')){
            y--
            cont2.children.item(pressedBox).children.item(2).classList.add('fa-flag')
            // console.log(y)
            flagText.innerHTML = y
        }
    }
}

const restartGame = () => { 
    box.forEach(n => {
        n.removeEventListener('click',gusFring)
    })    
}

const redAlert = () => { 
    cont1.style.animation = "red-white-yay 0.7s linear 0s 2"
    setTimeout(() => {
        cont1.style.animation = ''
        // console.log('timeout')
    }, 1700)    
}

const greenAlert = () => {
    
}

const startGame = (x22) => { 
    if (numberOfBombWithInRange){
        generateRandomBombs(x22)
        box.forEach(n => {
            n.addEventListener('click', gusFring)
        })
        flagText.innerHTML = parseInt(x)
        gameStartsignal = false
        document.querySelector('.ebol2').innerHTML = 'Press Otillingam to Restart'
        
    } else {
        redAlert()
    }
}

start.addEventListener('click', function(){
    bombs = []
    y = x
    // faFlag.style.color = 'rgb(110, 51, 28)'
    // console.log(y)
    if (flagCont.classList.contains('flag-container-active')){
        // flagCont = false
        flagSign = false
        flagCont.classList.remove('flag-container-active')
    }
    box.forEach(cell => {
        if (cell.classList.contains('black')){
            cell.classList.remove('black')
        }
        if (cell.children.item(0).classList.contains('fa-bomb')){
            cell.children.item(0).classList.remove('fa-bomb')
        }
        if (cell.classList.contains('red-boi')){
            cell.classList.remove('red-boi')
        }
        if (cell.classList.contains('win-boi')){
            cell.classList.remove('win-boi')
        }
        if (cell.children.item(2).classList.contains('fa-flag')){
            cell.children.item(2).classList.remove('fa-flag')
        }
        cell.children.item(1).innerHTML = ''
    })
    pressedHistory = []
    restartGame()
    startGame(x)
})

startGame(x)