import React, { useState, useEffect } from "react";
import './App.css';

function App() {
    const [audios, setAudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAudio, setSelectedAudio] = useState(null);
    const [message, setMessage] = useState("");
    const [audioColors, setAudioColors] = useState([]);

    // Buscar a lista de áudios do backend
    useEffect(() => {
        const fetchAudios = async () => {
            try {
                const response = await fetch("https://botdisc-t53r.onrender.com/audios");
                const data = await response.json();
                setAudios(data.audios);

                const colors = data.audios.map(() => getRandomColor());
                setAudioColors(colors); 

                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar os áudios:", error);
                setLoading(false);
            }
        };

        fetchAudios();
    }, []);

    // Enviar comando para tocar o áudio no bot
    const playAudio = async (audioFile) => {
        try {
            await fetch("https://botdisc-t53r.onrender.com/play", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ audioFile })
            });
            setMessage(`Tocando ${audioFile}`);
        } catch (error) {
            console.error("Erro ao enviar o comando de áudio:", error);
            setMessage("Erro ao tentar tocar o áudio.");
        }
    };

    // Lidar com o upload de áudio
    const handleAudioChange = (event) => {
        setSelectedAudio(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedAudio) {
            setMessage("Por favor, selecione um arquivo de áudio.");
            return;
        }

        const formData = new FormData();
        formData.append("audio", selectedAudio);

        try {
            const response = await fetch("https://botdisc-t53r.onrender.com/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setMessage(data.message);

            // Atualizar a lista de áudios após o upload
            if (data.message.includes("sucesso")) {
                const updatedAudios = await fetch("https://botdisc-t53r.onrender.com/audios");
                const updatedData = await updatedAudios.json();
                setAudios(updatedData.audios);
            }
        } catch (error) {
            console.error("Erro ao enviar o áudio:", error);
            setMessage("Erro ao enviar o áudio.");
        }
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <div className="app-container">
            <h1 className="title">Mesa de Som do Clã</h1>

            <div className="akatsuki-image">
                <img
                    src="/haha.jpg"
                    alt="ele está de olho"
                />
            </div>

            {/* Formulário de upload */}
            <form onSubmit={handleSubmit} className="upload-form">
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    className="file-input"
                />
                <button type="submit" className="upload-button">Enviar Áudio</button>
            </form>

            {message && <p className="message">{message}</p>}

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <div className="audio-list">
                    {audios.map((audio, index) => (
                        <button
                            key={index}
                            className="audio-button"
                            style={{ backgroundColor: audioColors[index] }}
                            onClick={() => playAudio(audio)}
                        >
                            Tocar {audio}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;
