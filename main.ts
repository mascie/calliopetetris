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
function testeSpielstandLEDs () {
    initialisiereSpiel()
    basic.showIcon(IconNames.Asleep)
    for (let Spielstand = 0; Spielstand <= Siegpunkte; Spielstand++) {
        basic.setLedColors(SpielstandAufLED(Spielstand, 0), SpielstandAufLED(Spielstand, 1), SpielstandAufLED(Spielstand, 2))
        basic.pause(500)
    }
}
input.onButtonEvent(Button.A, input.buttonEventDown(), function () {
    if (dotX > 0) {
        if (!(led.point(dotX - 1, dotY))) {
            led.unplot(dotX, dotY)
            dotX += -1
            led.plot(dotX, dotY)
        }
    }
})
function zeigeSpielende () {
    if (istGameOver) {
        music.play(music.createSoundExpression(WaveShape.Square, 905, 1, 255, 106, 1000, SoundExpressionEffect.Tremolo, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        basic.showIcon(IconNames.Skull)
        basic.pause(1000)
        basic.showString(" GAME OVER ", 50)
        basic.showNumber(Spielstand)
        basic.pause(2000)
    } else {
        music.play(music.stringPlayable("C E G C5 C5 C5 - - ", 250), music.PlaybackMode.UntilDone)
        basic.showIcon(IconNames.Happy)
        basic.pause(2000)
        basic.showString(" GEWONNEN ", 50)
        basic.pause(2000)
    }
}
function spieleTetris () {
    while (Spielstand < Siegpunkte && !(istGameOver)) {
        dotX = randint(0, 4)
        dotY = -1
        while (true) {
            music.rest(music.beat(BeatFraction.Whole))
            neuX = dotX
            neuY = dotY + 1
            if (neuY <= 4 && !(led.point(neuX, neuY))) {
                led.unplot(dotX, dotY)
                dotY = neuY
                dotX = neuX
                led.plot(dotX, dotY)
            }
            music.rest(music.beat(BeatFraction.Quarter))
            if (!(dotY + 1 <= 4 && !(led.point(dotX, dotY + 1)))) {
                music.setTempo(Speed)
                break;
            }
        }
        music.play(music.tonePlayable(60, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
        if (istZeileVoll(dotY)) {
            löscheZeile(dotY)
            gibPunkte(1)
        }
        if (dotY < 0) {
            istGameOver = true
        }
    }
    zeigeSpielende()
}
input.onButtonEvent(Button.B, input.buttonEventDown(), function () {
    if (dotX < 4) {
        if (!(led.point(dotX + 1, dotY))) {
            led.unplot(dotX, dotY)
            dotX += 1
            led.plot(dotX, dotY)
        }
    }
})
input.onLogoEvent(TouchButtonEvent.Touched, function () {
    Speed = music.tempo()
    music.setTempo(9999)
})
function gibPunkte (num: number) {
    Spielstand += num
    basic.setLedColors(SpielstandAufLED(Spielstand, 0), SpielstandAufLED(Spielstand, 1), SpielstandAufLED(Spielstand, 2))
    music.changeTempoBy(20)
}
function SpielstandLevelAufLED (Punkte: number) {
    Level = Math.round(Punkte / 3)
    R = 0
    G = 0
    B = 0
    return basic.rgb(R, G, B)
}
function kopiereZeile (y: number) {
    for (let Index = 0; Index <= 4; Index++) {
        if (led.point(Index, y - 1)) {
            led.plot(Index, y)
            led.unplot(Index, y - 1)
        }
    }
}
function SpielstandAufLED (Punkte: number, numLED: number) {
    HelligkeitsStufen = Math.round(Siegpunkte / 3)
    R = Math.constrain(Punkte - numLED * HelligkeitsStufen, 0, HelligkeitsStufen) * 20
    G = (Math.constrain(Punkte - numLED * HelligkeitsStufen, 0, HelligkeitsStufen) * 2) ** 2
    B = Math.constrain(Punkte - numLED * HelligkeitsStufen, 0, HelligkeitsStufen) * 0
    return basic.rgb(R, G, B)
}
input.onGesture(Gesture.Shake, function () {
    istGameOver = true
})
function kollabiereZeile (y: number) {
    Index = y
    while (Index > 0) {
        kopiereZeile(Index)
        Index += -1
    }
    music.play(music.createSoundExpression(WaveShape.Square, 148, 66, 255, 0, 200, SoundExpressionEffect.Tremolo, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
}
function begrüße () {
    basic.showLeds(`
        . . . . .
        . # . # .
        . . . . .
        # . . . .
        # # # . .
        `)
    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)
    basic.showLeds(`
        . . . . .
        . . . # .
        . . . . .
        # . . . .
        # # # . .
        `)
    basic.showLeds(`
        . . . . .
        . # . # .
        . . . . .
        # . . . .
        # # # . .
        `)
}
function istZeileVoll (y: number) {
    for (let Index = 0; Index <= 4; Index++) {
        if (!(led.point(Index, y))) {
            return false
        }
    }
    return true
}
input.onLogoEvent(TouchButtonEvent.Released, function () {
    music.setTempo(Speed)
})
function initialisiereSpiel () {
    Spielstand = 0
    Siegpunkte = 18
    basic.setLedColors(0x000000, 0x000000, 0x000000)
    music.setTempo(120)
    istGameOver = false
}
let Index = 0
let HelligkeitsStufen = 0
let B = 0
let G = 0
let R = 0
let Level = 0
let Speed = 0
let neuY = 0
let neuX = 0
let Spielstand = 0
let istGameOver = false
let dotY = 0
let dotX = 0
let Siegpunkte = 0
begrüße()
music.rest(music.beat(BeatFraction.Double))
basic.showLeds(`
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    `)
basic.forever(function () {
    initialisiereSpiel()
    basic.showString("3")
    basic.showString("2")
    basic.showString("1")
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
    spieleTetris()
})
