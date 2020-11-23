function Animate(fps, draw) {
    var that = this;

    that.animationFrameId = 0;

    that.start = () => {
        let frameCount = 0
        let animationFrameId

        const startDate = Date.now()
        var lastUpdate = startDate

        function render() {
            var now = Date.now()
            var elapsedMils = now - lastUpdate

            if (elapsedMils >= (1000 / fps)) {
                frameCount++;
                if (draw) {
                    draw({
                        elapsed: now - startDate,
                        frameId: frameCount,
                    })
                }
                lastUpdate = now - elapsedMils % (1000 / fps)
            }
            that.animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return that
    }


    that.stop = () => {
        console.log(that.animationFrameId)
        window.cancelAnimationFrame(that.animationFrameId)
    }

}

export default Animate