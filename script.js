(() => {

    // Note data
    const NOTE = Math.pow(2, 1 / 12);
    const OCTAVE = Math.pow(2, 13 / 12);

    const note_lookup = (() => {
        const base = 16.35;
        const notes = ["C", "C#", "D", "D#", "E", "F",
            "F#", "G", "G#", "A", "A#", "B"];
        const fz = [];
        for (let i=0; i < notes.length; i++) {
            fz.push(base * Math.pow(2, i / 12));
        }
        const lookup = {};
        for (let i=0; i < notes.length; i++) {
            lookup[notes[i]] = fz[i];
        }
        return lookup;
    })();
    
    function sha256(msg) {
        return CryptoJS.SHA256(msg).toString();
    }

    function major(strNote, oct) {
        const base = note_lookup[strNote] * ((oct === 0) ? 1 : (oct * OCTAVE));
        const y = base + (4 * NOTE);
        const z = y + (3 * NOTE);
        return [base, y, z];
    }

    function minor(strNote, oct) {
        const base = note_lookup[strNote] * ((oct === 0) ? 1 : (oct * OCTAVE));
        const y = base + (3 * NOTE);
        const z = y + (4 * NOTE);
        return [base, y, z];
    }

    function makePlay(synth) {
        return (chord, duration) => {
            return new Promise((res, _) => {
                synth.triggerAttackRelease(chord, duration);
                setTimeout(res, duration * 1000);
            });
        };
    }

    function toneEvent(synth) {

    }

    async function main() {

        await Tone.start();

        // const hash = sha256("test");
        const synth = new Tone.PolySynth(Tone.Synth).toDestination();

        const chordEvent = new Tone.ToneEvent(((time, chord) => {
            // the chord as well as the exact time of the event
            // are passed in as arguments to the callback function
            synth.triggerAttackRelease(chord, 0.5, time);
        }), ["D4", "E4", "F4"]);
        // start the chord at the beginning of the transport timeline
        chordEvent.start();
        // loop it every measure for 8 measures
        chordEvent.loop = 8;
        chordEvent.loopEnd = "1m";
        
        //play a note every quarter-note
        const loopA = new Tone.Loop((time) => {
            synth.triggerAttackRelease("C2", "8n", time);
        }, "4n").start(0);

        // all loops start when the Transport is started
        Tone.getTransport().start();
        // ramp up to 800 bpm over 10 seconds
        Tone.getTransport().bpm.rampTo(800, 10);

        const play = makePlay(synth);
        const notes = "CDEFG";
        for (let i=0; i < notes.length; i++) {
            await play(major(notes[i], 2), 1);
        }
    }

    document.body.addEventListener("click", e => {
        main();
    });

})();