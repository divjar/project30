import React, { useEffect, useRef } from 'react';

interface NotificationSoundProps {
  play: boolean;
}

const NotificationSound: React.FC<NotificationSoundProps> = ({ play }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (play && audioRef.current) {
      audioRef.current.play();
    }
  }, [play]);

  return (
    <audio ref={audioRef}>
      <source src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" type="audio/mpeg" />
    </audio>
  );
};

export default NotificationSound;