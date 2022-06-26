class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        const infinity = 10000000;

        this.left = x - width / 2
        this.right = x + width / 2 
        this.top = -infinity
        this.bottom = infinity

        const topLeft = { x: this.left, y: this.top }
        const topRight = { x: this.right, y: this.top }
        const bottomLeft = { x: this.left, y: this.bottom }
        const bottomRight = { x: this.right, y: this.bottom }
        
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount
        const laneMidPoint = (this.left + laneWidth / 2)
        if (laneIndex < 0) laneIndex = 0
        
        return laneMidPoint + (Math.min(laneIndex,this.laneCount-1) * laneWidth);
    }

    draw(ctx) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "gray";

        for (let i = 1; i <= this.laneCount - 1; i++) {
            const x = lerp(this.left, this.right, i / this.laneCount)
            ctx.setLineDash([10,10])
            
            ctx.beginPath()
            ctx.moveTo(x, this.top)
            ctx.lineTo(x, this.bottom)
            ctx.stroke();
        }

        ctx.setLineDash([1, 1])
        
        this.borders.forEach((border) => {
            ctx.beginPath()
            ctx.moveTo(border[0].x, border[0].y)
            ctx.lineTo(border[1].x, border[1].y)
            ctx.stroke();
        })

    }
}