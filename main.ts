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
    if (Spielstand > Highscore) {
        Highscore = Spielstand
    }
    if (istGameOver) {
        music.play(music.createSoundExpression(WaveShape.Square, 905, 1, 255, 106, 1000, SoundExpressionEffect.Tremolo, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        basic.showIcon(IconNames.Skull)
        basic.pause(1000)
        basic.showString(" GAME OVER ", 50)
        basic.showNumber(Spielstand)
        basic.pause(2000)
        basic.showString(" BEST ", 50)
        basic.showNumber(Highscore)
        basic.pause(2000)
    } else {
        music.play(music.stringPlayable("C E G C5 C5 C5 - - ", 250), music.PlaybackMode.UntilDone)
        basic.showIcon(IconNames.Happy)
        basic.pause(2000)
        basic.showString(" GEWONNEN ", 50)
        basic.showNumber(Spielstand)
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
    music.setTempo(9999)
})
function gibPunkte (num: number) {
    let p3 = 0
let p2 = 0
let p1 = 0
altesLevel = Math.idiv(Spielstand - 1, 3)
    Spielstand += num
    neuesLevel = Math.idiv(Spielstand - 1, 3)
    if (neuesLevel > altesLevel) {
        music.changeTempoBy(40)
        Speed = music.tempo()
    }
    p1 = Spielstand
    p2 = Spielstand - 1
    p3 = Spielstand - 2
    let farbe1 = p1 > 0 ? getLevelFarbe(Math.idiv(p1 - 1, 3)) : 0
let farbe2 = p2 > 0 ? getLevelFarbe(Math.idiv(p2 - 1, 3)) : 0
let farbe3 = p3 > 0 ? getLevelFarbe(Math.idiv(p3 - 1, 3)) : 0
basic.setLedColors(farbe1, farbe2, farbe3)
    Level = neuesLevel
    if (Spielstand == Highscore + 1) {
        music.play(music.createSoundExpression(WaveShape.Triangle, 1078, 1551, 86, 255, 1000, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
    }
}
function kopiereZeile (y: number) {
    for (let Index6 = 0; Index6 <= 4; Index6++) {
        if (led.point(Index6, y - 1)) {
            led.plot(Index6, y)
            led.unplot(Index6, y - 1)
            hatStapel = true
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
    hatStapel = false
    i = y
    while (i > 0) {
        kopiereZeile(i)
        i += -1
    }
    if (hatStapel) {
        music.play(music.createSoundExpression(WaveShape.Square, 148, 66, 255, 0, 200, SoundExpressionEffect.Tremolo, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    }
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
    for (let j = 0; j <= 4; j++) {
        if (!(led.point(j, y))) {
            return false
        }
    }
    return true
}
input.onLogoEvent(TouchButtonEvent.Released, function () {
    music.setTempo(Speed)
})
function getLevelFarbe (level: number) {
    // Dunkelrot
    // Rot
    // Rot-Orange
    // Orange
    // Gold
    // Gelbgrün
    // Grün
    // Mint
    // Türkis
    // Cyanblau
    // Blau
    // Indigo
    // Violett
    // Grau
    // Grau
    // Pink
    // Weiß (Endstufe)
    levelFarben = [
    [20, 0, 0],
    [55, 0, 0],
    [90, 15, 0],
    [120, 45, 0],
    [160, 90, 0],
    [40, 110, 0],
    [0, 50, 0],
    [0, 90, 20],
    [0, 110, 90],
    [0, 40, 120],
    [0, 0, 100],
    [40, 0, 140],
    [100, 0, 180],
    [50, 50, 50],
    [150, 120, 130],
    [220, 50, 180],
    [250, 250, 250]
    ]
    Level = level % levelFarben.length
    return basic.rgb(levelFarben[level][0], levelFarben[level][1], levelFarben[level][2])
}
function initialisiereSpiel () {
    Spielstand = 0
    Siegpunkte = 48
    Speed = 100
    music.setTempo(Speed)
    istGameOver = false
    basic.setLedColors(0x000000, 0x000000, 0x000000)
}
let levelFarben: number[][] = []
let i = 0
let B = 0
let G = 0
let R = 0
let HelligkeitsStufen = 0
let hatStapel = false
let neuesLevel = 0
let altesLevel = 0
let Speed = 0
let neuY = 0
let neuX = 0
let Siegpunkte = 0
let istGameOver = false
let Spielstand = 0
let dotY = 0
let dotX = 0
let Highscore = 0
let Level = 0
Level = 0
Highscore = 15
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
