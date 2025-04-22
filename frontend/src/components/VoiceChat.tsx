import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:3001";

const VoiceChat: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io(BACKEND_URL);

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("webrtc_offer", (offer: RTCSessionDescriptionInit) => {
      console.log("Received offer:", offer);
      handleOffer(offer);
    });

    socketRef.current.on(
      "webrtc_answer",
      (answer: RTCSessionDescriptionInit) => {
        console.log("Received answer:", answer);
        handleAnswer(answer);
      }
    );

    socketRef.current.on(
      "webrtc_ice_candidate",
      (candidate: RTCIceCandidateInit) => {
        console.log("Received ICE candidate:", candidate);
        handleIceCandidate(candidate);
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const startCall = async () => {
    setIsCalling(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setLocalStream(stream);

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.ontrack = (event) => {
        console.log("Received remote stream");
        setRemoteStream(event.streams[0]);
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Sending ICE candidate:", event.candidate.address);
          socketRef.current.emit("webrtc_ice_candidate", event.candidate);
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log("Sending offer:", offer);
      socketRef.current.emit("webrtc_offer", offer);
    } catch (error) {
      console.error("Error starting call:", error);
      setIsCalling(false);
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setLocalStream(stream);
  
      const pc = new RTCPeerConnection();
      pcRef.current = pc;
  
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream); // 🔥 This is critical
      });
  
      pc.ontrack = (event) => {
        console.log("Received remote stream");
        setRemoteStream(event.streams[0]);
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
      };
  
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("webrtc_ice_candidate", event.candidate);
        }
      };
  
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current.emit("webrtc_answer", answer);
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };
  
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    try {
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(answer);
      }
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      if (pcRef.current && candidate) {
        await pcRef.current.addIceCandidate(candidate);
      }
    } catch (error) {
      console.error("Error handling ICE candidate:", error);
    }
  };


  return (
    <div>
      <button onClick={startCall} disabled={isCalling}>
        {isCalling ? "Calling..." : "Start Voice Call"}
      </button>

      <audio ref={remoteAudioRef} autoPlay playsInline muted={false} />
    </div>
  );
};

export default VoiceChat;

