import React, { useState, useEffect } from "react";
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';

function MesaSom() {
    const [audios, setAudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAudio, setSelectedAudio] = useState(null);
    const [message, setMessage] = useState("");
    const [audioColors, setAudioColors] = useState([]);

    const BASE_URL = "https://botdisc-t53r.onrender.com"; 

    useEffect(() => {
        const fetchAudios = async () => {
            try {
                const response = await fetch(`${BASE_URL}/audios`, {
                    method: 'GET', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (data.audios && Array.isArray(data.audios)) {
                    setAudios(data.audios);

                    const colors = data.audios.map(() => getRandomColor());
                    setAudioColors(colors);

                    setLoading(false);
                } else {
                    console.error("Formato de dados inesperado:", data);
                    setLoading(false);
                }
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
            console.log("Tocando áudio:", audioFile);
            await fetch(`${BASE_URL}/play`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ audioFile })
            });
            setMessage(`Tocando ${audioFile.name}`);
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

        console.log("Arquivo selecionado:", selectedAudio); // Verifique se o arquivo é válido

        const formData = new FormData();
        formData.append("audio", selectedAudio);

        try {
            const response = await fetch(`${BASE_URL}/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setMessage(data.message);

            // Atualizar a lista de áudios após o upload
            if (data.message.includes("sucesso")) {
                const updatedAudios = await fetch(`${BASE_URL}/audios`, {
                    method: 'GET', // Ou 'POST', dependendo do tipo de requisição
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
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
                            {audio.name} {/* Exibindo o nome do áudio */}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MesaSom;
