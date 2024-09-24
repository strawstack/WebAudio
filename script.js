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
        console.log(lookup)
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

    function main() {
        const synth = new Tone.PolySynth(Tone.Synth).toDestination();
        const chord = major("D", 2);
        console.log(chord);
        synth.triggerAttackRelease(chord, 2);
    }

    document.body.addEventListener("click", e => {
        main();
    });

})();