function löscheZeile (y: number) {
    music.play(music.createSoundExpression(WaveShape.Square, 1, 3489, 255, 0, 500, SoundExpressionEffect.Tremolo, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
    for (let Index = 0; Index <= 4; Index++) {
        led.unplot(Index, y)
    }
    basic.pause(200)
    for (let Index = 0; Index <= 4; Index++) {
        led.plot(Index, y)
    }
    basic.pause(200)
    for (let Index = 0; Index <= 4; Index++) {
        led.unplot(Index, y)
    }
    basic.pause(200)
    for (let Index = 0; Index <= 4; Index++) {
        led.plot(Index, y)
    }
    basic.pause(200)
    for (let Index = 0; Index <= 4; Index++) {
        led.unplot(Index, y)
    }
    kollabiereZeile(y)
}
function zeigeIntro () {
    basic.showLeds(`
        . . . . .
        . # . # .
        . . . . .
        # . . . .
        # # # # .
        `)
    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)
    basic.showLeds(`
        . . . . .
        . . . # .
        . . . . .
        # . . . .
        # # # # .
        `)
    basic.showLeds(`
        . . . . .
        . # . # .
        . . . . .
        # . . . .
        # # # # .
        `)
}
input.onPinTouchEvent(TouchPin.P1, input.buttonEventDown(), function () {
    while (neuY <= 3 && !(led.point(neuX, neuY + 1))) {
        neuY += 1
    }
})
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    if (neuX > 0) {
        if (!(led.point(neuX - 1, neuY))) {
            neuX += -1
        }
    }
})
function gibPunkte (num: number) {
    Punktzahl += num
    basic.setLedColors(basic.rgb(0, Math.constrain(Punktzahl, 0, 4) * 63, 0), basic.rgb(0, Math.constrain(Punktzahl - 4, 0, 4) * 63, 0), basic.rgb(0, Math.constrain(Punktzahl - 8, 0, 4) * 63, 0))
    music.changeTempoBy(20)
    habIchGewonnen()
}
function habIchGewonnen () {
    if (Punktzahl >= 12) {
        music.play(music.stringPlayable("C E G C5 C5 C5 - - ", 250), music.PlaybackMode.UntilDone)
        basic.showIcon(IconNames.Happy)
        basic.pause(2000)
        basic.showString(" GEWONNEN ", 50)
        basic.pause(2000)
    }
}
function kopiereZeile (y: number) {
    for (let Index = 0; Index <= 4; Index++) {
        if (led.point(Index, y - 1)) {
            led.plot(Index, y)
            led.unplot(Index, y - 1)
        }
    }
}
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    if (neuX < 4) {
        if (!(led.point(neuX + 1, neuY))) {
            neuX += 1
        }
    }
})
function kollabiereZeile (y: number) {
    Index = y
    while (Index > 0) {
        kopiereZeile(Index)
        Index += -1
    }
    music.play(music.createSoundExpression(WaveShape.Square, 148, 66, 255, 0, 200, SoundExpressionEffect.Tremolo, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
}
function istZeileVoll (y: number) {
    for (let Index = 0; Index <= 4; Index++) {
        if (!(led.point(Index, y))) {
            return false
        }
    }
    return true
}
input.onPinTouchEvent(TouchPin.P2, input.buttonEventDown(), function () {
    while (neuY <= 3 && !(led.point(neuX, neuY + 1))) {
        neuY += 1
    }
})
function GameOver () {
    music.play(music.createSoundExpression(WaveShape.Square, 905, 1, 255, 106, 1000, SoundExpressionEffect.Tremolo, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
    basic.showIcon(IconNames.Skull)
    basic.pause(1000)
    basic.showString(" GAME OVER ", 50)
    basic.pause(2000)
}
let dotY = 0
let dotX = 0
let istGameOver = false
let Index = 0
let Punktzahl = 0
let neuX = 0
let neuY = 0
zeigeIntro()
music.rest(music.beat(BeatFraction.Double))
basic.showLeds(`
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    `)
basic.forever(function () {
    Punktzahl = 0
    basic.setLedColors(0x000000, 0x000000, 0x000000)
    music.setTempo(120)
    istGameOver = false
    while (!(istGameOver)) {
        dotX = -1
        dotY = -1
        neuX = randint(0, 4)
        neuY = 0
        while (neuY <= 4 && !(led.point(neuX, neuY))) {
            music.rest(music.beat(BeatFraction.Whole))
            led.unplot(dotX, dotY)
            led.plot(neuX, neuY)
            dotY = neuY
            dotX = neuX
            neuY = dotY + 1
        }
        music.rest(music.beat(BeatFraction.Eighth))
        music.play(music.tonePlayable(55, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.UntilDone)
        if (istZeileVoll(dotY)) {
            löscheZeile(dotY)
            gibPunkte(1)
        }
        music.rest(music.beat(BeatFraction.Whole))
        if (dotY < 0) {
            istGameOver = true
        }
    }
    GameOver()
})
