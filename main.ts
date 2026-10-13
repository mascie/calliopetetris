function löscheZeile (y: number) {
    music.play(music.createSoundExpression(WaveShape.Square, 1, 3489, 255, 0, 500, SoundExpressionEffect.Tremolo, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
    for (let Index = 0; Index <= 4; Index++) {
        led.unplot(Index, y)
    }
    basic.pause(200)
    for (let Index2 = 0; Index2 <= 4; Index2++) {
        led.plot(Index2, y)
    }
    basic.pause(200)
    for (let Index3 = 0; Index3 <= 4; Index3++) {
        led.unplot(Index3, y)
    }
    basic.pause(200)
    for (let Index4 = 0; Index4 <= 4; Index4++) {
        led.plot(Index4, y)
    }
    basic.pause(200)
    for (let Index5 = 0; Index5 <= 4; Index5++) {
        led.unplot(Index5, y)
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
    if (dotX > 0 && (Spielstand2 < Siegpunkte && !(istGameOver))) {
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
        basic.showNumber(Spielstand2)
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
    while (Spielstand2 < Siegpunkte && !(istGameOver)) {
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
    if (dotX < 4 && (Spielstand2 < Siegpunkte && !(istGameOver))) {
        if (!(led.point(dotX + 1, dotY))) {
            led.unplot(dotX, dotY)
            dotX += 1
            led.plot(dotX, dotY)
        }
    }
})
input.onLogoEvent(TouchButtonEvent.Touched, function () {
    while (neuY <= 3 && !(led.point(neuX, neuY + 1))) {
        neuY += 1
    }
})
function gibPunkte (num: number) {
    Spielstand2 += num
    basic.setLedColors(SpielstandAufLED(Spielstand2, 0), SpielstandAufLED(Spielstand2, 1), SpielstandAufLED(Spielstand2, 2))
    music.changeTempoBy(20)
}
function kopiereZeile (y: number) {
    for (let Index6 = 0; Index6 <= 4; Index6++) {
        if (led.point(Index6, y - 1)) {
            led.plot(Index6, y)
            led.unplot(Index6, y - 1)
        }
    }
}
function SpielstandAufLED (Spielstand: number, numLED: number) {
    HelligkeitsStufen = Math.round(Siegpunkte / 3)
    R = Math.constrain(Spielstand - numLED * HelligkeitsStufen, 0, HelligkeitsStufen) * 20
    G = (Math.constrain(Spielstand - numLED * HelligkeitsStufen, 0, HelligkeitsStufen) * 2) ** 2
    B = Math.constrain(Spielstand - numLED * HelligkeitsStufen, 0, HelligkeitsStufen) * 0
    return basic.rgb(R, G, B)
}
input.onGesture(Gesture.Shake, function () {
    istGameOver = true
})
function kollabiereZeile (y: number) {
    Index8 = y
    while (Index8 > 0) {
        kopiereZeile(Index8)
        Index8 += -1
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
    for (let Index7 = 0; Index7 <= 4; Index7++) {
        if (!(led.point(Index7, y))) {
            return false
        }
    }
    return true
}
function initialisiereSpiel () {
    Spielstand2 = 0
    Siegpunkte = 18
    basic.setLedColors(0x000000, 0x000000, 0x000000)
    music.setTempo(120)
    istGameOver = false
}
let Index8 = 0
let B = 0
let G = 0
let R = 0
let HelligkeitsStufen = 0
let neuY = 0
let neuX = 0
let dotY = 0
let istGameOver = false
let Spielstand2 = 0
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
