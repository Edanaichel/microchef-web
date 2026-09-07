/**
 * The score is synthesised in the browser rather than loaded as a file: a low
 * drone that sits under the whole film, plus a soft impact on each act change.
 * Nothing plays until the viewer explicitly turns sound on.
 */
class Score {
  private ctx: AudioContext | null = null;
  private bed: GainNode | null = null;
  private drones: OscillatorNode[] = [];
  enabled = false;

  private setup() {
    if (this.ctx) return;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctor();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // Warm, slow-moving pad. Two detuned voices a fifth apart.
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320;
    filter.Q.value = 0.7;
    filter.connect(master);

    [55, 82.41, 110].forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      osc.type = index === 2 ? "sine" : "triangle";
      osc.frequency.value = frequency;
      osc.detune.value = index * 4;

      const voice = ctx.createGain();
      voice.gain.value = index === 2 ? 0.05 : 0.14;
      osc.connect(voice).connect(filter);
      osc.start();
      this.drones.push(osc);
    });

    // Slow breathing so the bed never sits perfectly still.
    const lfo = ctx.createOscillator();
    const lfoDepth = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoDepth.gain.value = 90;
    lfo.connect(lfoDepth).connect(filter.frequency);
    lfo.start();

    this.ctx = ctx;
    this.bed = master;
  }

  async toggle() {
    this.setup();
    if (!this.ctx || !this.bed) return false;
    if (this.ctx.state === "suspended") await this.ctx.resume();

    this.enabled = !this.enabled;
    const now = this.ctx.currentTime;
    this.bed.gain.cancelScheduledValues(now);
    this.bed.gain.setValueAtTime(this.bed.gain.value, now);
    this.bed.gain.linearRampToValueAtTime(this.enabled ? 0.22 : 0, now + 1.1);
    return this.enabled;
  }

  /** A soft cinematic hit, used when an act comes into frame. */
  impact(intensity = 1) {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweep.type = "sine";
    sweep.frequency.setValueAtTime(120, now);
    sweep.frequency.exponentialRampToValueAtTime(38, now + 0.9);
    sweepGain.gain.setValueAtTime(0, now);
    sweepGain.gain.linearRampToValueAtTime(0.32 * intensity, now + 0.04);
    sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
    sweep.connect(sweepGain).connect(ctx.destination);
    sweep.start(now);
    sweep.stop(now + 1.6);

    // Air: a short filtered noise tail so the hit has texture.
    const frames = ctx.sampleRate * 1.1;
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 3;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1100;
    band.Q.value = 0.9;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.07 * intensity;
    noise.connect(band).connect(noiseGain).connect(ctx.destination);
    noise.start(now);
  }

  dispose() {
    this.drones.forEach((osc) => osc.stop());
    this.drones = [];
    this.ctx?.close();
    this.ctx = null;
  }
}

export const score = new Score();
