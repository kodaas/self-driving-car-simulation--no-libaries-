const carCanvas = document.getElementById("carCanvas")
const networkCanvas = document.getElementById("networkCanvas")
const paused = document.getElementById("paused")
let isFocused = true
paused.style.display = 'none'

carCanvas.width = 200
networkCanvas.width = 300
const N = 500

const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")

const road = new Road(carCanvas.width/2,carCanvas.width*0.95)
const Cars = generateCars(N);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -250, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -650, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(3), -550, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -270, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -380, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -420, 30, 50, "DUMMY", 2)
];

let bestCar = Cars[0]
if (localStorage.getItem("bestBrain")) {
    // bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"))
    for(let i=0;i<Cars.length;i++){
        Cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(Cars[i].brain,0.1);
        }
    }
}

function generateCars(N) {
    const cars = []
    for (let i = 1; i <= N; i++) {
        cars.push(
            new Car(road.getLaneCenter(1), 100, 30, 50, "AI")
        )
    }
    return cars
}

animate()

window.addEventListener('focus', () => {
    paused.style.display = 'none'
    isFocused = true
    animate()
})

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain))
}

function discard() {
    localStorage.removeItem("bestBrain")
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders,[])
    }

    for (let i = 0; i < Cars.length; i++) { 
        Cars[i].update(road.borders,traffic)
    }

    bestCar = Cars.find(c => c.y == Math.min(...Cars.map(c => c.y)))

    carCanvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight

    carCtx.save()
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.65)
    
    road.draw(carCtx)
    for (let i = 0; i < traffic.length; i++) { 
        traffic[i].draw(carCtx,"Purple")
    }

    carCtx.globalAlpha = 0.2
    for (let i = 0; i < Cars.length; i++) { 
        Cars[i].draw(carCtx,"blue")
    }
    carCtx.globalAlpha = 1

    bestCar.draw(carCtx,"blue", true)

    carCtx.restore()

    networkCtx.lineDashOffset = -time/50
    Visualizer.drawNetwork(networkCtx, bestCar.brain)

    window.addEventListener('blur', () => {
        paused.style.display = 'block'
        isFocused = false
    })

    if (isFocused)  requestAnimationFrame(animate)
    
}	
