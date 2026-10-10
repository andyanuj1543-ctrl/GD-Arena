export const initSpeechRecognition = (
  onResult: (text: string, isFinal: boolean) => void,
  onStart: () => void,
  onEnd: () => void
) => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn("Speech Recognition API not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  let hasEmittedStart = false;

  let isExplicitlyStopped = false;

  recognition.onstart = () => {
    hasEmittedStart = false;
    isExplicitlyStopped = false;
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    if ((interimTranscript.trim() || finalTranscript.trim()) && !hasEmittedStart) {
      onStart();
      hasEmittedStart = true;
    }

    if (finalTranscript.trim()) {
      onResult(finalTranscript.trim(), true);
      hasEmittedStart = false;
    } else if (interimTranscript.trim()) {
      onResult(interimTranscript.trim(), false);
    }
  };

  recognition.onerror = (event: any) => {
    console.error("Speech recognition error", event.error);
    if (event.error === 'not-allowed') {
      isExplicitlyStopped = true;
    }
  };

  recognition.onend = () => {
    onEnd();
    if (!isExplicitlyStopped) {
      try {
        recognition.start();
      } catch (e) {}
    }
  };
  
  // monkey patch stop to set the flag
  const originalStop = recognition.stop.bind(recognition);
  recognition.stop = () => {
    isExplicitlyStopped = true;
    originalStop();
  };

  return recognition;
};
