import { useRef, useState, useEffect } from 'react';
import './CountDownTimer.css';

function CountDownTimer() {
    const [time, setTime] = useState(0);
    const [input, setInput] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState('');
    const [currentSong, setCurrentSong] = useState('');
    const timeRef = useRef(null);

    // Âm thanh
    const audio1 = useRef(new Audio('sounds/EpicActionDrums-DavidBergesCasas.mp3'));
    const audio2 = useRef(new Audio('sounds/DreamSpeedrunMusic.mp3'));
    const audio3 = useRef(new Audio('sounds/ActionChase-OlegSemenov.mp3'));
    const audio4 = useRef(new Audio('sounds/ChurchBell-Westminster chimes.mp3'));

    // Hàm hỗ trợ fade âm lượng
    const fadeOut = (audioRef) => {
        const audio = audioRef.current;
        let volume = audio.volume;
        const fade = setInterval(() => {
            if (volume > 0.05) {
                volume -= 0.05;
                audio.volume = volume;
            } else {
                clearInterval(fade);
                audio.pause();
                audio.currentTime = 0;
                audio.volume = 1;
            }
        }, 200);
    };

    // Phát nhạc khi đến mốc thời gian
    useEffect(() => {
        if (!isActive) return;

        if (time === 240) {
            audio1.current.play();
        } else if (time === 180) {
            fadeOut(audio1);
            audio2.current.play();
        } else if (time === 58) {
            fadeOut(audio2);
            audio3.current.play();
        } else if (time === 0) {
            fadeOut(audio3);
            audio4.current.play();
            setIsActive(false);
        }
    }, [time, isActive]);

    // Hiển thị dòng âm nhạc trạng thái
    useEffect(() => {
        if (!isActive) return;
        if (time === 240) setCurrentSong('Khởi động 🎶');
        else if (time === 180) setCurrentSong('Chill 🪶');
        else if (time === 58) setCurrentSong('⚡ Tăng tốc ⚡');
        else if (time === 0) setCurrentSong('HẾT GIỜ! 🔔');
    }, [time, isActive]);

    // Đồng hồ đếm ngược
    useEffect(() => {
        if (isActive && time > 0) {
            timeRef.current = setTimeout(() => setTime(time - 1), 1000);
        } else if (time === 0) {
            clearTimeout(timeRef.current);
        }
        return () => clearTimeout(timeRef.current);
    }, [time, isActive]);

    const formatTime = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(Math.floor(seconds % 60)).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    // Xử lý bắt đầu
    const handleStart = () => {
        const totalSeconds = Number(input.hours) * 3600 + Number(input.minutes) * 60 + Number(input.seconds);

        if (totalSeconds === 0) {
            setError('⚠️ Vui lòng nhập thời gian ít nhất 1 trong 3 ô!');
            return;
        } else if (totalSeconds < 0) {
            setError('⚠️ Thời gian không được để số âm!');
            return;
        }

        setError('');
        setTime(totalSeconds);
        setIsActive(true);
    };

    // Xử lý reset
    const handleReset = () => {
        clearTimeout(timeRef.current);
        setIsActive(false);
        setTime(0);
        setError('');
        setCurrentSong('');

        [audio1, audio2, audio3, audio4].forEach((a) => {
            a.current.pause();
            a.current.currentTime = 0;
            a.current.volume = 1;
        });
    };

    return (
        <div className="timer-container">
            <h1 className="title">⏳ Đồng hồ đếm ngược</h1>

            <div className="input-container">
                <input
                    type="number"
                    placeholder="Hours..."
                    value={input.hours}
                    onChange={(e) => setInput({ ...input, hours: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Minutes..."
                    value={input.minutes}
                    onChange={(e) => setInput({ ...input, minutes: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Seconds..."
                    value={input.seconds}
                    onChange={(e) => setInput({ ...input, seconds: e.target.value })}
                />
            </div>

            {/* Hiển thị thông báo lỗi */}
            {error && <p className="error-text">{error}</p>}

            <div className="display-time">{formatTime(time)}</div>

            <p className="status-text">{currentSong}</p>

            <div className="buttons">
                <button onClick={handleStart} className="btn start">
                    Start
                </button>
                <button onClick={handleReset} className="btn reset">
                    Reset
                </button>
            </div>
        </div>
    );
}

export default CountDownTimer;
