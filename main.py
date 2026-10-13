def löscheZeile(y: number):
    music.play(music.create_sound_expression(WaveShape.SQUARE,
            1,
            3489,
            255,
            0,
            500,
            SoundExpressionEffect.TREMOLO,
            InterpolationCurve.LINEAR),
        music.PlaybackMode.IN_BACKGROUND)
    for Index in range(5):
        led.unplot(Index, y)
    basic.pause(200)
    for Index2 in range(5):
        led.plot(Index2, y)
    basic.pause(200)
    for Index3 in range(5):
        led.unplot(Index3, y)
    basic.pause(200)
    for Index4 in range(5):
        led.plot(Index4, y)
    basic.pause(200)
    for Index5 in range(5):
        led.unplot(Index5, y)
    kollabiereZeile(y)
def testeSpielstandLEDs():
    initialisiereSpiel()
    basic.show_icon(IconNames.ASLEEP)
    Spielstand = 0
    while Spielstand <= Siegpunkte:
        basic.set_led_colors(SpielstandAufLED(Spielstand, 0),
            SpielstandAufLED(Spielstand, 1),
            SpielstandAufLED(Spielstand, 2))
        basic.pause(500)
        Spielstand += 1
def zeigeSpielende():
    if istGameOver:
        music.play(music.create_sound_expression(WaveShape.SQUARE,
                905,
                1,
                255,
                106,
                1000,
                SoundExpressionEffect.TREMOLO,
                InterpolationCurve.LOGARITHMIC),
            music.PlaybackMode.IN_BACKGROUND)
        basic.show_icon(IconNames.SKULL)
        basic.pause(1000)
        basic.show_string(" GAME OVER ", 50)
        basic.show_number(Spielstand3)
        basic.pause(2000)
    else:
        music.play(music.string_playable("C E G C5 C5 C5 - - ", 250),
            music.PlaybackMode.UNTIL_DONE)
        basic.show_icon(IconNames.HAPPY)
        basic.pause(2000)
        basic.show_string(" GEWONNEN ", 50)
        basic.pause(2000)
def spieleTetris():
    global dotX, dotY, neuX, neuY, istGameOver
    while Spielstand3 < Siegpunkte and not (istGameOver):
        dotX = randint(0, 4)
        dotY = -1
        while True:
            music.rest(music.beat(BeatFraction.WHOLE))
            neuX = dotX
            neuY = dotY + 1
            if neuY <= 4 and not (led.point(neuX, neuY)):
                led.unplot(dotX, dotY)
                dotY = neuY
                dotX = neuX
                led.plot(dotX, dotY)
            music.rest(music.beat(BeatFraction.QUARTER))
            if not (dotY + 1 <= 4 and not (led.point(dotX, dotY + 1))):
                break
        music.play(music.tone_playable(60, music.beat(BeatFraction.SIXTEENTH)),
            music.PlaybackMode.IN_BACKGROUND)
        if istZeileVoll(dotY):
            löscheZeile(dotY)
            gibPunkte(1)
        if dotY < 0:
            istGameOver = True
    zeigeSpielende()

def on_logo_touched():
    global neuY
    while neuY <= 3 and not (led.point(neuX, neuY + 1)):
        neuY += 1
input.on_logo_event(TouchButtonEvent.TOUCHED, on_logo_touched)

def on_button_a():
    global dotX
    if dotX > 0:
        if not (led.point(dotX - 1, dotY)):
            led.unplot(dotX, dotY)
            dotX += -1
            led.plot(dotX, dotY)
input.on_button_event(Button.A, input.button_event_click(), on_button_a)

def gibPunkte(num: number):
    global Spielstand3
    Spielstand3 += num
    basic.set_led_colors(SpielstandAufLED(Spielstand3, 0),
        SpielstandAufLED(Spielstand3, 1),
        SpielstandAufLED(Spielstand3, 2))
    music.change_tempo_by(20)
def kopiereZeile(y2: number):
    for Index6 in range(5):
        if led.point(Index6, y2 - 1):
            led.plot(Index6, y2)
            led.unplot(Index6, y2 - 1)
def SpielstandAufLED(Spielstand2: number, numLED: number):
    global HelligkeitsStufen, R, G, B
    HelligkeitsStufen = Math.round(Siegpunkte / 3)
    R = Math.constrain(Spielstand2 - numLED * HelligkeitsStufen,
        0,
        HelligkeitsStufen) * 20
    G = (Math.constrain(Spielstand2 - numLED * HelligkeitsStufen,
        0,
        HelligkeitsStufen) * 2) ** 2
    B = Math.constrain(Spielstand2 - numLED * HelligkeitsStufen,
        0,
        HelligkeitsStufen) * 0
    return basic.rgb(R, G, B)

def on_button_b():
    global dotX
    if dotX < 4:
        if not (led.point(dotX + 1, dotY)):
            led.unplot(dotX, dotY)
            dotX += 1
            led.plot(dotX, dotY)
input.on_button_event(Button.B, input.button_event_click(), on_button_b)

def on_gesture_shake():
    global istGameOver
    istGameOver = True
input.on_gesture(Gesture.SHAKE, on_gesture_shake)

def kollabiereZeile(y3: number):
    global Index8
    Index8 = y3
    while Index8 > 0:
        kopiereZeile(Index8)
        Index8 += -1
    music.play(music.create_sound_expression(WaveShape.SQUARE,
            148,
            66,
            255,
            0,
            200,
            SoundExpressionEffect.TREMOLO,
            InterpolationCurve.LINEAR),
        music.PlaybackMode.UNTIL_DONE)
def begrüße():
    basic.show_leds("""
        . . . . .
        . # . # .
        . . . . .
        # . . . .
        # # # . .
        """)
    music.play(music.builtin_playable_sound_effect(soundExpression.hello),
        music.PlaybackMode.UNTIL_DONE)
    basic.show_leds("""
        . . . . .
        . . . # .
        . . . . .
        # . . . .
        # # # . .
        """)
    basic.show_leds("""
        . . . . .
        . # . # .
        . . . . .
        # . . . .
        # # # . .
        """)
def istZeileVoll(y4: number):
    for Index7 in range(5):
        if not (led.point(Index7, y4)):
            return False
    return True
def initialisiereSpiel():
    global Spielstand3, Siegpunkte, istGameOver
    Spielstand3 = 0
    Siegpunkte = 18
    basic.set_led_colors(0x000000, 0x000000, 0x000000)
    music.set_tempo(120)
    istGameOver = False
Index8 = 0
B = 0
G = 0
R = 0
HelligkeitsStufen = 0
neuY = 0
neuX = 0
dotY = 0
dotX = 0
Spielstand3 = 0
istGameOver = False
Siegpunkte = 0
begrüße()
music.rest(music.beat(BeatFraction.DOUBLE))
basic.show_leds("""
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    """)

def on_forever():
    initialisiereSpiel()
    basic.show_string("3")
    basic.show_string("2")
    basic.show_string("1")
    basic.show_leds("""
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        """)
    spieleTetris()
basic.forever(on_forever)
